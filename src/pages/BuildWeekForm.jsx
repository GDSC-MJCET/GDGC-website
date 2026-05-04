import { useState, useCallback } from 'react';
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Toaster, toast } from 'react-hot-toast';

import axios from 'axios';
import Nav from '../components/Nav';
import Footer from '../components/Footer';
import Background from '../components/Background';

const domain1Options = [
  'Web Basic',
  'Web Intermediate',
  'AMIL',
  'CyberSecurity',
];

const domain2Options = [
  'UI/UX',
  'Cloud',
  'GenAI',
  'DSA',
];



// Regex validators
const nameRegex = /^[A-Za-z\s]{2,50}$/; // Allows letters and spaces, 2-50 chars
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^\+?\d{10,15}$/;
const collegeRegex = /^[A-Za-z0-9&.,'()\-\s]{2,100}$/;
const rollRegex = /^[A-Za-z0-9-]{2,20}$/;
export default function BuildWeekForm() {

  const [formData, setFormData] = useState({
    name:"",
    email:"",
    college:"",
    roll_no:"",
    phone_no:"",
    domain1:"",
    domain2:"",
    github:"",
    leetcode:"",

    
  });

  const [membershipCardPhoto, setMembershipCardPhoto] = useState(null);

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    }, []);

  

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim() || !nameRegex.test(formData.name)) {
        newErrors.name = 'Please enter a valid name (letters and spaces only).';
    }
    if (formData.email && !emailRegex.test(formData.email)) {
        newErrors.email = 'Please enter a valid email address.';
    }
    if (!formData.college.trim() || !collegeRegex.test(formData.college)) {
        newErrors.college = 'Please enter a valid college name.';
    }
    if (!formData.roll_no.trim() || !rollRegex.test(formData.roll_no)) {
        newErrors.roll_no = 'Enter a valid roll no (letters/numbers/dash).';
    }
    if (!formData.phone_no.trim() || !phoneRegex.test(formData.phone_no)) {
      newErrors.phone_no = 'Please enter a valid phone number.';
    }
    if (!formData.domain1) {
      newErrors.domain1 = 'Please select a domain choice.';
    }
    if (!formData.github.trim()){
      newErrors.github = 'Please enter your GitHub profile or username.';
    }
    const selectedDomains = [formData.domain1, formData.domain2];
    const needsLeetcode = selectedDomains.includes('DSA');
    if (needsLeetcode && !formData.leetcode.trim()) {
      newErrors.leetcode = 'Please enter your LeetCode profile or username.';
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


    const applicationData = {
      ...formData
    };

    
    try {
      // The user's original code used axios to post data.
      // This is a placeholder for how it might be adapted.
    
      const response = await axios.post(`${import.meta.env.VITE_SERVER}`+"/api/v1/buildweek/form", applicationData, {
        //const response = await axios.post('YOUR_BACKEND_URL_HERE', applicationData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      setSubmitStatus('success');
      toast.success(response?.data?.message || 'Form submitted successfully.');
      

      // Reset form
      setFormData({
        name: '',
        email: '',
        college: '',
        roll_no: '',
        phone_no: '',
        domain1: '',
        domain2: '',
        github: '',
        leetcode: '',

      });
      
      setErrors({});
      setTimeout(() => {
        setSubmitStatus(null);
        }, 3000);

      

    } catch (error) {
      if (error?.response?.status === 401) {
        toast.error(error?.response?.data?.message );
      } else {
        toast.error(error?.response?.data?.message );
      }
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, validateForm]);

  return (
    <>
    <Toaster />
   
    <Background bgColor="#0b0b0b"
      columnColor="rgba(87, 203, 255, 0.1)"
      dotColor="rgba(87,203,255,0.6)"
      dotGlowColor="rgba(87,203,255,0.9)">
    <Nav bgColor='#0b0b0b'/>
    <div className="min-h-screen py-12 px-4 font-mono">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-foreground">
                <span className='text-[#57cbff]' style={{
            textShadow: "0 0 40px rgba(87, 203, 255, 0.4)",
          }}>EP-4</span>
             <span className='text-[#5ddb6e]'  style={{
            textShadow: "0 0 40px rgba(93, 219, 110, 0.4)",
          }}> Build Week</span>
                
              </h1>
              <p className="text-lg text-muted-foreground mt-2">
                Google Developer Group - MJCET
              </p>
            </div>
          </div>
          <div className="bg-muted/50 rounded-lg p-6 max-w-3xl mx-auto mb-6">
            <p className="text-lg text-muted-foreground mb-2">
              Complete the application form below to confirm your spot for the workshops.
            </p>
            <p className="text-sm text-red-400">
              All fields marked with * are required. 
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <Card className='shadow-lg'>
            <CardHeader>
              <CardTitle className="2xl font-bold">Personal Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name*</Label>
                <Input id="name" name="name" value={formData.name} onChange={handleInputChange} placeholder="Enter your full name" required />
                {errors.name && <p className="text-red-500 text-xs">{errors.name}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email*</Label>
                <Input id="email" name="email" type="email" value={formData.email} onChange={handleInputChange} placeholder="Enter your email" required />
                {errors.email && <p className="text-red-500 text-xs">{errors.email}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="college">College Name*</Label>
                <Input id="college" name="college" value={formData.college} onChange={handleInputChange} placeholder="Enter your college name" required />
                {errors.college && <p className="text-red-500 text-xs">{errors.college}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="roll_no">Roll No*</Label>
                <Input id="roll_no" name="roll_no" value={formData.roll_no} onChange={handleInputChange} placeholder="1604-XX-XXX-XXX" required />
                {errors.roll_no && <p className="text-red-500 text-xs">{errors.roll_no}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone_no">Phone Number*</Label>
                <Input id="phone_no" name="phone_no" value={formData.phone_no} onChange={handleInputChange} placeholder="+91XXXXXXXXXX" required />
                {errors.phone_no && <p className="text-red-500 text-xs">{errors.phone_no}</p>}
              </div>
            </CardContent>
          </Card>

          <Card className='shadow-lg'>
            <CardHeader>
              <CardTitle className="2xl font-bold">Domain Choices</CardTitle>
              <CardDescription>Select two preferred domains</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="domain1">Domain 1*</Label>
                <select id="domain1" name="domain1" value={formData.domain1} onChange={handleInputChange} required className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                  <option value="">Select a domain</option>
                  {domain1Options.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
                {errors.domain1 && <p className="text-red-500 text-xs">{errors.domain1}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="domain2">Domain 2 </Label>
                <select id="domain2" name="domain2" value={formData.domain2} onChange={handleInputChange} className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                  <option value="">Select a domain</option>
                  {domain2Options.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
                {errors.domain2 && <p className="text-red-500 text-xs">{errors.domain2}</p>}
              </div>
            </CardContent>
          </Card>

          <Card className='shadow-lg'>
            <CardHeader>
              <CardTitle className="2xl font-bold">Socials</CardTitle>
              <CardDescription>Share the profiles that match your selected domain choices</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="github">GitHub * </Label>
                <Input id="github" name="github" value={formData.github} required onChange={handleInputChange} placeholder="GitHub username or profile URL" />
                {errors.github && <p className="text-red-500 text-xs">{errors.github}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="leetcode">LeetCode {(formData.domain1 === 'DSA' || formData.domain2 === 'DSA') ? '*' : '(required if you choose DSA)'}</Label>
                <Input id="leetcode" name="leetcode" value={formData.leetcode} onChange={handleInputChange} placeholder="LeetCode username or profile URL" />
                {errors.leetcode && <p className="text-red-500 text-xs">{errors.leetcode}</p>}
              </div>
            </CardContent>
          </Card>
        
            <div className="text-center">
                <Button type="submit" disabled={isSubmitting} className="px-8 py-5 text-lg font-semibold">
                    {isSubmitting ? 'Submitting...' : 'Submit'}
                </Button>
                {submitStatus === 'error' && <p className="text-red-500 text-sm mt-4">Submission failed. Please check your details and try again</p>}
            </div>
        </form>
      </div>

      
      {submitStatus === 'success' && (
            <div className="fixed top-4 right-4 bg-green-500 text-white p-4 rounded-lg shadow-lg">
                <p>Registration successfull </p>
            </div>
        )}
        {submitStatus === 'error' && (
            <div className="fixed top-4 right-4 bg-red-500 text-white p-4 rounded-lg shadow-lg">
                <p>Submission failed. Please try again.</p>
            </div>
        )}

      {/* Footer */}
      <footer className="mt-16 py-8 rounded-lg border bg-muted/30 ">
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
    <Footer bgColor="#0b0b0b"/>
    </Background>
    </>
  );
};
