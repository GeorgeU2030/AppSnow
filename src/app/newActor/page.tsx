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
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import { useRouter } from "next/navigation"
import Cookies from 'js-cookie'

const DirectorSchema = z.object({
    name: z.string(),
    picture: z.string(),
    yearOfBirth: z.string().transform(Number),
    country : z.string(),
    oscars: z.string().transform(Number),
    nominations: z.string().transform(Number),
})


export default function NewDirector(){

  const router = useRouter()

  const form = useForm<z.infer<typeof DirectorSchema>>({
    resolver: zodResolver(DirectorSchema),
    defaultValues: {
      name: "",
      picture: "",
      yearOfBirth: 2000,
      country: "",
      oscars: 0,
      nominations: 0
    },
  })
    async function onSubmit (values: z.infer<typeof DirectorSchema>) {

      const token = Cookies.get('token')
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/actor/createActor`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(values)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      router.push('/')
    }

    return (
        <div className="min-h-screen w-full lg:min-h-screen lg:h-auto bg-black">
        <div className="flex flex-col h-full w-full justify-center text-white items-center">
        <div className="mt-8 mb-12 flex items-center">
            <img
            src='/snowlogo.png'
            className="w-16 h-16"
            />
            <h2 className="ml-3">Create Actor</h2>
        </div>
        <div className="bg-[#2953A6] rounded-lg w-4/5 lg:w-1/3 md:w-2/3 border-white border-2 mb-12">
       <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2 text-center lg:py-12 lg:px-12 md:py-12 md:px-8 py-4 px-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white">Name</FormLabel>
              <FormControl>
                <Input placeholder="complete name" className="text-end text-black" {...field} />
              </FormControl>
              <FormMessage className="text-white" />
            </FormItem>
            
          )}
        />
        <FormField
          control={form.control}
          name="picture"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white">Picture</FormLabel>
              <FormControl className="flex">
              <div>
                <Avatar className="lg:block md:block">
                <AvatarImage src={field.value} alt="@shadcn"/>
                <AvatarFallback>Dir</AvatarFallback>
                </Avatar>
                <Input placeholder="the image of the director" className="ml-2 text-end text-black" {...field} />
              </div>
              </FormControl>
              <FormMessage className="text-white"/>
            </FormItem>
            
          )}
        />
        <FormField
          control={form.control}
          name="yearOfBirth"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white">Year of Birth</FormLabel>
              <FormControl>
                <Input type="number" placeholder="the year of birth" className="text-end text-black" 
                {...field} 
                value={field.value ? Number(field.value) : ''}
                />
              </FormControl>
              <FormMessage className="text-white"/>
            </FormItem>
            
          )}
          />

          
          <FormField
          control={form.control}
          name="country"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white">Country</FormLabel>
              <FormControl>
                <Input placeholder="the country of birth" className="text-end text-black" {...field} />
              </FormControl>
              <FormMessage className="text-white"/>
            </FormItem>
            
          )}
          />


        <FormField 
          control={form.control}
          name="oscars"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white">Oscars</FormLabel>
              <FormControl>
                <Input type="number" placeholder="the oscars won" className="text-end text-black" {...field} />
              </FormControl>
              <FormMessage className="text-white"/>
            </FormItem>
            
          )}
          />

        <FormField 
          control={form.control}
          name="nominations"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white">Nominations</FormLabel>
              <FormControl>
                <Input type="number" placeholder="the oscars nominations" className="text-end text-black" {...field} />
              </FormControl>
              <FormMessage className="text-white"/>
            </FormItem>
            
          )}
        />
      
        <Button type="submit" className="bg-[#1F82BF] px-6">Create</Button>
        
      </form>
    </Form>
    </div>
        </div>
        </div>
    )
}

