import { useState, useCallback } from 'react';
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Checkbox } from "../components/ui/checkbox";
import gdglogo from "../assets/gdg-logo.png";

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
  }
];

export const ApplicationFormPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    rollNo: '',
    phoneNo: '',
    branch: '',
    year: '',
    resume: '',
    linkedin: '',
    previousWork: '',
    github: '',
    portfolio1: '',
    portfolio2: ''
  });

  const [selectedPortfolios, setSelectedPortfolios] = useState([]);

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  }, []);

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

  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    
    const applicationData = {
      personalInfo: {
        name: formData.name,
        rollNo: formData.rollNo,
        phoneNo: formData.phoneNo,
        branch: formData.branch,
        year: formData.year,
        resume: formData.resume
      },
      professionalLinks: {
        linkedin: formData.linkedin,
        github: formData.github,
        previousWork: formData.previousWork
      },
      portfolioPreferences: {
        selectedPortfolios: selectedPortfolios,
        portfolio1: selectedPortfolios[0] || null,
        portfolio2: selectedPortfolios[1] || null
      },
      submissionInfo: {
        submittedAt: new Date().toISOString(),
        applicationId: `GDG-${Date.now()}`,
        status: 'pending'
      }
    };

    const jsonData = JSON.stringify(applicationData, null, 2);
    
    console.log('Application Data (JSON):', jsonData);
    
    navigator.clipboard.writeText(jsonData).then(() => {
      alert('Application data copied to clipboard as JSON!');
    }).catch(() => {
      alert('Application submitted! JSON data:\n\n' + jsonData);
    });
    
    setFormData({
      name: '',
      rollNo: '',
      phoneNo: '',
      branch: '',
      year: '',
      resume: '',
      linkedin: '',
      previousWork: '',
      github: '',
      portfolio1: '',
      portfolio2: ''
    });
    setSelectedPortfolios([]);
  }, [formData, selectedPortfolios]);

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
              All fields marked with * are required. Applications will be reviewed by the current executive committee.
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
                    placeholder="Enter your roll number"
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
                  <Label htmlFor="resume" className="text-sm font-medium">Resume Link *</Label>
                  <Input
                    id="resume"
                    name="resume"
                    type="url"
                    value={formData.resume}
                    onChange={handleInputChange}
                    placeholder="Link to your resume"
                    required
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl font-bold">Portfolio Selection</CardTitle>
              <CardDescription>
                Select up to 2 portfolios that align with your interests and skills. These will be considered for role assignment.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {portfolios.map((portfolio) => {
                  const isSelected = selectedPortfolios.includes(portfolio.id);
                  const selectionIndex = selectedPortfolios.indexOf(portfolio.id);
                  
                  return (
                    <div
                      key={portfolio.id}
                      className={`relative p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 hover:scale-105 select-none ${
                        isSelected
                          ? 'border-primary bg-primary/5 shadow-md'
                          : 'border-border hover:border-muted-foreground/50'
                      }`}
                      onClick={() => handlePortfolioToggle(portfolio.id)}
                    >
                      <div className="flex items-start space-x-3">
                        <div className={`w-4 h-4 rounded-full ${portfolio.color} mt-1`}></div>
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
                  );
                })}
              </div>
              <div className="mt-4 text-sm text-muted-foreground">
                Selected: {selectedPortfolios.length}/2 portfolios
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
              </div>
            </CardContent>
          </Card>

          <div className="text-center">
            <Button type="submit" className="px-8 py-5 text-lg font-semibold">
              Submit Application
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};