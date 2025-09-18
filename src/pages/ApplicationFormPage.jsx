import { useState, useCallback } from 'react';
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Checkbox } from "../components/ui/checkbox";
import gdglogo from "../assets/gdg-logo.png";
import { createClient } from '@supabase/supabase-js';
import axios from 'axios';

// Supabase client (keys via env)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseApiKey = import.meta.env.VITE_SUPABASE_API_KEY;
const supabase = createClient(supabaseUrl,supabaseApiKey);


const portfolios = [
  {
    id: 'web',
    name: 'Web Development',
    description: 'Build amazing websites and web applications using modern technologies',
    color: 'bg-blue-500'
  },
  {
    id: 'app',
    name: 'Mobile App Development',
    description: 'Create innovative mobile applications for iOS and Android platforms',
    color: 'bg-green-500'
  },
  {
    id: 'cybersecurity',
    name: 'Cybersecurity',
    description: 'Protect digital assets and ensure security in the digital world',
    color: 'bg-red-500'
  },
  {
    id: 'aiml',
    name: 'AI/ML',
    description: 'Explore artificial intelligence and machine learning technologies',
    color: 'bg-purple-500'
  },
  {
    id: 'cloud',
    name: 'Cloud Computing',
    description: 'Work with cloud platforms and scalable infrastructure solutions',
    color: 'bg-yellow-500'
  },
  {
    id: 'uiux',
    name: 'UI/UX Design',
    description: 'Design beautiful and user-friendly interfaces and experiences',
    color: 'bg-pink-500'
  },
  {
    id: 'hr',
    name: 'Human Resources',
    description: 'Manage people, culture, and organizational development',
    color: 'bg-indigo-500'
  },
  {
    id: 'media',
    name: 'Media & Content',
    description: 'Create engaging content and manage media presence',
    color: 'bg-orange-500'
  },
  {
    id: 'design',
    name: 'Graphic Design',
    description: 'Create visual designs, branding, and creative assets',
    color: 'bg-teal-500'
  },
  {
    id: 'marketing',
    name: 'Marketing',
    description: 'Develop marketing strategies and promotional campaigns',
    color: 'bg-cyan-500'
  },
  {
    id: 'doc',
    name: 'Documentation & Editorial',
    description: 'Create technical documentation and editorial content',
    color: 'bg-gray-500'
  },
  {
    id: 'pr',
    name: 'PR & Outreach',
    description: 'Manage public relations and community outreach initiatives',
    color: 'bg-rose-500'
  } , 
  {
    id : 'log',
    name : "Logistics & Operations",
    description : "Manage logistics and operations for events and activities",
    color : "bg-emerald-500"
  }
];

export const ApplicationFormPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    rollNo: '',
    phoneNo: '',
    email: '',
    branch: '',
    year: '',
    resume: '',
    linkedin: '',
    previousWork: '',
    github: '',
    portfolio1: '',
    portfolio2: '',
    customPortfolio: ''
  });

  const [selectedPortfolios, setSelectedPortfolios] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [resumeFile, setResumeFile] = useState(null);
  const [resumeUrl, setResumeUrl] = useState("");
  const [uploadError, setUploadError] = useState("");
  const [hoveredInfoId, setHoveredInfoId] = useState(null);
  const [errors, setErrors] = useState({});
  const [prevWorkWords, setPrevWorkWords] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  // Regex validators
  const emailRegex = /^[\w.!#$%&'*+/=?`{|}~^-]+@[A-Za-z0-9-]+(\.[A-Za-z0-9-]+)*\.[A-Za-z]{2,}$/;
  const phoneRegex = /^[0-9+()\s-]{7,20}$/; // basic international support
  const rollRegex = /^[A-Za-z0-9-]{2,20}$/;

  const portfolioInfo = {
    hr: {
      title: 'Human Resources',
      summary: 'Build and nurture the chapter community; keep communication clear and culture inclusive.',
      bullets: [
        'Facilitate comms between members and core team',
        'Own onboarding and member retention',
        'Run bonding/teambuilding activities',
      ],
    },
    doc: {
      title: 'Documentation / Editorial',
      summary: 'Maintain professional records and written content with accuracy and consistency.',
      bullets: [
        'Record meetings, events and activities',
        'Draft newsletters, captions, letters and reports',
        'Edit articles/blogs and enforce style consistency',
      ],
    },
    design: {
      title: 'Design',
      summary: 'Own the visual identity; create clean, consistent designs for events and outreach.',
      bullets: [
        'Create posters and social graphics',
        'Keep a consistent design language',
        'Collaborate with Marketing & Media',
      ],
    },
    marketing: {
      title: 'Marketing',
      summary: 'Drive campaigns and visibility for events and initiatives across channels.',
      bullets: [
        'Plan digital/offline campaigns',
        'Own social content strategy',
        'Partner with Design & PR for impact',
      ],
    },
    pr: {
      title: 'PR & Outreach',
      summary: 'Build partnerships on/off campus and manage external communications.',
      bullets: [
        'Collaborate with clubs/chapters/orgs',
        'Drive partnerships and external comms',
        'Engage alumni, mentors and industry',
      ],
    },
    media: {
      title: 'Media',
      summary: 'Capture and tell our story through photo/video and digital content.',
      bullets: [
        'Cover events (photo/video) and produce recaps',
        'Maintain media archives',
        'Guide basics of shooting and editing',
      ],
    },
    web: {
      title: 'Web',
      summary: 'Build/maintain web projects; mentor members in modern web stacks.',
      bullets: [
        'Projects using HTML/CSS/JS & frameworks',
        'Deploy/host with good version control',
        'Prep members for hackathons',
      ],
    },
    app: {
      title: 'App',
      summary: 'Lead mobile projects; teach Android/iOS/cross‑platform tooling.',
      bullets: [
        'Ship app projects for events/chapter',
        'Cover deployment/publishing basics',
        'Make members industry/hackathon ready',
      ],
    },
    cybersecurity: {
      title: 'Cybersecurity',
      summary: 'Grow skills in security, ethical hacking and safe systems.',
      bullets: [
        'Workshops on tools and fundamentals',
        'Projects for secure apps/systems',
        'Intro to pentesting and best practices',
      ],
    },
    aiml: {
      title: 'AI/ML',
      summary: 'Apply ML to real problems; mentor in Python, data and modeling.',
      bullets: [
        'Teach data prep and ML libraries',
        'Lead practical AI/ML projects',
        'Support hackathons/research',
      ],
    },
    cloud: {
      title: 'Cloud',
      summary: 'Develop cloud and DevOps skills; deploy chapter projects.',
      bullets: [
        'Google Cloud/AWS/Azure basics',
        'CI/CD and monitoring practices',
        'Hackathon‑ready cloud workflows',
      ],
    },
    uiux: {
      title: 'UI/UX',
      summary: 'Champion usability and design thinking; prototype and test.',
      bullets: [
        'Teach accessibility and design systems',
        'Create wireframes/prototypes',
        'Collaborate with Web/App teams',
      ],
    },
    log: {
      title: 'Operations/Logistics',
      summary: 'The Operations/Logistics portfolio ensures smooth execution of events and activities by managing the behind-the-scenes work. The lead handles resources, planning, and coordination to ensure efficiency.',
      bullets: [
        'Manage event logistics including venues, equipment, and permissions',
        'Coordinate with teams to ensure timely execution of plans',
        'Oversee scheduling, budgeting, and resource allocation',
        'Teach members event management and organizational skills',
      ],
    },
  };

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    if (name === 'previousWork') {
      const words = value.trim().split(/\s+/).filter(Boolean);
      setPrevWorkWords(words.length);
      if (words.length > 100) {
        const limited = words.slice(0, 100).join(' ');
        setFormData(prev => ({ ...prev, [name]: limited }));
        return;
      }
    }
    setFormData(prev => ({ ...prev, [name]: value }));
  }, []);

  const uploadResume = useCallback(async (fileArg) => {
    const file = fileArg || resumeFile;
    if (!file) return null;
    setIsUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${formData.rollNo || 'resume'}_${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;
      const { data, error } = await supabase.storage.from('resumes').upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
        contentType: file.type,
      });
      if (error) throw error;
      const { data: publicUrlData } = supabase.storage.from('resumes').getPublicUrl(data.path);
      return publicUrlData.publicUrl;
    } catch (err) {
      console.error('[Supabase] Upload error:', err);
      setUploadError('Resume upload failed. Please try again.');
      return null;
    } finally {
      setIsUploading(false);
    }
  }, [resumeFile, formData.rollNo]);

  

  const handleResumePick = useCallback(async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadError("");
    setResumeFile(file);
    setResumeUrl("");
    // Immediately upload on pick for clearer UX
    const url = await uploadResume(file);
    if (url) setResumeUrl(url);
  }, [uploadResume]);

  
  const handlePortfolioToggle = useCallback((portfolioId) => {
    setSelectedPortfolios(current => {
      if (current.includes(portfolioId)) {
        return current.filter(id => id !== portfolioId);
      } else if (current.length < 2) {
        return [...current, portfolioId];
      }
      return current;
    });
  }, []);

  const handleCustomPortfolioToggle = useCallback(() => {
    if (!formData.customPortfolio.trim()) return;
    
    setSelectedPortfolios(current => {
      if (current.includes('custom')) {
        return current.filter(id => id !== 'custom');
      } else if (current.length < 2) {
        return [...current, 'custom'];
      }
      return current;
    });
  }, [formData.customPortfolio]);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    
    // Client-side validation
    const newErrors = {};
    if (!emailRegex.test(formData.email || '')) newErrors.email = 'Enter a valid email address';
    if (!phoneRegex.test(formData.phoneNo || '')) newErrors.phoneNo = 'Enter a valid phone number';
    if (!rollRegex.test(formData.rollNo || '')) newErrors.rollNo = 'Enter a valid roll no (letters/numbers/dash)';
    const words = (formData.previousWork || '').trim().split(/\s+/).filter(Boolean);
    if (words.length > 100) newErrors.previousWork = 'Maximum 100 words';
    if (selectedPortfolios.length !== 2) newErrors.portfolios = 'You must select exactly 2 portfolios';
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    // Ensure resume uploaded
    if (!resumeUrl) {
      // try uploading if we have file but no url yet
      if (resumeFile && !isUploading) {
        const uploaded = await uploadResume();
        if (uploaded) setResumeUrl(uploaded);
      }
    }
    if (!resumeUrl) return; // guard: block submit until uploaded

    setIsSubmitting(true);
    setSubmitStatus(null);

    // Format data according to the specified structure
    const applicationData = {
      name: formData.name,
      rollNo: formData.rollNo,
      phoneNo: formData.phoneNo,
      branch: formData.branch,
      year: formData.year,
      resume: resumeUrl,
      email: formData.email,
      linkedin: formData.linkedin,
      github: formData.github,
      previousWork: formData.previousWork,
      customPortfolio: formData.customPortfolio,
      selectedPortfolios: selectedPortfolios,
      portfolio1: selectedPortfolios[0] === 'custom' ? formData.customPortfolio : selectedPortfolios[0] || null,
      portfolio2: selectedPortfolios[1] === 'custom' ? formData.customPortfolio : selectedPortfolios[1] || null
    };

    try {
      // Replace with your actual API endpoint
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_KEY}/application`, applicationData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      setSubmitStatus('success');
      
      // Reset form on successful submission
      setFormData({
        name: '',
        rollNo: '',
        phoneNo: '',
        email: '',
        branch: '',
        year: '',
        resume: '',
        linkedin: '',
        previousWork: '',
        github: '',
        portfolio1: '',
        portfolio2: '',
        customPortfolio: ''
      });
      setSelectedPortfolios([]);
      setResumeFile(null);
      setResumeUrl("");
      
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, selectedPortfolios, resumeFile, resumeUrl, uploadResume]);

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-foreground">
                Executive Committee Application
              </h1>
              <p className="text-lg text-muted-foreground mt-2">
                Google Developer Group - MJCET
              </p>
            </div>
          </div>
          <div className="bg-muted/50 rounded-lg p-6 max-w-3xl mx-auto mb-6">
            <p className="text-lg text-muted-foreground mb-2">
              Complete the application form below to be considered for the Executive Committee position.
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
              <CardDescription>Tell us about yourself</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-medium">Full Name *</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter your full name"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="rollNo" className="text-sm font-medium">Roll Number *</Label>
                  <Input
                    id="rollNo"
                    name="rollNo"
                    value={formData.rollNo}
                    onChange={handleInputChange}
                    maxLength={15}
                    placeholder="1604-XX-XXX-XXX"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phoneNo" className="text-sm font-medium">Phone Number *</Label>
                  <Input
                    id="phoneNo"
                    name="phoneNo"
                    type="tel"
                    value={formData.phoneNo}
                    onChange={handleInputChange}
                    placeholder="Enter your phone number"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">Email *</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="you@example.com"
                    required
                  />
                  {errors.email && (
                    <p className="text-xs text-red-600">{errors.email}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="branch" className="text-sm font-medium">Branch *</Label>
                  <Input
                    id="branch"
                    name="branch"
                    value={formData.branch}
                    onChange={handleInputChange}
                    placeholder="Enter your branch"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="year" className="text-sm font-medium">Year *</Label>
                  <Input
                    id="year"
                    name="year"
                    value={formData.year}
                    onChange={handleInputChange}
                    placeholder="e.g., 2nd Year, 3rd Year"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="resume" className="text-sm font-medium">Resume (PDF) </Label>
                  <div className="flex flex-col items-center gap-3">
                    <Input
                      id="resume"
                      name="resume-file"
                      type="file"
                      accept="application/pdf"
                      onChange={handleResumePick}
                      className=""
                    />
                    {resumeFile && (
                      <span className="text-xs text-muted-foreground truncate max-w-[12rem]">
                      {resumeFile.name}
                      </span>
                    )}
                  </div>
                    <p className="text-xs text-muted-foreground  md:w-full">If you are unable to submit your resume , submit  withoutuploading and DM us later</p>
                  <div className="flex items-center gap-2 mt-1">
                    {isUploading && (
                      <svg className="h-4 w-4 animate-spin text-blue-600" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                      </svg>
                    )}
                    {!isUploading && resumeUrl && (
                      <span className="text-xs text-green-600">Uploaded ✓</span>
                    )}
                    {!resumeUrl && !isUploading && (
                      <span className="text-xs text-muted-foreground">Upload a PDF file. Max ~1MB.</span>
                    )}
                    {uploadError && (
                      <span className="text-xs text-red-600">{uploadError}</span>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl font-bold">Portfolio Selection</CardTitle>
              <CardDescription>
                Select up to 2 portfolios that align with your interests and skills. These will be considered for role assignment.
                <p className='text-sm text-red-400'>Click on the info button to know more about the portfolios.</p>
              </CardDescription>

            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {portfolios.map((portfolio) => {
                  const isSelected = selectedPortfolios.includes(portfolio.id);
                  const selectionIndex = selectedPortfolios.indexOf(portfolio.id);
                  
                  return (
<div className="relative">
   <div
     key={portfolio.id}
     className={`relative p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 hover:scale-105 select-none md:h-40 ${
       isSelected
         ? 'border-primary bg-primary/5 shadow-md'
         : 'border-border hover:border-muted-foreground/50'
     }`}
     onClick={() => handlePortfolioToggle(portfolio.id)}
   >
     <button
       type="button"
       onMouseEnter={() => setHoveredInfoId(portfolio.id)}
       onMouseLeave={() => setHoveredInfoId(null)}
       onClick={(e) => e.stopPropagation()}
       aria-label="About portfolio"
       className={`absolute top-4 left-2 h-6 w-6 rounded-full flex items-center justify-center ${portfolio.color} text-white shadow-sm border border-white/60 dark:border-neutral-700 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring`}
     >
      <svg viewBox="0 0 20 20" fill="currentColor" className="h-3.5 w-3.5">
        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM9 8a1 1 0 112 0 1 1 0 01-2 0zm.25 2.75a.75.75 0 011.5 0v3.5a.75.75 0 11-1.5 0v-3.5z" clipRule="evenodd" />
      </svg>
    </button>
    <div className="ml-6 flex items-start space-x-3">
      <div className="flex-1">
        <h3 className="font-semibold mb-1">{portfolio.name}</h3>
        <p className="text-sm text-muted-foreground">{portfolio.description}</p>
      </div>
      <div className="mt-1">
        <div className={`w-4 h-4 rounded border ${
          isSelected 
            ? 'bg-primary border-primary' 
            : 'border-muted-foreground/50'
        } flex items-center justify-center`}>
          {isSelected && (
            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          )}
        </div>
      </div>
    </div>
    {isSelected && (
      <Badge variant="secondary" className="absolute top-2 right-2">
        {selectionIndex === 0 ? 'P1' : 'P2'}
      </Badge>
    )}
  </div>
  
   {/* Hover popup positioned relative to card */}
   {hoveredInfoId === portfolio.id && (
     <div
       className="absolute z-50 top-12 left-2 w-72 rounded-md border border-border bg-card p-3 shadow-xl"
       style={{ 
         opacity: 1,
         pointerEvents: 'auto'
       }}
     >
      <div className="mb-1 text-sm font-semibold">{portfolioInfo[portfolio.id]?.title || portfolio.name}</div>
      <div className="text-sm text-muted-foreground">
        <p className="mb-2">{portfolioInfo[portfolio.id]?.summary}</p>
        <ul className="list-disc pl-4 space-y-1">
          {(portfolioInfo[portfolio.id]?.bullets || []).map((b, i) => (
            <li key={i}>{b}</li>
          ))}
        </ul>
      </div>
    </div>
  )}
</div>
  
                  );
                })}
                {/* Custom Portfolio Option */}
                <div className="md:col-span-2 col-span-1">
                  <div className="relative p-4 rounded-lg border-2 border-dashed border-muted-foreground/30 bg-muted/20 md:h-40">
                    <button
                      type="button"
                      onMouseEnter={() => setHoveredInfoId('custom')}
                      onMouseLeave={() => setHoveredInfoId(null)}
                      onClick={(e) => e.stopPropagation()}
                      aria-label="About custom portfolio"
                      className="absolute top-4 left-2 h-6 w-6 rounded-full flex items-center justify-center bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-sm border border-white/60 dark:border-neutral-700 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      <svg viewBox="0 0 20 20" fill="currentColor" className="h-3.5 w-3.5">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM9 8a1 1 0 112 0 1 1 0 01-2 0zm.25 2.75a.75.75 0 011.5 0v3.5a.75.75 0 11-1.5 0v-3.5z" clipRule="evenodd" />
                      </svg>
                    </button>
                    <div className="ml-6 flex items-start space-x-3">
                      {/* <div className="w-4 h-4 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 mt-1"></div> */}
                      <div className="flex-1">
                        <h3 className="font-semibold mb-1">Custom Portfolio</h3>
                        <p className="text-sm text-muted-foreground mb-3">Add your own area of interest </p>
                        <Input
                          placeholder="Enter your custom portfolio (e.g., Blockchain, IoT, Data Science...)"
                          value={formData.customPortfolio}
                          onChange={handleInputChange}
                          name="customPortfolio"
                          className="mb-2"
                        />
                        {formData.customPortfolio && (
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <div className={`w-4 h-4 rounded border ${
                                selectedPortfolios.includes('custom')
                                  ? 'bg-primary border-primary' 
                                  : 'border-muted-foreground/50'
                              } flex items-center justify-center cursor-pointer`}
                              onClick={handleCustomPortfolioToggle}>
                                {selectedPortfolios.includes('custom') && (
                                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                  </svg>
                                )}
                              </div>
                              <span className="text-sm text-muted-foreground">Select as portfolio</span>
                            </div>
                            {selectedPortfolios.includes('custom') && (
                              <Badge variant="secondary">
                                {selectedPortfolios.indexOf('custom') === 0 ? 'P1' : 'P2'}
                              </Badge>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                    {hoveredInfoId === 'custom' && (
                      <div
                        className="absolute z-50 top-12 left-2 w-80 rounded-md border border-border bg-card p-3 shadow-xl"
                        style={{ 
                          opacity: 1,
                          pointerEvents: 'auto'
                        }}
                      >
                        <div className="mb-2 text-sm font-semibold">Custom Portfolio Requirements</div>
                        <div className="text-sm text-muted-foreground">
                          <p className="mb-3 font-medium">The custom portfolio must fulfil the 1st criteria and at least 3 of the remaining criteria:</p>
                          <ul className="list-disc pl-4 space-y-2">
                            <li><strong>Must address</strong> a specific gap or emerging domain relevant to the chapter</li>
                            <li>Scope and responsibilities must be well-defined and documented</li>
                            <li>Lead should mentor members in the chosen domain</li>
                            <li>Must have measurable outcomes (projects, workshops, collaborations)</li>
                            <li>Activities should align with chapter's vision and goals</li>
                            <li>Documentation of learnings and results is required</li>
                          </ul>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Selected: {selectedPortfolios.length}/2 portfolios
                </span>
                {errors.portfolios && (
                  <span className="text-xs text-red-600">{errors.portfolios}</span>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl font-bold">Links & Previous Work</CardTitle>
              <CardDescription>Provide links to your professional profiles and previous work</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="linkedin" className="text-sm font-medium">LinkedIn Profile</Label>
                  <Input
                    id="linkedin"
                    name="linkedin"
                    type="url"
                    value={formData.linkedin}
                    onChange={handleInputChange}
                    placeholder="https://linkedin.com/in/yourprofile"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="github" className="text-sm font-medium">GitHub Profile</Label>
                  <Input
                    id="github"
                    name="github"
                    type="url"
                    value={formData.github}
                    onChange={handleInputChange}
                    placeholder="https://github.com/yourusername"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="previousWork" className="text-sm font-medium">Links to Previous Work</Label>
                <Textarea
                  id="previousWork"
                  name="previousWork"
                  value={formData.previousWork}
                  onChange={handleInputChange}
                  placeholder="Provide links to your projects, portfolios, or relevant work experience..."
                  rows={4}
                  className="focus:border-blue-500 focus:ring-blue-500"
                />
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">{prevWorkWords}/100 words</span>
                  {errors.previousWork && (
                    <span className="text-xs text-red-600">{errors.previousWork}</span>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="text-center">
            <Button 
              type="submit" 
              className="px-8 py-5 text-lg font-semibold" 
              disabled={isUploading || !resumeUrl || isSubmitting || selectedPortfolios.length !== 2}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Application'}
            </Button>
            
            {submitStatus === 'success' && (
              <div className="mt-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
                Application submitted successfully!
              </div>
            )}
            
            {submitStatus === 'error' && (
              <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                Failed to submit application. Please try again or contact support.
              </div>
            )}
          </div>
        </form>
      </div>
      
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