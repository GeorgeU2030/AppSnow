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
import {Button} from "@/components/ui/button";
import {jwtDecode, JwtPayload} from "jwt-decode";

interface Movie {
    _id:string,
    name:string
}

interface MyToken extends JwtPayload {
    _id: string;
    role: string[];
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

    async function calculatePoints(data:z.infer<typeof criticSchema>){
        let total = 0;
        total += data.history;
        total += data.screenplay;
        total += data.sound;
        total += data.photography;
        total += data.specialeffects;
        total += data.characters;
        total += data.editing;
        total += data.creativity;
        return total;
    }

    async function onSubmit (data:z.infer<typeof criticSchema>){
        const pointsmovie = await calculatePoints(data);
        if(!token){
            return;
        }
        const decoded = jwtDecode<MyToken>(token);
        const userID = decoded._id;

        const dataToSed = {
            userId: userID,
            movieId: id,
            points: pointsmovie
        }

        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/movie/vote/${id}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(dataToSed)
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        router.push('/movies');
    }

    return (
        <div className={'min-h-screen w-full bg-black'}>
            <div className={'flex justify-center items-center min-h-screen'}>
                <div className={'flex flex-col lg:w-1/2 md:w-2/3 justify-center items-center bg-sky-900 rounded-lg'}>
                    <h1 className={'text-white text-xl font-semibold mt-3'}>{movie?.name}</h1>

                    <Form {...form}>
                        <form className={'flex flex-col bg-sky-900 w-full items-center rounded-lg'} onSubmit={form.handleSubmit(onSubmit)}>
                            <div className={'flex flex-col md:flex-row bg-sky-900 w-full rounded-lg '}>
                            <section className={'bg-sky-900 w-full md:w-1/2 flex flex-col items-center mt-3 mb-3 rounded-lg'}>
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
                                                <Input className="text-center text-blue-800 font-bold text-2xl px-1" type={'number'} min={'0'} max={'10'}
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
                                                <Input className="text-center text-blue-800 font-bold text-2xl px-1" type={'number'} min={'0'} max={'10'}
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
                                                <Input className="text-center text-blue-800 font-bold text-2xl px-1" type={'number'} min={'0'} max={'10'}
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
                            <section className={'bg-sky-900 w-full md:w-1/2 flex flex-col items-center mt-3 mb-3'}>
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
                                                <Input className="text-center text-blue-800 font-bold text-2xl px-1" type={'number'} min={'0'} max={'10'}
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
                                    name="characters"
                                    render={({ field }) => (
                                        <FormItem className={'w-1/2 text-center'}>
                                            <FormLabel className={'text-white'}>Characters</FormLabel>
                                            <FormControl>
                                                <Input className="text-center text-blue-800 font-bold text-2xl px-1" type={'number'} min={'0'} max={'25'}
                                                       value={field.value === 0 || field.value ? field.value : ''}
                                                       onChange={(e) => {
                                                           let value = parseInt(e.target.value);
                                                           if (isNaN(value)) {
                                                               value = NaN;
                                                           } else if (value < 0) {
                                                               value = 0;
                                                           } else if (value > 25) {
                                                               value = 25;
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
                                    name="creativity"
                                    render={({ field }) => (
                                        <FormItem className={'w-1/2 text-center'}>
                                            <FormLabel className={'text-white'}>Creativity</FormLabel>
                                            <FormControl>
                                                <Input className="text-center text-blue-800 font-bold text-2xl px-1" type={'number'} min={'0'} max={'5'}
                                                       value={field.value === 0 || field.value ? field.value : ''}
                                                       onChange={(e) => {
                                                           let value = parseInt(e.target.value);
                                                           if (isNaN(value)) {
                                                               value = NaN;
                                                           } else if (value < 0) {
                                                               value = 0;
                                                           } else if (value > 5) {
                                                               value = 5;
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
                            </div>
                            <Button type="submit" className="bg-blue-950 mt-5 w-1/5 mb-2 hover:bg-sky-500 font-semibold">VOTE</Button>
                        </form>
                    </Form>
                </div>
            </div>
        </div>
    )
}