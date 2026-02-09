import { useState, useCallback } from 'react';
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { createClient } from '@supabase/supabase-js';
import axios from 'axios';
import Nav from '../components/Nav';
import Footer from '../components/Footer';
import Background from '../components/Background';

// Supabase client (keys via env)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseApiKey = import.meta.env.VITE_SUPABASE_API_KEY;
const supabase = createClient(supabaseUrl,supabaseApiKey);

// Regex validators
const nameRegex = /^[A-Za-z\s]{2,50}$/; // Allows letters and spaces, 2-50 chars
const rollRegex = /^[A-Za-z0-9-]{2,20}$/;
export default function TDForm() {

  const [formData, setFormData] = useState({
    clubName: '',
    
    teamMembers:[
        {name:'',rollNo:'',isLeader:true},
        {name:'',rollNo:'',isLeader:false},
        {name:'',rollNo:'',isLeader:false},
        {name:'',rollNo:'',isLeader:false},
        {name:'',rollNo:'',isLeader:false}
    ]
    
  });

  const [membershipCardPhoto, setMembershipCardPhoto] = useState(null);

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [clubImage, setClubImage] = useState(null);
  const [clubImagePreview, setClubImagePreview] = useState('');

  const uploadFileToSupabase = useCallback(async (file, folder) => {
    if (!file) return null;

    try {
        const fileExt = file.name.split('.').pop();
        const fileName = `${formData.rollNo || 'file'}_${Date.now()}.${fileExt}`;
        const filePath = `${folder}/${fileName}`;

        const { error: uploadError } = await supabase.storage
            .from('tech-debate-clubs') // A single bucket for this event
            .upload(filePath, file);

        if (uploadError) {
            throw uploadError;
        }

        const { data: publicUrlData } = supabase.storage
            .from('tech-debate-clubs')
            .getPublicUrl(filePath);
            
        return publicUrlData.publicUrl;

    } catch (err) {
        console.error('[Supabase] Upload error:', err);
        setErrors(prev => ({ ...prev, fileUpload: 'Image upload failed. Please try again.' }));
        return null;
    }
  }, [formData.clubName]);

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    if (name === 'clubName') {
        setFormData(prev => ({ ...prev, clubName: value }));
        return;
    }
    if (name === 'teamLeader') {
        setFormData(prev => {
        const updatedMembers = [...prev.teamMembers];
        updatedMembers[0].name = value;
        return { ...prev, teamMembers: updatedMembers };
        });
        return;
    }
    if (name === 'leaderRollNo') {
        setFormData(prev => {
        const updatedMembers = [...prev.teamMembers];
        updatedMembers[0].rollNo = value;
        return { ...prev, teamMembers: updatedMembers };
        });
        return;
    }
    const memberMatch = name.match(/^teamMember(\d)$/);
    const rollMatch = name.match(/^member(\d)RollNo$/);
    if (memberMatch) {
        const idx = parseInt(memberMatch[1], 10);
        setFormData(prev => {
        const updatedMembers = [...prev.teamMembers];
        updatedMembers[idx].name = value;
        return { ...prev, teamMembers: updatedMembers };
        });
        return;
    }
    if (rollMatch) {
        const idx = parseInt(rollMatch[1], 10);
        setFormData(prev => {
        const updatedMembers = [...prev.teamMembers];
        updatedMembers[idx].rollNo = value;
        return { ...prev, teamMembers: updatedMembers };
        });
        return;
    }
    }, []);

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    const file = files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
            setClubImage(file);
            setClubImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const validateForm = () => {
    const newErrors = {};
    formData.teamMembers.forEach((member, idx) => {
        if (!nameRegex.test(member.name)) {
        newErrors[`name${idx}`] = 'Please enter a valid name (letters and spaces only).';
        }
        if (!rollRegex.test(member.rollNo)) {
        newErrors[`rollNo${idx}`] = 'Enter a valid roll no (letters/numbers/dash)';
        }
    });
    
    if (!clubImage) newErrors.clubImage = 'Club image is required.';

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
   
    fileUrl = await uploadFileToSupabase(clubImage, 'club-image');
    
    if (!fileUrl) {
        // uploadFileToSupabase will have set an error message
        setIsSubmitting(false);
        return;
    }
    const tempFileUrl = fileUrl ;

    const applicationData = {
      ...formData,
      clubImageUrl : tempFileUrl
    };

    
    try {
      // The user's original code used axios to post data.
      // This is a placeholder for how it might be adapted.
      const response = await axios.post(`http://localhost:3009/api/v1/techdebate/form`, applicationData, {
        //const response = await axios.post('YOUR_BACKEND_URL_HERE', applicationData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      setSubmitStatus('success');
      

      // Reset form
      setFormData({
        clubName: '',
        teamMembers:[
        {name: '', rollNo: '', isLeader: true},
        {name: '', rollNo: '', isLeader: false},
        {name: '', rollNo: '', isLeader: false},
        {name: '', rollNo: '', isLeader: false},
        {name: '', rollNo: '', isLeader: false}
    ]
      });
      setClubImage(null);
      setClubImagePreview('')
      setErrors({});
      setTimeout(() => {
        setSubmitStatus(null);
        }, 3000);

      

    } catch (error) {
    //   console.error('Submission Error:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, clubImage, uploadFileToSupabase, validateForm]);

  return (
    <>
   
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
          }}>TECH FACE-OFF:</span>
             <span className='text-[#5ddb6e]'  style={{
            textShadow: "0 0 40px rgba(93, 219, 110, 0.4)",
          }}> The Verdict</span>
                
              </h1>
              <p className="text-lg text-muted-foreground mt-2">
                Google Developer Group - MJCET
              </p>
            </div>
          </div>
          <div className="bg-muted/50 rounded-lg p-6 max-w-3xl mx-auto mb-6">
            <p className="text-lg text-muted-foreground mb-2">
              Complete the application form below to confirm club for the event.
            </p>
            <p className="text-sm text-red-400">
              All fields marked with * are required. 
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
                            <Card className='shadow-lg'>
                                <CardHeader>
                                    <CardTitle className="2xl font-bold">Club Information</CardTitle>
                                    <CardDescription>Club related information</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                                <Label htmlFor="clubName">Club Name*</Label>
                                                <Input id="clubName" name="clubName" value={formData.clubName} onChange={handleInputChange} placeholder="Enter the club name" required />
                                                {errors.name && <p className="text-red-500 text-xs">{errors.name}</p>}
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="clubImage">Upload Club Image *</Label>
                                                <Input id="clubImage" name="clubImage" type="file" onChange={handleFileChange} accept="image/*" required />
                                                {clubImagePreview && <img src={clubImagePreview} alt="Payment screenshot preview" className="mt-2 h-32 object-cover" />}
                                                {errors.clubImage && <p className="text-red-500 text-xs">{errors.clubImage}</p>}
                                                {errors.fileUpload && formData.clubImageUrl === 'no' && <p className="text-red-500 text-xs">{errors.fileUpload}</p>}
                                            </div>
                                </CardContent>
                            </Card>
                            <Card className='shadow-lg'>
                                <CardHeader>
                                    <CardTitle className="2xl font-bold">Team Leader</CardTitle>
                                    <CardDescription>Details of the team leader</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                                <Label htmlFor="teamLeader">Full Name*</Label>
                                                <Input id="teamLeader" name="teamLeader" value={formData.teamMembers[0].name} onChange={handleInputChange} placeholder="Enter the full name of the team leader" required />
                                                {errors.name0 && <p className="text-red-500 text-xs">{errors.name0}</p>}
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="leaderRollNo">Roll No*</Label>
                                                <Input id="leaderRollNo" name="leaderRollNo" value={formData.teamMembers[0].rollNo} onChange={handleInputChange} placeholder="1604-XX-XXX-XXX" required />
                                                {errors.rollNo0 && <p className="text-red-500 text-xs">{errors.rollNo0}</p>}
                                            </div>
                                </CardContent>
                            </Card>
                            <Card className='shadow-lg'>
                                <CardHeader>
                                    <CardTitle className="2xl font-bold">Team Member 1</CardTitle>
                                    <CardDescription>Details of team member 1</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                                <Label htmlFor="teamMember1">Full Name*</Label>
                                                <Input id="teamMember1" name="teamMember1" value={formData.teamMembers[1].name} onChange={handleInputChange} placeholder="Enter the full name of team member 1" required />
                                                {errors.name1 && <p className="text-red-500 text-xs">{errors.name1}</p>}
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="member1RollNo">Roll No*</Label>
                                                <Input id="member1RollNo" name="member1RollNo" value={formData.teamMembers[1].rollNo} onChange={handleInputChange} placeholder="1604-XX-XXX-XXX" required />
                                                {errors.rollNo1 && <p className="text-red-500 text-xs">{errors.rollNo1}</p>}
                                            </div>
                                </CardContent>
                            </Card>
                            <Card className='shadow-lg'>
                                <CardHeader>
                                    <CardTitle className="2xl font-bold">Team Member 2</CardTitle>
                                    <CardDescription>Details of team member 2</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                                <Label htmlFor="teamMember2">Full Name*</Label>
                                                <Input id="teamMember2" name="teamMember2" value={formData.teamMembers[2].name} onChange={handleInputChange} placeholder="Enter the full name of team member 2" required />
                                                {errors.name2 && <p className="text-red-500 text-xs">{errors.name2}</p>}
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="member2RollNo">Roll No *</Label>
                                                <Input id="member2RollNo" name="member2RollNo" value={formData.teamMembers[2].rollNo} onChange={handleInputChange} placeholder="1604-XX-XXX-XXX" required />
                                                {errors.rollNo2 && <p className="text-red-500 text-xs">{errors.rollNo2}</p>}
                                            </div>
                                </CardContent>
                            </Card>
                            <Card className='shadow-lg'>
                                <CardHeader>
                                    <CardTitle className="2xl font-bold">Team Member 3</CardTitle>
                                    <CardDescription>Details of team member 3</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                                <Label htmlFor="teamMember3">Full Name*</Label>
                                                <Input id="teamMember3" name="teamMember3" value={formData.teamMembers[3].name} onChange={handleInputChange} placeholder="Enter the full name of team member 3" required />
                                                {errors.name3 && <p className="text-red-500 text-xs">{errors.name3}</p>}
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="member3RollNo">Roll No*</Label>
                                                <Input id="member3RollNo" name="member3RollNo" value={formData.teamMembers[3].rollNo} onChange={handleInputChange} placeholder="1604-XX-XXX-XXX" required />
                                                {errors.rollNo3 && <p className="text-red-500 text-xs">{errors.rollNo3}</p>}
                                            </div>
                                </CardContent>
                            </Card>
                            <Card className='shadow-lg'>
                                <CardHeader>
                                    <CardTitle className="2xl font-bold">Team Member 4</CardTitle>
                                    <CardDescription>Details of team member 4</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                                <Label htmlFor="teamMember4">Full Name*</Label>
                                                <Input id="teamMember4" name="teamMember4" value={formData.teamMembers[4].name} onChange={handleInputChange} placeholder="Enter the full name of team member 3" required />
                                                {errors.name4 && <p className="text-red-500 text-xs">{errors.name4}</p>}
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="member4RollNo">Roll No*</Label>
                                                <Input id="member4RollNo" name="member4RollNo" value={formData.teamMembers[4].rollNo} onChange={handleInputChange} placeholder="1604-XX-XXX-XXX" required />
                                                {errors.rollNo4 && <p className="text-red-500 text-xs">{errors.rollNo4}</p>}
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
