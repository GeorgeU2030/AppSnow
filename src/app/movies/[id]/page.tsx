"use client"
import { useEffect,useState } from "react";
import { useParams} from "next/navigation";
import Cookies from "js-cookie";

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



    return (
        <div className="min-h-screen w-screen bg-black">
            <div className="flex w-full">
                <section className="lg:w-1/2 md:w-1/2 w-full text-white flex flex-col justify-center items-center">
                    <img src={movie?.cover} alt={movie?.name} className="w-1/3 h-1/2"/>
                    <h1 className="text-3xl mt-4">{movie?.name}</h1>
                    <p className="mt-2">{movie?.genre}</p>
                    <p className="mt-1">{movie?.year}</p>
                    <p>{movie?.duration} minutes</p>
                    <p>{movie?.points}</p>
                    <p>{movie?.amount}</p>
                    <p>{movie?.oscars}</p>

                </section>
                <section className="lg:w-1/2 md:w-1/2 w-full text-white flex flex-col">

            </section>
            </div>
        </div>
    )
}