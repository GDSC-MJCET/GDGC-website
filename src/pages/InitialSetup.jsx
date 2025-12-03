
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';
import { useParams } from 'react-router-dom';
import axios from 'axios';


export default function InitialSetup() {
  const [email, setEmail] = useState('');
  const [name,setName]= useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { id } = useParams();
    console.log("This is the Id" , id)


  const handleSubmit = () => {
    setError('');
    setIsLoading(true);
    const server = import.meta.env.VITE_SERVER_PATH | "http://localhost:5174"
     axios.post(server+"/signup",{
      name,email,id
    }).then((data)=>{
        if (data.message=="success") {
          let semiRoot = document.getElementById('ayan')
          semiRoot.style.display = "none"
        }
    }).finally(()=>{

      setIsLoading(false)
    }) //sigup is the route which sends user an email with the password
  };

  return (
    <div  id='ayan' className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardDescription>
            Hello my Dear team member 
            enter your email to create an account on the GDGC platform 
          </CardDescription>
          <Label className="my-3" htmlFor="email">Email</Label>
            <Input
            id="email"
            type="email"
            placeholder="name@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading}
            />
        </CardHeader>
       
            
        <CardFooter className="flex flex-col space-y-4">
          <Button
            type="button"
            className="w-full"
            disabled={isLoading}
            onClick={handleSubmit}
          >
            {isLoading ? 'Submitting' : 'Submit'}
          </Button>

          
        </CardFooter>
      </Card>
    </div>
  );
}