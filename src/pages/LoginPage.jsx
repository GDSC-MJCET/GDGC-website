import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { WavyBackground } from '../components/ui/wavy-background';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const {authState,setAuthState}=useContext(AuthContext);
  const [checkingAuth, setCheckingAuth]=useState(true)
  const nav = useNavigate()
  useEffect(()=>{
    if(authState.loggedIn){
      localStorage.setItem("AuthState", JSON.stringify(authState));
    }
  },[authState])
  const auth = JSON.parse(localStorage.getItem("AuthState"))
  useEffect(()=>{
    axios.get(import.meta.env.VITE_SERVER+"/api/v1/dashboard/landing-page",{headers:{
    Authorization:`Bearer ${auth?.token}`
   }}).then((data)=>{
     
    if (data.data.success) {
       nav("/team/dashboard")
    }
    else {
        setCheckingAuth(false);
      }
    }).catch((err)=>{
        setCheckingAuth(false)
    })
  },[])
  if(checkingAuth){
    return null;
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    if (!email?.trim()) {
      toast.error('Email is required');
      return;
    }
    if (!password?.trim()) {
  toast.error('God forbid developers dealing with empty passwords');
  return;
}
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        toast.error('Please enter a valid email address');
        return;
      }
     
    
    toast.loading("Signing in...")
     const server = import.meta.env.VITE_SERVER+"/api/v1/auth/signin" || "http://localhost:3009"
    axios.post(server,{

      email,password
    }).then((data)=>{
      if(data.data.token){
        toast.success("Logged In Successfully")
        toast.dismissAll()
        setAuthState({token:data.data.token,loggedIn:true})
        return nav('/team/dashboard');
        

      }
    }).catch((error)=>  toast.error(server+error.message))
  };

 return (
 
    <div className="min-h-screen flex items-center justify-center p-4">
   <Toaster/>
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">
            Login Dashboard
          </CardTitle>
          <CardDescription>
            only authorized personals
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700"
                  disabled={isLoading}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <a
                href="#"
                className="text-blue-300 hover:underline"
              >
                Forgot password?
              </a>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col space-y-4">
            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign in"}
            </Button>

            {/* <div className="text-sm text-center text-slate-400">
              Don&apos;t have an account?{" "}
              <a
                href="#"
                className="text-blue-300 hover:underline font-medium"
              >
                Sign up
              </a>
            </div> */}
          </CardFooter>
        </form>
      </Card>
    </div>
 
);

}