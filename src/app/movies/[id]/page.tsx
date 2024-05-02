"use client"
import { useEffect,useState } from "react";
import { useParams} from "next/navigation";
import Cookies from "js-cookie";
import {Button} from "@/components/ui/button";
import { z } from "zod";
import { zodResolver} from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form"
import {Input} from "@/components/ui/input";
import { jwtDecode, JwtPayload } from "jwt-decode";
import { useRouter } from "next/navigation";

const overallPointsSchema = z.object({
    points: z.number().int().min(0).max(100),
});

interface Worker {
    name: string;
    picture:string;
}

interface MyToken extends JwtPayload {
    _id: string;
    role: string[];
}

export default function MovieId(){

    const form = useForm<z.infer<typeof overallPointsSchema>>({
        resolver: zodResolver(overallPointsSchema),
        defaultValues: {
            points: 100
        },
    })

    interface Movie {
        _id:string,
        name:string,
        cover:string,
        year:number,
        points:number,
        amount:number,
        genre:string,
        oscars:number,
        duration:number,
        directors:Worker[],
        actors:Worker[],
    }

    const router = useRouter()
    const token = Cookies.get('token');
    const {id} = useParams()
    const [votation, setVotation] = useState<string>('')
    const [movie, setMovie] = useState<Movie | null>(null)

    useEffect (() => {
        if(token) {
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

    function votationCritic (){
        router.push(`/movies/${id}/critic`)
    }

    function votationOverall (){
        setVotation('overall')
    }

    async function onSubmit(values: z.infer<typeof overallPointsSchema>) {

        if(!token){
                return;
        }
        const decoded = jwtDecode<MyToken>(token);
        const userID = decoded._id;

        const dataToSed = {
            userId: userID,
            movieId: id,
            points: values.points
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
        const data = await response.json();
        setMovie(data);
    }

    return (
        <div className="min-h-screen w-screen bg-black">
            <div className="md:flex md:w-full md:items-center md:justify-center min-h-screen ">
                <section className="lg:w-1/2 md:w-1/2 w-full text-white flex flex-col justify-center items-center mx-2">
                    <img src={movie?.cover} alt={movie?.name} className="w-1/3 h-1/2 mt-8 md:mt-1"/>
                    <h1 className="text-3xl mt-4 text-center">{movie?.name}</h1>
                    <div className={'flex items-center justify-center mt-2'}>
                    <p>{movie?.genre}</p>
                    <p className={'ml-1'}> - {movie?.year}</p>
                    </div>
                    <p className={'mt-1'}>{movie?.duration} minutes</p>
                    <div className={'flex items-center justify-center mt-2'}>
                    {movie && movie.amount == 0 &&
                        <>
                        <img
                        src="/snowfault.png"
                        className={"w-16 h-16"}
                    />
                        <p className={'font-semibold ml-2'}>----</p>
                        </>
                    }

                    {movie && movie.amount > 0 && <>
                        <img
                        src={
                            movie.points < 30 ? "/snow30.png" :
                                (movie.points >= 30 && movie.points < 50) ? "/snow50.png" :
                                    (movie.points >= 50 && movie.points < 70) ? "/snow70.png" :
                                        (movie.points >= 70 && movie.points < 90) ? "/snow90.png" :
                                            (movie.points >= 90 && movie.points <= 100) ? "/snow100.png" :
                                                "/default.png"
                        }
                        className="w-16 h-16"
                        alt="image"
                        />
                        <p>{movie.points}</p>
                        </>
                    }
                    </div>
                    <p className="text-sm">{movie?.amount} votes</p>
                    {movie?.oscars === 1 &&
                        <div className={'flex justify-center items-center'}>
                        <span className="text-center text-yellow-600 font-semibold"> {movie.oscars} Oscar Award </span>
                        <img src={'/oscar.png'} className={'w-12 h-12'}/>
                        </div>
                        }
                    {movie && movie?.oscars > 1 &&
                        <div className={'flex justify-center items-center'}>
                        <span
                        className="text-center text-yellow-600 font-semibold">  {movie?.oscars} Oscar Awards </span>
                        <img src={'/oscar.png'} className={'w-12 h-12'}/>
                        </div>
                        }
                </section>
                <section className="lg:w-1/2 md:w-1/2 w-full text-white flex flex-col items-center px-2">

                    <div className={'w-full mb-2 mt-8 md:mt-0'}>
                        <h1 className={'text-sm text-center'}>Directors</h1>
                        <div className={'flex justify-center items-center'}>
                            {movie && movie.directors.map((director) => (
                                <div key={director.name} className={'flex flex-col items-center'}>
                                    <img src={director.picture} className={'w-12 h-12 rounded-full mr-1'}/>
                                </div>
                            ))}
                        </div>
                        <div className={'text-center text-sm'}>
                            {movie &&
                                <p>{movie.directors.map(director => director.name).join(', ')}</p>
                            }
                        </div>
                        <h1 className={'text-sm text-center mt-3'}>Actors</h1>
                        <div className={'flex justify-center items-center mt-1'}>
                            {movie && movie.actors.map((actor) => (
                                <div key={actor.name} className={'flex flex-col items-center'}>
                                    <img src={actor.picture} className={'w-12 h-12 rounded-full mr-1'}/>
                                </div>
                            ))}
                        </div>
                        <div className={'text-center text-sm'}>
                            {movie &&
                                <p>{movie.actors.map(actor => actor.name).join(', ')}</p>
                            }
                        </div>
                    </div>
                    <div className={'flex flex-col justify-center items-center w-full mb-6'}>

                        <h2 className={'mt-2'}>Vote the Movie </h2>

                        <div className={'mt-3'}>
                        <Button
                                className={'mr-2 bg-[#2953A6] hover:bg-slate-100 hover:text-[#2953a6] font-semibold'}
                                onClick={votationOverall}
                                >Overall Vote</Button>
                                <Button className={'ml-2 px-6 bg-[#2953A6] hover:bg-slate-100 hover:text-[#2953a6] font-semibold'}
                                onClick={votationCritic}
                                >Critic Vote</Button>
                            </div>

                            {votation === 'overall' &&
                                <div className={'mt-6 flex flex-col justify-center items-center'}>
                                    <p className={'text-sm'}>   Vote the movie from 0 to 100 </p>
                                    <Form {...form}>
                                        <form className={'mt-4 flex flex-col justify-center items-center'} onSubmit={form.handleSubmit(onSubmit)}>
                                            <FormField
                                                control={form.control}
                                                name="points"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormControl>
                                                            <Input className="text-center text-blue-800 font-bold text-2xl px-1" type={'number'} min={'0'} max={'100'}
                                                                   value={field.value === 0 || field.value ? field.value : ''}
                                                                   onChange={(e) => {
                                                                       let value = parseInt(e.target.value);
                                                                       if (isNaN(value)) {
                                                                           value = NaN;
                                                                       } else if (value < 0) {
                                                                           value = 0;
                                                                       } else if (value > 100) {
                                                                           value = 100;
                                                                       }
                                                                       field.onChange(value);
                                                                   }}
                                                            />
                                                        </FormControl>
                                                        <FormMessage className="text-white" />
                                                    </FormItem>

                                                )}
                                            />
                                            <Button type="submit" className="bg-[#1F82BF] px-6 mt-5 hover:bg-[#2953A6] font-semibold">VOTE</Button>
                                        </form>
                                    </Form>
                                </div>
                            }

                    </div>
                </section>
            </div>
        </div>
    )
}