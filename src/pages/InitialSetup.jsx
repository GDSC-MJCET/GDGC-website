
import { useEffect, useState } from 'react';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardDescription, CardFooter, CardHeader } from '@/components/ui/card';
import { useNavigate, useParams } from 'react-router-dom';
import {Toaster,toast} from "react-hot-toast"
import axios from 'axios';


export default function InitialSetup() {
  const [email, setEmail] = useState('');
  const [name,setName]= useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { id} = useParams();
  const nav = useNavigate()
  const [CheckingAuth, setCheckingAuth]=useState(true)

  // useEffect(()=>{
  //   let identifier = parseInt(id)/parseInt(import.meta.env.VITE_DIVISOR)
  //   const server = import.meta.env.VITE_SERVER || "http://localhost:3009"
  //   axios.post(server+"/api/v1/auth/confirm",{
  //     identifier
  //   }).then((data)=>{
  //     if (data.data.success) {
  //        nav("/login")
  //     }
  //   }).catch((err)=>console.error(err))
  // },[])
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
    if(parseInt(id)%parseInt(import.meta.env.VITE_DIVISOR)!=0){
    
    toast.error("Unauthorized Page")
     nav("/") 
    }
    else{
      setCheckingAuth(false)
    }
  },[])
  if(CheckingAuth){
    return <div className='bg-black'></div>
  }

  const handleSubmit = () => {
    setError('');
    setIsLoading(true);
      if (!name?.trim()) {
    toast.error('Name is required');
    return;
  }
  if (!email?.trim()) {
    toast.error('Email is required');
    return;
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    toast.error('Please enter a valid email address');
    return;
  }
    const server = import.meta.env.VITE_SERVER || "http://localhost:3009"
    axios.post(server+"/api/v1/auth/signup",{
      name,email,id
      }).then((data)=>{
        console.log(data)
        
        if (data.data.success) {
          
          toast.success("Password Sent to your Email")
          nav("/login")
        }
    }).finally(()=>{
      

      setIsLoading(false)
    }) //sigup is the route which sends user an email with the password
  };

  return (
 <div
  id="ayan"
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
  >
    {/* Inner card */}
    <Card className="bg-black border-none rounded-2xl">
      <CardHeader className="space-y-4 text-center">
        <CardDescription className="text-gray-400 text-base">
          <span className="font-medium text-white">
            Hello dear team member 👋
          </span>
          <br />
          Create your account on the{" "}
          <span className="font-semibold text-blue-400">GDGC</span>{" "}
          platform
        </CardDescription>
      </CardHeader>

      <div className="px-6 pb-2 space-y-4">
        <div>
          <Label
            htmlFor="name"
            className="text-sm font-medium text-gray-300"
          >
            Name
          </Label>
          <Input
            id="name"
            type="text"
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={isLoading}
            className="
              mt-1
              bg-neutral-900
              text-white
              border-neutral-800
              focus-visible:ring-blue-500
            "
          />
        </div>

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
  onClick={handleSubmit}
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
  {/* Animated stroke container */}
  <span
    className="
      pointer-events-none
      absolute
      inset-0
      rounded-xl
      animate-[rotate-border_2.5s_linear_infinite]
    "
  >
    {/* The dot */}
    <span
      className="
        absolute
        top-0 left-1/2
        -translate-x-1/2
        w-2 h-2
        rounded-full
        bg-blue-400
      "
    />

    {/* Stroke trail */}
    <span
      className="
        absolute
        top-0 left-1/2
        -translate-x-1/2
        w-px h-6
        bg-gradient-to-b
        from-blue-400
        to-transparent
      "
    />
  </span>

  {/* Button label */}
  <span className="relative z-10">
    {isLoading ? "Submitting…" : "Submit"}
  </span>
</button>


        <p className="text-xs text-gray-500 text-center">
          By continuing, you agree to GDGC guidelines
        </p>
      </CardFooter>
    </Card>
  </div>
</div>


  );
}