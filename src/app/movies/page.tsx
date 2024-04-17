"use client"

import { Home, Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Input } from "@/components/ui/input"
import { Button} from "@/components/ui/button";

export default function Movies(){


    const router = useRouter();
    const goHome = () => {
        router.push('/');
    }

    async function getMovies(){
        fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/movie/getMovies`)

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
                    <Input placeholder="Search Movies" className="w-1/5 mr-1 font-semibold"/>
                    <Button className="mr-3 bg-[#1F82BF] hover:bg-blue-600 px-2">
                        <Search/>
                    </Button>
                </div>
            </div>
        </div>
    )
}