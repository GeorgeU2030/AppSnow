"use client"
import { useEffect,useState } from "react";
import { useParams} from "next/navigation";
import Cookies from "js-cookie";
import {Button} from "@/components/ui/button";

export default function MovieId(){

    interface Movie {
        _id:string,
        name:string,
        cover:string,
        year:number,
        points:number,
        amount:number,
        genre:string,
        oscars:number,
        duration:number
    }

    const token = Cookies.get('token');
    const {id} = useParams()
    const [votation, setVotation] = useState<string>('')
    const [movie, setMovie] = useState<Movie | null>(null)

    useEffect (() => {
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
    },[])


    function votationCritic (){
        setVotation('critic')
    }

    function votationOverall (){
        setVotation('overall')
    }

    return (
        <div className="min-h-screen w-screen bg-black">
            <div className="md:flex md:w-full md:items-center md:justify-center min-h-screen ">
                <section className="lg:w-1/2 md:w-1/2 w-full text-white flex flex-col justify-center items-center">
                    <img src={movie?.cover} alt={movie?.name} className="w-1/3 h-1/2 mt-8 md:mt-1"/>
                    <h1 className="text-3xl mt-4">{movie?.name}</h1>
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
                <section className="lg:w-1/2 md:w-1/2 w-full text-white flex flex-col items-center">
                        <div className={'flex flex-col justify-center items-center w-full mb-6'}>
                            <img src={'/snowlogo.png'} className={'w-12 h-12'}/>
                            <h1 className={'ml-2 text-xl font-semibold'}>Snow</h1>
                            <h2 className={'mt-2'}>Vote the Movie </h2>

                            <p className={'w-1/2 text-sm mt-1'}>
                                In Snow, dive into the world of cinema and have your say in shaping its destiny. Whether you are casting your overall vote or critic vote. Join us and let your cinematic passion guide the way!
                            </p>

                            <div className={'mt-3'}>
                                <Button className={'mr-2 bg-[#2953A6] hover:bg-slate-100 hover:text-[#2953a6] font-semibold'}
                                onClick={votationOverall}
                                >Overall Vote</Button>
                                <Button className={'ml-2 px-6 bg-[#2953A6] hover:bg-slate-100 hover:text-[#2953a6] font-semibold'}
                                onClick={votationCritic}
                                >Critic Vote</Button>
                            </div>



                        </div>
                </section>
            </div>
        </div>
    )
}