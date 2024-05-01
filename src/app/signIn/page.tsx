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
import { useState } from "react"
import Cookies from 'js-cookie'
import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert";
import {Ban} from "lucide-react";

const SignInSchema = z.object({
    email: z.string().email(
        {
            message: "Invalid email address"
        }
    ),
    password: z.string().min(7,{
        message: "Password must be at least 7 characters long"
    }),
})

export default function SignIn(){

    const [thereUser, setThereUser] = useState(false)
    const [showAlert, setShowAlert] = useState(false)
    const router = useRouter()

    const form = useForm<z.infer<typeof SignInSchema>>({
        resolver: zodResolver(SignInSchema),
        defaultValues: {
          email: "",
          password: "",
        },
    })

    async function onSubmit(values: z.infer<typeof SignInSchema>) {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/user/signIn`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(values)
      });

      if (!response.ok) {
          if(response.status === 404){
                setShowAlert(true)
          }
          if(response.status === 400){
                setThereUser(true)
                setShowAlert(true)
          }
          return;
      }
      const data = await response.json();
      Cookies.set('token', data.message);
      router.push('/');
    }

    return (
        <div className="min-h-screen w-screen bg-black lg:h-auto">
            {showAlert && (
                <div className="flex justify-center">
                    <Alert className="w-2/3 mt-2">
                        <Ban className="h-4 w-4" />
                        {thereUser ? (
                        <AlertTitle>The user or password are incorrect! try again</AlertTitle>
                            ) : (
                        <AlertTitle>The user does not exist</AlertTitle>
                        )
                        }
                    </Alert>
                </div>
            )}
        <div className="flex flex-col h-full w-full justify-center text-white items-center">
        <div className=" mb-12 flex items-center mt-6">
            <img
            src='/snowlogo.png'
            className="w-16 h-16"
            />
            <h2 className="ml-3">Snow</h2>
        </div>
        <div className="bg-[#2953A6] rounded-lg w-4/5 lg:w-1/3 md:w-2/3 border-white border-2">
       <Form {...form} >
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 text-center lg:py-12 lg:px-12 md:py-12 md:px-8 py-4 px-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white">Email</FormLabel>
              <FormControl>
                <Input placeholder="your email" className="text-end text-black" {...field} />
              </FormControl>
              <FormMessage className="text-white" />
            </FormItem>
            
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white">Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="your password" className="text-end text-black" {...field} />
              </FormControl>
              <FormMessage className="text-white"/>
            </FormItem>
            
          )}
        />
        <Button type="submit" className="bg-[#1F82BF] px-6">Login</Button>
      </form>
    </Form>
    </div>
        </div>
        </div>
    )
}