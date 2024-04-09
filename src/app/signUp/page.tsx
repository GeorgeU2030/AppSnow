"use client"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation"
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
  } from "@/components/ui/avatar"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { User } from "lucide-react"
import { useState } from "react"

const SignUpSchema = z.object({
    name: z.string().min(3, {
        message: "Name must be at least 3 characters long"
    }),
    email: z.string().email(
        {
            message: "Invalid email address"
        }
    ),
    password: z.string().min(7,{
        message: "Password must be at least 7 characters long"
    }),
    imageProfile : z.string().url({
        message: "Invalid URL"
    })
})


export default function SignUp(){

    const [showAlert, setShowAlert] = useState(false)
    const router = useRouter()

    const form = useForm<z.infer<typeof SignUpSchema>>({
        resolver: zodResolver(SignUpSchema),
        defaultValues: {
          name: "",
          email: "",
          password: "",
          imageProfile: ""
        },
    })

    const onSubmit = async (values: z.infer<typeof SignUpSchema>) => {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/user/signUp`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(values)
          });
    
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const data = await response.json();
          setShowAlert(true)
    }

    const goLogin = () => {
        router.push('/signIn')
    }

    return (
        <div className="min-h-screen lg:min-h-screen lg:h-auto w-full bg-black">
            
        {showAlert && (
            <div className="flex justify-center">
            <Alert className="w-2/3 mt-2">
            <User className="h-4 w-4" />
            <AlertTitle>User Created Succesfully!</AlertTitle>
            <AlertDescription>
              <a onClick={goLogin} className="cursor-pointer text-[#2953a6]">Go to Login</a>
            </AlertDescription>
          </Alert>
            </div>
        )}
        <div className="flex flex-col h-full w-full text-white items-center justify-center lg:justify-start">
        <div className="mt-8 mb-12 flex items-center">
            <img
            src='/snowlogo.png'
            className="w-16 h-16"
            />
            <h2 className="ml-3">Snow</h2>
        </div>
        <div className="bg-[#2953A6] rounded-lg w-4/5 lg:w-1/3 md:w-2/3 border-white border-2 mb-12">
       <Form {...form} >
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3 text-center lg:py-12 lg:px-12 md:py-12 md:px-8 py-4 px-4">
      <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="your complete name" className="text-end text-black" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
            
          )}
        />
        
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="your email" className="text-end text-black" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
            
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="your password" className="text-end text-black" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
            
          )}
        />
        <FormField
          control={form.control}
          name="imageProfile"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Image Profile</FormLabel>
              <FormControl className="flex">
                <div>
                <Avatar className="lg:block md:block">
                <AvatarImage src={field.value} alt="@shadcn"/>
                <AvatarFallback>NaN</AvatarFallback>
                </Avatar>
                <Input placeholder="your avatar" className="text-end text-black ml-2" {...field} />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
            
          )}
        />
        <Button type="submit" className="bg-[#1F82BF] px-6">Sign Up</Button>
      </form>
    </Form>
    </div>
        </div>
        </div>
    )
}