"use client"

import { Home, Search, Snowflake } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Input } from "@/components/ui/input"
import { Button} from "@/components/ui/button";
import { useEffect, useState} from "react";
import Cookies from "js-cookie";

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

export default function Movies(){

    const [movies, setMovies] = useState<Movie[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>("");
    const token = Cookies.get('token');
    const router = useRouter();
    const goHome = () => {
        router.push('/');
    }

   useEffect(() => {
    const token = Cookies.get('token');
    if(token) {
        fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/movie/getMovies`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }).then(response => {
            if (response.status === 400) {
                Cookies.remove('token');
                window.location.href = '/';
                return;
            }
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        }).then((data:any) => {
                setMovies(data);
        }).catch(error => console.error('Error:', error));
    }else {
        router.push('/');
    }
}, [])

    function gotoDetails(id:string){
        router.push(`/movies/${id}`);
    }

    async function getMovies(name:string) {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/movie/getMovie?name=${encodeURIComponent(name)}`,{
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        if (response.status === 400) { // Unauthorized
            Cookies.remove('token');
            router.push('/');
            return;
        }
        if(response.ok) {
            const data = await response.json();
            setMovies(data);
        }
    }

    const handleSearchClick = () => {
        getMovies(searchTerm);
    }

    return (
        <div className="w-screen min-h-screen bg-black">
            <nav className="px-4 py-4 flex justify-between items-center bg-[#2B388F]">
                <ul>
                    <li className="flex items-center">
                        <img src="/snowlogo.png" alt="logo" className="w-12 h-12"/>
                        <h3 className="text-white lg:ml-4 md:ml-4 ml-1">Snow</h3>
                    </li>
                </ul>
                <ul className="flex">
                    <li className="flex cursor-pointer" onClick={goHome}>
                        <Home className="text-white"></Home>
                        <h3 className="text-white ml-2">Home</h3>
                    </li>
                </ul>
            </nav>

            <div>
                <div className="flex justify-end mt-4">
                    <Input placeholder="Search Movies" className="w-1/5 mr-1 font-semibold"
                    value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <Button className="mr-3 bg-[#1F82BF] hover:bg-blue-600 px-2"
                    onClick={handleSearchClick}
                    >
                        <Search/>
                    </Button>
                </div>
            </div>

            <div className="flex justify-center mt-5 ">
                <div className="w-4/5 mb-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 md:grid-cols-2 gap-4 ">
                        {movies.map((movie) => (
                            <div key={movie._id} className="flex bg-[#1F82BF] p-2 rounded-lg items-center"
                            onClick={() => gotoDetails(movie._id)}
                            >
                                <img src={movie.cover} alt={movie.name} className="w-32 h-44"/>
                                <div className="flex flex-col justify-center bg-slate-100 w-full rounded-r-lg">
                                    <h3 className="text-center font-semibold">{movie.name}</h3>
                                    <p className="text-center text-sm font-semibold">{movie.genre}</p>
                                    <p className="text-center text-blue-900 font-semibold">{movie.year}
                                    {movie.oscars === 1 && <span className="text-center text-yellow-700 font-semibold"> - {movie.oscars} Oscar Award </span>}
                                    {movie.oscars > 1 && <span className="text-center text-yellow-700 font-semibold"> - {movie.oscars} Oscar Awards </span>}
                                    </p>
                                    <p className="text-center text-xs font-semibold">{movie.duration} minutes</p>
                                    <div className="flex justify-center items-center mt-2">

                                        {movie.amount === 0 ? (
                                            <>
                                            <img src="/snowfault.png" className="w-14 h-14" alt="image" />
                                            <p className="text-center ml-2">----</p>
                                            </>
                                        ) : (
                                            <>
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
                                    )}
                                    {movie.oscars > 0 && <img src="/oscar.png" className="w-8 h-8"/>}
                                </div>
                                <p className="text-center text-xs font-semibold mt-1 mb-1">{movie.amount} votes</p>

                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}