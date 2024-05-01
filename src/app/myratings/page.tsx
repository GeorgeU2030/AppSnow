"use client"

import {Home, Pencil, Upload, RotateCcw} from "lucide-react";
import {useRouter} from "next/navigation";
import {useState, useEffect} from "react";
import Cookies from "js-cookie";
import {jwtDecode, JwtPayload} from "jwt-decode";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";

interface MyToken extends JwtPayload {
    _id:string,
    role: string[]
}

interface Movie {
    _id:string,
    name:string,
    cover:string,
    year:number
}

interface Rating {
    _id:string,
    points:number,
    movieId:string,
    userId:string,
    movie: Movie
}

export default function MyRatings(){

    const [inputValue, setInputValue] = useState<number>(0);
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const router = useRouter();
    const [ratings, setRatings] = useState<Rating[]>([]);
    const goHome = () => {
        router.push('/');
    }

    useEffect(()=>{
        const token = Cookies.get('token');
        if(token) {
            const decoded = jwtDecode<MyToken>(token);
            const userID = decoded._id;
            fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/rating/getMyRatings/${userID}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }).then(response => {
                if (response.status === 400) {
                    Cookies.remove('token');
                    router.push('/');
                    return;
                }
                return response.json();
            }).then((data:any) => {
                setRatings(data);
            }).catch(error => console.error('Error:', error));
        }else {
            router.push('/');
        }

    })

    const handleButtonClick = (ratingid:string, points:number) => {
        if(isEditing){
            const token = Cookies.get('token');
            if (!token) {
                router.push('/');
                return;
            }
            fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/rating/updateRating/${ratingid}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    points: inputValue
                })
            }).then(response => {
                if (response.status === 400) {
                    Cookies.remove('token');
                    router.push('/');
                    return;
                }
                return response.json();
            }).then((data:any) => {
                setIsEditing(false);
                router.push('/myratings')
            }).catch(error => console.error('Error:', error));
        }else {
            setInputValue(points);
            setIsEditing(true);
        }
    }

    const backstate = () => {
        setIsEditing(false);
    }

    return (
        <div className={'min-h-screen bg-black'}>
            <nav className="px-4 py-4 flex justify-between items-center bg-[#2B388F]">
                <ul>
                    <li className="flex items-center">
                        <img src="/snowlogo.png" alt="logo" className="w-12 h-12"/>
                        <h3 className="text-white lg:ml-4 md:ml-4 ml-1">Snow - My Ratings</h3>
                    </li>
                </ul>
                <ul className="flex">
                    <li className="flex cursor-pointer" onClick={goHome}>
                        <Home className="text-white"></Home>
                        <h3 className="text-white ml-2">Home</h3>
                    </li>
                </ul>
            </nav>

            {ratings.length > 0 ? (
            <div className="flex justify-center mt-5 ">
                <div className="w-4/5 mb-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 md:grid-cols-2 gap-4 ">
                        {ratings && ratings.map((rating) => (
                            <div key={rating._id} className="flex bg-[#1F82BF] p-2 rounded-lg items-center"

                            >
                                <img src={rating.movie.cover} alt={rating.movie.name} className="w-32 h-44"/>
                                <div className="flex flex-col justify-center bg-slate-100 w-full rounded-r-lg">
                                    <h3 className="text-center font-semibold">{rating.movie.name}</h3>
                                    <p className="text-center text-blue-900 font-semibold">{rating.movie.year}
                                    </p>

                                    <div className="flex justify-center items-center mt-2">
                                        <img
                                            src={
                                            rating.points < 30 ? "/snow30.png" :
                                                (rating.points >= 30 && rating.points < 50) ? "/snow50.png" :
                                                    (rating.points >= 50 && rating.points < 70) ? "/snow70.png" :
                                                        (rating.points >= 70 && rating.points < 90) ? "/snow90.png" :
                                                            (rating.points >= 90 && rating.points <= 100) ? "/snow100.png" :
                                                                            "/default.png"
                                                    }
                                                    className="w-16 h-16"
                                                    alt="image"
                                                />
                                        {!isEditing ? (
                                            <h3 className="text-center text-blue-900 font-bold text-3xl ml-2">{rating.points}</h3>
                                        ) : (
                                            <Input
                                                value={inputValue}
                                                type={'number'}
                                                onChange={(e) => setInputValue(parseInt(e.target.value))}
                                                className="w-20 h-12 text-center text-blue-900 font-bold text-3xl ml-2"
                                            />
                                        )}

                                        <Button className={'px-2 ml-4 bg-sky-600 hover:bg-sky-950'}
                                        onClick={()=>handleButtonClick(rating._id, rating.points)}
                                        >
                                            {!isEditing ? <Pencil/> : <Upload/>}
                                        </Button>
                                        {isEditing &&
                                        <Button className={'px-2 ml-4 bg-sky-600 hover:bg-sky-950'}
                                        onClick={backstate}
                                        >
                                            <RotateCcw/>
                                        </Button>
                                        }
                                    </div>

                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
                ) : (

                <div className={'flex h-[26rem] justify-center items-center'}>
                    <h1 className={'text-white'}> You do not have ratings yet</h1>
                </div>
            )}
        </div>
    )
}