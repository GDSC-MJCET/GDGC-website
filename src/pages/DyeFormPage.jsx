import { useState, useCallback } from 'react';
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Checkbox } from "../components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "../components/ui/radio-group";
import gdglogo from "../assets/gdg-logo.png";
import qrCodeImage from "../assets/qr_code.jpg"; // Import the QR code image
import { createClient } from '@supabase/supabase-js';
import axios from 'axios';

// Supabase client (keys via env)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseApiKey = import.meta.env.VITE_SUPABASE_API_KEY;
const supabase = createClient(supabaseUrl,supabaseApiKey);

// Regex validators
const nameRegex = /^[A-Za-z\s]{2,50}$/; // Allows letters and spaces, 2-50 chars
const yearRegex = /^[1-4](st|nd|rd|th)?$/i; // e.g., 1, 2nd, 3rd, 4th
const branchRegex = /^[A-Za-z\s,-]{2,50}$/; // Allows letters, spaces, commas, hyphens
const phoneRegex = /^[0-9+()\s-]{7,20}$/; // basic international support
const rollRegex = /^[A-Za-z0-9-]{2,20}$/;
const emailRegex = /^[\w.!#$%&'*+/=?`{|}~^-]+@[A-Za-z0-9-]+(\.[A-Za-z0-9-]+)*\.[A-Za-z]{2,}$/;

const interestFields = [
    { id: 'aiml', label: 'AI/ML' },
    { id: 'webdev', label: 'Web Dev' },
    { id: 'cloud', label: 'Cloud Computing' },
    { id: 'dsa', label: 'DSA' },
    { id: 'cybersec', label: 'Cyber Security' },
    { id: 'other', label: 'Other' },
];

export const DyeFormPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    rollNo: '',
    phoneNo: '',
    email: '',
    branch: '',
    year: '',
    interests: [],
    sessionTopics:'',
    hasMembership: '',
    membershipNumber: '',
  });

  const [membershipCardPhoto, setMembershipCardPhoto] = useState(null);
  const [membershipCardPhotoPreview, setMembershipCardPhotoPreview] = useState('');
  const [paymentScreenshot, setPaymentScreenshot] = useState(null);
  const [paymentScreenshotPreview, setPaymentScreenshotPreview] = useState('');

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const uploadFileToSupabase = useCallback(async (file, folder) => {
    if (!file) return null;

    try {
        const fileExt = file.name.split('.').pop();
        const fileName = `${formData.rollNo || 'file'}_${Date.now()}.${fileExt}`;
        const filePath = `${folder}/${fileName}`;

        const { error: uploadError } = await supabase.storage
            .from('dye-event-uploads') // A single bucket for this event
            .upload(filePath, file);

        if (uploadError) {
            throw uploadError;
        }

        const { data: publicUrlData } = supabase.storage
            .from('dye-event-uploads')
            .getPublicUrl(filePath);
            
        return publicUrlData.publicUrl;

    } catch (err) {
        console.error('[Supabase] Upload error:', err);
        setErrors(prev => ({ ...prev, fileUpload: 'Image upload failed. Please try again.' }));
        return null;
    }
  }, [formData.rollNo]);

  const handleInputChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;

    if (type === 'checkbox' && name === 'interests') {
        setFormData(prev => ({
            ...prev,
            interests: checked
                ? [...prev.interests, value]
                : prev.interests.filter(interest => interest !== value)
        }));
    } else {
        setFormData(prev => ({ ...prev, [name]: value }));
    }
  }, []);

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    const file = files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
        if (name === 'membershipCardPhoto') {
            setMembershipCardPhoto(file);
            setMembershipCardPhotoPreview(reader.result);
        } else if (name === 'paymentScreenshot') {
            setPaymentScreenshot(file);
            setPaymentScreenshotPreview(reader.result);
        }
    };
    reader.readAsDataURL(file);
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!nameRegex.test(formData.name)) newErrors.name = 'Please enter a valid name (letters and spaces only).';
    if (!yearRegex.test(formData.year)) newErrors.year = 'Please enter a valid year (e.g., 1, 2, 3, 4).';
    if (!rollRegex.test(formData.rollNo || '')) newErrors.rollNo = 'Enter a valid roll no (letters/numbers/dash)';
    if (!branchRegex.test(formData.branch)) newErrors.branch = 'Please enter a valid branch name.';
    if (!phoneRegex.test(formData.phoneNo || '')) newErrors.phoneNo = 'Enter a valid phone number';
    if (!emailRegex.test(formData.email || '')) newErrors.email = 'Enter a valid email address';
    if (formData.interests.length === 0) newErrors.interests = 'Select at least one interest.';
    if (!formData.hasMembership) newErrors.hasMembership = 'Please select membership status.';

    if (formData.hasMembership === 'yes') {
        if (!formData.membershipNumber) newErrors.membershipNumber = 'Membership ID is required.';
        if (!membershipCardPhoto) newErrors.membershipCardPhoto = 'Membership card photo is required.';
    }
    if (formData.hasMembership === 'no') {
        if (!paymentScreenshot) newErrors.paymentScreenshot = 'Payment screenshot is required.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    if (!validateForm()) {
        return;
    }

    setIsSubmitting(true);
    setSubmitStatus(null);
    setErrors(prev => ({ ...prev, fileUpload: null })); // Clear previous upload error

    let fileUrl = '';
    if (formData.hasMembership === 'yes') {
        fileUrl = await uploadFileToSupabase(membershipCardPhoto, 'membership-cards');
    } else if (formData.hasMembership === 'no') {
        fileUrl = await uploadFileToSupabase(paymentScreenshot, 'payment-screenshots');
    }

    if (!fileUrl) {
        // uploadFileToSupabase will have set an error message
        setIsSubmitting(false);
        return;
    }

    const applicationData = {
      ...formData,
      membershipCardUrl: formData.hasMembership === 'yes' ? fileUrl : null,
      paymentScreenshotUrl: formData.hasMembership === 'no' ? fileUrl : null,
    };

    console.log('Submitting Form Data:', applicationData);

    try {
      // The user's original code used axios to post data.
      // This is a placeholder for how it might be adapted.
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_KEY}/dye-application`, applicationData, {
        //const response = await axios.post('YOUR_BACKEND_URL_HERE', applicationData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      setSubmitStatus('success');
      console.log('Submission successful!', response.data);

      // Reset form
      setFormData({
        name: '', rollNo: '', phoneNo: '', email: '', branch: '', year: '',
        interests: [], sessionTopics: '', hasMembership: '', membershipNumber: '',
      });
      setMembershipCardPhoto(null);
      setMembershipCardPhotoPreview('');
      setPaymentScreenshot(null);
      setPaymentScreenshotPreview('');
      setErrors({});

    } catch (error) {
      console.error('Submission Error:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, membershipCardPhoto, paymentScreenshot, uploadFileToSupabase, validateForm]);

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-foreground">
                Doodle Your Engineering(DYE)
              </h1>
              <p className="text-lg text-muted-foreground mt-2">
                Google Developer Group - MJCET
              </p>
            </div>
          </div>
          <div className="bg-muted/50 rounded-lg p-6 max-w-3xl mx-auto mb-6">
            <p className="text-lg text-muted-foreground mb-2">
              Complete the application form below to confirm your spot for the event.
            </p>
            <p className="text-sm text-red-400">
              All fields marked with * are required. 
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
                            <Card className="shadow-lg">
                                <CardHeader>
                                    <CardTitle className="text-2xl font-bold">Personal Information</CardTitle>
                                    <CardDescription>Please fill in your details.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="grid grid-cols-1 gap-6">
                                        <div className="space-y-2">
                                            <Label htmlFor="name">Full Name *</Label>
                                            <Input id="name" name="name" value={formData.name} onChange={handleInputChange} placeholder="Enter your full name" required />
                                            {errors.name && <p className="text-red-500 text-xs">{errors.name}</p>}
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="year">Year *</Label>
                                            <Input id="year" name="year" value={formData.year} onChange={handleInputChange} placeholder="e.g., 1st, 2nd" required />
                                            {errors.year && <p className="text-red-500 text-xs">{errors.year}</p>}
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="rollNo">Roll No *</Label>
                                            <Input id="rollNo" name="rollNo" value={formData.rollNo} onChange={handleInputChange} placeholder="1604-XX-XXX-XXX" required />
                                            {errors.rollNo && <p className="text-red-500 text-xs">{errors.rollNo}</p>}
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="branch">Branch *</Label>
                                            <Input id="branch" name="branch" value={formData.branch} onChange={handleInputChange} placeholder="e.g., CSE, IT" required />
                                            {errors.branch && <p className="text-red-500 text-xs">{errors.branch}</p>}
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="phoneNo">Phone Number *</Label>
                                            <Input id="phoneNo" name="phoneNo" type="tel" value={formData.phoneNo} onChange={handleInputChange} placeholder="Enter your phone number" required />
                                            {errors.phoneNo && <p className="text-red-500 text-xs">{errors.phoneNo}</p>}
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="email">Email *</Label>
                                            <Input id="email" name="email" type="email" value={formData.email} onChange={handleInputChange} placeholder="you@example.com" required />
                                            {errors.email && <p className="text-red-500 text-xs">{errors.email}</p>}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
        
                            <Card className="shadow-lg">
                                <CardHeader>
                                    <CardTitle className="text-2xl font-bold">Interests</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="space-y-2">
                                        <Label>Field(s) you are interested in *</Label>
                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                            {interestFields.map(field => (
                                                <div key={field.id} className="flex items-center space-x-2">
                                                    <Checkbox
                                                        id={`interest-${field.id}`}
                                                        name="interests"
                                                        value={field.id}
                                                        checked={formData.interests.includes(field.id)}
                                                        onCheckedChange={(checked) => {
                                                            handleInputChange({ target: { name: 'interests', value: field.id, type: 'checkbox', checked } });
                                                        }}
                                                    />
                                                    <Label htmlFor={`interest-${field.id}`} className="font-normal">{field.label}</Label>
                                                </div>
                                            ))}
                                        </div>
                                        {errors.interests && <p className="text-red-500 text-xs">{errors.interests}</p>}
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="sessionTopics">Field(s) you would like to know about in the session</Label>
                                        <Textarea id="sessionTopics" name="sessionTopics" value={formData.sessionTopics} onChange={handleInputChange} placeholder="Tell us what you're excited to learn about!" />
                                    </div>
                                </CardContent>
                            </Card>
        
                            <Card className="shadow-lg">
                                <CardHeader>
                                    <CardTitle className="text-2xl font-bold">Membership & Payment</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="space-y-2">
                                        <Label className="mb-2">Are you a member of the club? *</Label>
                                        <RadioGroup name="hasMembership" value={formData.hasMembership} onValueChange={(value) => handleInputChange({ target: { name: 'hasMembership', value } })} className="flex space-x-4">
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem value="yes" id="mem-yes" />
                                                <Label htmlFor="mem-yes">Yes</Label>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem value="no" id="mem-no" />
                                                <Label htmlFor="mem-no">No</Label>
                                            </div>
                                        </RadioGroup>
                                        {errors.hasMembership && <p className="text-red-500 text-xs">{errors.hasMembership}</p>}
                                    </div>
        
                                    {formData.hasMembership === 'yes' && (
                                        <>
                                            <div className="space-y-2">
                                                <Label htmlFor="membershipNumber">Membership ID/Number *</Label>
                                                <Input id="membershipNumber" name="membershipNumber" value={formData.membershipNumber} onChange={handleInputChange} placeholder="Enter your membership number" required={formData.hasMembership === 'yes'} />
                                                {errors.membershipNumber && <p className="text-red-500 text-xs">{errors.membershipNumber}</p>}
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="membershipCardPhoto">Upload Membership Card Photo *</Label>
                                                <Input id="membershipCardPhoto" name="membershipCardPhoto" type="file" onChange={handleFileChange} accept="image/*" required={formData.hasMembership === 'yes'} />
                                                {membershipCardPhotoPreview && <img src={membershipCardPhotoPreview} alt="Membership card preview" className="mt-2 h-32 object-cover" />}
                                                {errors.membershipCardPhoto && <p className="text-red-500 text-xs">{errors.membershipCardPhoto}</p>}
                                                {errors.fileUpload && formData.hasMembership === 'yes' && <p className="text-red-500 text-xs">{errors.fileUpload}</p>}
                                            </div>
                                        </>
                                    )}
        
                                    {formData.hasMembership === 'no' && (
                                        <div className="space-y-4">
                                            <div className="p-4 border rounded-lg bg-muted/50 flex flex-col items-center">
                                                <h4 className="font-semibold text-lg mb-2">Scan to Pay</h4>
                                                <img 
                                                    src={qrCodeImage} 
                                                    alt="Payment QR Code" 
                                                    className="w-80 h-120 object-contain rounded-md"
                                                />
                                                <p className="text-muted-foreground text-sm mt-2">After paying, upload the screenshot below.</p>
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="paymentScreenshot">Upload Payment Screenshot *</Label>
                                                <Input id="paymentScreenshot" name="paymentScreenshot" type="file" onChange={handleFileChange} accept="image/*" required={formData.hasMembership === 'no'} />
                                                {paymentScreenshotPreview && <img src={paymentScreenshotPreview} alt="Payment screenshot preview" className="mt-2 h-32 object-cover" />}
                                                {errors.paymentScreenshot && <p className="text-red-500 text-xs">{errors.paymentScreenshot}</p>}
                                                {errors.fileUpload && formData.hasMembership === 'no' && <p className="text-red-500 text-xs">{errors.fileUpload}</p>}
                                            </div>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
        
                            <div className="text-center">
                                <Button type="submit" disabled={isSubmitting} className="px-8 py-5 text-lg font-semibold">
                                    {isSubmitting ? 'Submitting...' : 'Submit'}
                                </Button>
                                {submitStatus === 'error' && <p className="text-red-500 text-sm mt-4">Submission failed. Please check your details and try again.</p>}
                            </div>
                        </form>
      </div>

      
      {submitStatus === 'success' && (
            <div className="fixed top-4 right-4 bg-green-500 text-white p-4 rounded-lg shadow-lg">
                <p>Form submitted successfully!</p>
            </div>
        )}
        {submitStatus === 'error' && (
            <div className="fixed top-4 right-4 bg-red-500 text-white p-4 rounded-lg shadow-lg">
                <p>Submission failed. Please try again.</p>
            </div>
        )}

      {/* Footer */}
      <footer className="mt-16 py-8 border-t border-border bg-muted/30">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-foreground mb-2">Need Help?</h3>
            <p className="text-sm text-muted-foreground">
              If you face any difficulties with the website registration, contact:
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-primary font-medium">
            {/* Sami */}
            <div className="flex items-center justify-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span>Sami</span>
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <a href="tel:8125624958" className="hover:underline">
                +91 8125624958
              </a>
            </div>
            
            {/* Abrar */}
            <div className="flex items-center justify-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span>Abrar</span>
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <a href="tel:9876543210" className="hover:underline">
              +91 78424 83580
              </a>
            </div>
            
            {/* Aimen */}
            <div className="flex items-center justify-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span>Aimen</span>
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <a href="tel:8765432109" className="hover:underline">
              +91 96760 71331
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};