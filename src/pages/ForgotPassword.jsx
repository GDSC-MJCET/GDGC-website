
import { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardDescription, CardTitle,CardFooter, CardHeader } from '@/components/ui/card';
import { useNavigate, useParams } from 'react-router-dom';
import {Toaster,toast} from "react-hot-toast"
import axios from 'axios';


export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [name,setName]= useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { id} = useParams();
  const nav = useNavigate()
  const [checkingAuth, setCheckingAuth]=useState(true)
  const auth = JSON.parse(localStorage.getItem("AuthState"))
  useEffect(()=>{
    axios.get(import.meta.env.VITE_SERVER+"/api/v1/auth/simple-verify",{headers:{
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
    return <div className='bg-black'></div>;
  }
  const handleSubmit = (e) => {
    e.preventDefault()
    setError('');
    setIsLoading(true);
  if (!email?.trim()) {
    toast.error('Email is required');
    setIsLoading(false);
    return;
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    toast.error('Please enter a valid email address');
    setIsLoading(false);
    return;
  }
    const server = import.meta.env.VITE_SERVER || "http://localhost:3009"
    axios.post(server+"/api/v1/auth/forgot-password",{
      email
      }).then((data)=>{
        console.log(data)
        if (data.data.success) {
          toast.success("Password Sent to your Email")
          nav("/login")
        }
    }).catch((err) => {
        setIsLoading(false);
        if (err.response?.status === 401) {
          if(err.response?.data.message=="email not found") toast.error("Email not found")
             }
        toast.error("There was an error while saving your changes " + er);
        
        return
      }).finally(()=>{

      setIsLoading(false)
    }) //sigup is the route which sends user an email with the password
  };

  return (
 <div
  className="min-h-screen flex items-center justify-center bg-black p-4"
>
  <Toaster />

  {/* Gradient shell */}
  
  <div
    className="
      w-full max-w-md rounded-2xl p-[2px]
      bg-gradient-to-r
      from-blue-500 via-green-400 via-red-500 via-orange-400 to-yellow-400
      animate-gradient
    "
  ><form onSubmit={handleSubmit}>
    {/* Inner card */}
    <Card className="bg-black border-none rounded-2xl">
      <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">
            Forgot Password?
          </CardTitle>
          <CardDescription>
            Don't worry, we got you covered!
          </CardDescription>
        </CardHeader>

      <div className="px-6 pb-2 space-y-4">

        <div>
          <Label
            htmlFor="email"
            className="text-sm font-medium text-gray-300"
          >
            Email
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="name@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading}
            className="
              mt-1
              bg-neutral-900
              text-white
              border-neutral-800
              focus-visible:ring-green-500
            "
          />
        </div>
      </div>

      <CardFooter className="flex flex-col space-y-4 px-6 pb-6">
        <button
  disabled={isLoading}
    type="submit"
  className="
    relative
    w-full
    h-12
    rounded-xl
    bg-black
    text-white
    font-semibold
    overflow-hidden
    border border-neutral-800
  "
>
  {/* Button label */}
  <span className="relative z-10">
    {isLoading ? "Submitting…" : "Submit"}
  </span>
</button>


        <p className="text-xs text-gray-500 text-center">
          Please check your mail after submiting
        </p>
      </CardFooter>
    </Card>
    </form>
  </div>
</div>


  );
}