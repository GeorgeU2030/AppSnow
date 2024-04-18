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
import AsyncSelect from 'react-select/async'
import { useRouter } from "next/navigation"
import Cookies from 'js-cookie'
import { useEffect, useState } from "react"

const MovieSchema = z.object({
    name: z.string(),
    cover: z.string(),
    year: z.string().transform(Number),
    genre: z.string(),
    oscars: z.string().transform(Number),
    duration: z.string().transform(Number),
    directors: z.array(z.string()),
    actors: z.array(z.string()),
    points: z.number(),
    amount: z.number()
})

interface Director {
    _id: string
    name: string
}

interface Actor {
    _id: string
    name: string
}


export default function NewMovie(){

    const [directors, setDirectors] = useState<Director[]>([]);
    const [actors, setActors] = useState<Actor[]>([]);
    const [isClient, setIsClient] = useState(false);
    const router = useRouter()
    const token = Cookies.get('token')
    const [imageUrl, setImageUrl] = useState('https://static.vecteezy.com/system/resources/previews/013/743/750/original/blank-book-cover-over-png.png')

    useEffect(() => {
        setIsClient(true);
        searchDirectors('').then((directors) => setDirectors(directors));
        searchActors('').then((actors) => setActors(actors));
    }, [])

    const form = useForm<z.infer<typeof MovieSchema>>({
    resolver: zodResolver(MovieSchema),
    defaultValues: {
      name: "",
      cover: "",
      genre: "",
      directors: [],
      actors: [],
      points: 0,
      amount: 0
  }})

  async function onSubmit (values: z.infer<typeof MovieSchema>) {
      values.points = 0
      values.amount = 0
      
      const token = Cookies.get('token')
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/movie/createMovie`, {
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

    async function searchDirectors(search: string) {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/director/searchDirector?search=${encodeURIComponent(search)}`,{
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (response.status === 400) {
      Cookies.remove('token');
      router.push('/');
      return;
    }

    const newDirectors = await response.json();
    setDirectors(prevDirectors => {
      const directorMap = new Map(prevDirectors.map(director => [director._id, director]));
  
      newDirectors.forEach((director:Director) => {
        if (!directorMap.has(director._id)) {
          directorMap.set(director._id, director);
        }
      });
  
      return Array.from(directorMap.values());
    });
  
    const options = newDirectors.map((director: Director) => ({
      value: director._id,
      label: director.name,
    }));
    return options;
    }


    async function searchActors(search: string) {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/actor/searchActor?search=${encodeURIComponent(search)}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
    
      if (response.status === 400) { // Unauthorized
        Cookies.remove('token');
        router.push('/');
        return [];
      }
    
      const newActors = await response.json();
      
      setActors(prevActors => {
        const actorMap = new Map(prevActors.map(actor => [actor._id, actor]));
    
        newActors.forEach((actor:Actor) => {
          if (!actorMap.has(actor._id)) {
            actorMap.set(actor._id, actor);
          }
        });
    
        return Array.from(actorMap.values());
      });
    
      const options = newActors.map((actor:Actor) => ({
        value: actor._id,
        label: actor.name,
      }));
      return options;
    }
    

    return (
        <div className="min-h-screen w-full lg:min-h-screen lg:h-auto bg-black">
        <div className="flex flex-col h-full w-full justify-center text-white items-center">
        <div className="mt-8 mb-12 flex items-center">
            <img
            src='/snowlogo.png'
            className="w-16 h-16"
            />
            <h2 className="ml-3">Create Movie</h2>
        </div>
        <div className="bg-[#2953A6] rounded-lg w-4/5 lg:w-2/3 md:w-2/3 border-white border-2 mb-12">
       <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2 text-center lg:py-12 lg:px-12 md:py-12 md:px-8 py-4 px-4">
        <div className="lg:flex ">
        <section className="lg:w-1/2 bg-[#1F82BF] px-4 py-4">
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
          name="cover"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white">Cover</FormLabel>
              <FormControl className="flex">
                <div className="flex flex-col justify-center items-center">
                {imageUrl && <img src={imageUrl} alt="https://static.vecteezy.com/system/resources/previews/013/743/750/original/blank-book-cover-over-png.png" className="w-24 h-32" />}
              <Input placeholder="the cover of the movie" className="mt-3 text-end text-black" {...field} 
              onChange={(e) => {
                field.onChange(e); 
                setImageUrl(e.target.value); 
              }}
              />
              </div>
              </FormControl>
              <FormMessage className="text-white"/>
            </FormItem>
            
          )}
        />
        <FormField
          control={form.control}
          name="year"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white">Year </FormLabel>
              <FormControl>
                <Input type="number" placeholder="the year of the movie" className="text-end text-black" 
                {...field}
                />
              </FormControl>
              <FormMessage className="text-white"/>
            </FormItem>
            
          )}
          />

          
        
        </section>
        <section className="lg:w-1/2 bg-[#1F82BF] px-4 py-4">
        <FormField
          control={form.control}
          name="genre"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white">Genre</FormLabel>
              <FormControl>
                <Input placeholder="the main genre" className="text-end text-black" {...field} />
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
              <FormLabel className="text-white">Oscars </FormLabel>
              <FormControl>
                <Input type="number" placeholder="the oscars won" className="text-end text-black" 
                {...field} 
                />
              </FormControl>
              <FormMessage className="text-white"/>
            </FormItem>
            
          )}
          />

        <FormField
          control={form.control}
          name="duration"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white">Duration </FormLabel>
              <FormControl>
                <Input type="number" placeholder="duration in minutes" className="text-end text-black" 
                {...field} 
                />
              </FormControl>
              <FormMessage className="text-white"/>
            </FormItem>
            
          )}
          />
            
      {isClient && (
        <FormField
        control={form.control}
        name="directors"
        render={({ field }) => (
          <FormItem>
          <FormLabel className="text-white">Directors</FormLabel>
          <FormControl>
          <AsyncSelect
          {...field}
          cacheOptions
          defaultOptions
          loadOptions={searchDirectors}
          isMulti
          className="text-black"
          placeholder="Select directors"
          getOptionLabel={(option) => option.label}
          getOptionValue={(option) => option.value}
          onChange={(selectedOptions) => {
            const directorIds = selectedOptions ? selectedOptions.map(option => option.value) : [];
            form.setValue('directors', directorIds);
          }}
          value={field.value ? field.value.map(value => ({ value, label: directors.find(d => d._id === value)?.name ?? 'Unknown' })) : []}
        />
        </FormControl>
        <FormMessage className="text-white"/>
        </FormItem>
        )}
      />
      )}

      {isClient && (
        <FormField
        control={form.control}
        name="actors"
        render={({ field }) => (
          <FormItem>
          <FormLabel className="text-white">Actors</FormLabel>
          <FormControl>
          <AsyncSelect
          {...field}
          cacheOptions
          defaultOptions
          loadOptions={searchActors}
          isMulti
          className="text-black"
          placeholder="Select actors"
          getOptionLabel={(option) => option.label}
          getOptionValue={(option) => option.value}
          onChange={(selectedOptions) => {
            const actorIds = selectedOptions ? selectedOptions.map(option => option.value) : [];
            form.setValue('actors', actorIds);
          }}
          value={field.value.map(value => ({ value, label: actors.find(d => d._id === value)?.name ?? 'Unknown' }))}
        />
        </FormControl>
        <FormMessage className="text-white"/>
        </FormItem>
        )}
      />
      )}

    </section>
    </div>
        <Button type="submit" className="bg-[#1F82BF] px-6">Create</Button>
        
      </form>
    </Form>
    </div>
        </div>
        </div>
    )
}

  