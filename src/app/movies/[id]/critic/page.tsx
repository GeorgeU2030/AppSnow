"use client"
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { zodResolver} from "@hookform/resolvers/zod";
import { useForm} from "react-hook-form";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
    FormLabel
} from "@/components/ui/form"
import {Input} from "@/components/ui/input";

interface Movie {
    _id:string,
    name:string
}

const criticSchema = z.object({
    history: z.number().int().min(0).max(15),
    screenplay: z.number().int().min(0).max(15),
    sound: z.number().int().min(0).max(10),
    photography: z.number().int().min(0).max(10),
    specialeffects: z.number().int().min(0).max(10),
    characters: z.number().int().min(0).max(25),
    editing: z.number().int().min(0).max(10),
    creativity: z.number().int().min(0).max(5),
})

export default function Movies(){

    const form = useForm<z.infer<typeof criticSchema>>({
        resolver: zodResolver(criticSchema),
        defaultValues:{
            history:0,
            screenplay:0,
            sound:0,
            photography:0,
            specialeffects:0,
            characters:0,
            editing:0,
            creativity:0
        }
    })

    const router = useRouter();
    const [movie, setMovie] = useState<Movie>();
    const {id} = useParams();
    const token = Cookies.get('token');

    useEffect(()=>{
        if(token){
            const fetchMovie = async () => {
                if (id) {
                    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/movie/getAMovie/${id}`, {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });
                    if (response.ok) {
                        const movieData = await response.json();
                        setMovie(movieData);
                    }
                }
            };
            fetchMovie();
        }else{
            router.push('/')
        }
    },[])

    return (
        <div className={'min-h-screen w-full bg-black'}>
            <div className={'flex justify-center items-center min-h-screen'}>
                <div className={'flex flex-col w-1/2 justify-center items-center bg-blue-400'}>
                    <h1 className={'text-white text-xl'}>{movie?.name}</h1>

                    <Form {...form}>
                        <form className={'flex bg-yellow-500 w-full'}>
                            <section className={'bg-red-500 w-1/2 flex flex-col items-center mt-3'}>
                            <FormField
                                control={form.control}
                                name="history"
                                render={({ field }) => (
                                    <FormItem className={'w-1/2 text-center'}>
                                        <FormLabel className={'text-white '}>History</FormLabel>
                                        <FormControl>
                                            <Input className="text-center text-blue-800 font-bold text-2xl px-1" type={'number'} min={'0'} max={'15'}
                                                   value={field.value === 0 || field.value ? field.value : ''}
                                                   onChange={(e) => {
                                                       let value = parseInt(e.target.value);
                                                       if (isNaN(value)) {
                                                           value = NaN;
                                                       } else if (value < 0) {
                                                           value = 0;
                                                       } else if (value > 15) {
                                                           value = 15;
                                                       }
                                                       field.onChange(value);
                                                   }}
                                            />
                                        </FormControl>
                                        <FormMessage className="text-white" />
                                    </FormItem>

                                )}
                            />

                            <FormField
                                    control={form.control}
                                    name="sound"
                                    render={({ field }) => (
                                        <FormItem className={'w-1/2 text-center'}>
                                            <FormLabel className={'text-white '}>Sound</FormLabel>
                                            <FormControl>
                                                <Input className="text-center text-blue-800 font-bold text-2xl px-1" type={'number'} min={'0'} max={'15'}
                                                       value={field.value === 0 || field.value ? field.value : ''}
                                                       onChange={(e) => {
                                                           let value = parseInt(e.target.value);
                                                           if (isNaN(value)) {
                                                               value = NaN;
                                                           } else if (value < 0) {
                                                               value = 0;
                                                           } else if (value > 10) {
                                                               value = 10;
                                                           }
                                                           field.onChange(value);
                                                       }}
                                                />
                                            </FormControl>
                                            <FormMessage className="text-white" />
                                        </FormItem>

                                    )}
                            />

                            <FormField
                                    control={form.control}
                                    name="specialeffects"
                                    render={({ field }) => (
                                        <FormItem className={'w-1/2 text-center'}>
                                            <FormLabel className={'text-white '}>Special Effects</FormLabel>
                                            <FormControl>
                                                <Input className="text-center text-blue-800 font-bold text-2xl px-1" type={'number'} min={'0'} max={'15'}
                                                       value={field.value === 0 || field.value ? field.value : ''}
                                                       onChange={(e) => {
                                                           let value = parseInt(e.target.value);
                                                           if (isNaN(value)) {
                                                               value = NaN;
                                                           } else if (value < 0) {
                                                               value = 0;
                                                           } else if (value > 10) {
                                                               value = 10;
                                                           }
                                                           field.onChange(value);
                                                       }}
                                                />
                                            </FormControl>
                                            <FormMessage className="text-white" />
                                        </FormItem>

                                    )}
                            />

                            <FormField
                                    control={form.control}
                                    name="editing"
                                    render={({ field }) => (
                                        <FormItem className={'w-1/2 text-center'}>
                                            <FormLabel className={'text-white '}>Editing</FormLabel>
                                            <FormControl>
                                                <Input className="text-center text-blue-800 font-bold text-2xl px-1" type={'number'} min={'0'} max={'15'}
                                                       value={field.value === 0 || field.value ? field.value : ''}
                                                       onChange={(e) => {
                                                           let value = parseInt(e.target.value);
                                                           if (isNaN(value)) {
                                                               value = NaN;
                                                           } else if (value < 0) {
                                                               value = 0;
                                                           } else if (value > 10) {
                                                               value = 10;
                                                           }
                                                           field.onChange(value);
                                                       }}
                                                />
                                            </FormControl>
                                            <FormMessage className="text-white" />
                                        </FormItem>

                                    )}
                            />

                            </section>
                            <section className={'bg-green-600 w-1/2 flex flex-col items-center mt-3'}>
                                <FormField
                                control={form.control}
                                name="screenplay"
                                render={({ field }) => (
                                    <FormItem className={'w-1/2 text-center'}>
                                        <FormLabel className={'text-white'}>Screenplay</FormLabel>
                                        <FormControl>
                                            <Input className="text-center text-blue-800 font-bold text-2xl px-1" type={'number'} min={'0'} max={'15'}
                                                   value={field.value === 0 || field.value ? field.value : ''}
                                                   onChange={(e) => {
                                                       let value = parseInt(e.target.value);
                                                       if (isNaN(value)) {
                                                           value = NaN;
                                                       } else if (value < 0) {
                                                           value = 0;
                                                       } else if (value > 15) {
                                                           value = 15;
                                                       }
                                                       field.onChange(value);
                                                   }}
                                            />
                                        </FormControl>
                                        <FormMessage className="text-white" />
                                    </FormItem>

                                )}
                                />

                                <FormField
                                    control={form.control}
                                    name="photography"
                                    render={({ field }) => (
                                        <FormItem className={'w-1/2 text-center'}>
                                            <FormLabel className={'text-white'}>Photography</FormLabel>
                                            <FormControl>
                                                <Input className="text-center text-blue-800 font-bold text-2xl px-1" type={'number'} min={'0'} max={'15'}
                                                       value={field.value === 0 || field.value ? field.value : ''}
                                                       onChange={(e) => {
                                                           let value = parseInt(e.target.value);
                                                           if (isNaN(value)) {
                                                               value = NaN;
                                                           } else if (value < 0) {
                                                               value = 0;
                                                           } else if (value > 15) {
                                                               value = 15;
                                                           }
                                                           field.onChange(value);
                                                       }}
                                                />
                                            </FormControl>
                                            <FormMessage className="text-white" />
                                        </FormItem>

                                    )}
                                />
                            </section>
                        </form>
                    </Form>
                </div>
            </div>
        </div>
    )
}