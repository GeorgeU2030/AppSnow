"use client"

import { Button } from "@/components/ui/button";
import AutoPlay from "embla-carousel-autoplay"
import { Card, CardContent } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem
} from "@/components/ui/carousel"
import { useState,useEffect } from "react";
import { jwtDecode, JwtPayload } from "jwt-decode";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
} from "@/components/ui/select"
import { useRouter } from "next/navigation";
import { LoaderCircle } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { setUserLoading, setUser } from "@/store/userSlice";
import { RootState } from "@/store/store";
import { Clapperboard, Film, LogOut, Star, Snowflake, BarChart3} from "lucide-react";
import Cookies from "js-cookie";

const desktopImageUrls = [
  'https://peachz.ca/wp-content/uploads/2023/06/R.jpeg',
  'https://image.tmdb.org/t/p/w1280/lbp1BmJNz979SbwqEZDgHYUeVg7.jpg',
  'https://ds.static.rtbf.be/article/image/1920x1080/1/5/9/94aa9a606ac6a95805134515b103bdd3.jpg',
  'https://chscommunicator.com/wp-content/uploads/2024/03/Screenshot-2024-03-04-at-9.17.21%E2%80%AFAM-1200x693.png',
  'https://themiamihurricane.com/wp-content/uploads/2024/01/boyandtheheron.png',
  'https://static1.colliderimages.com/wordpress/wp-content/uploads/2023/09/godzilla-minus-one-banner.jpg',
  'https://images7.alphacoders.com/133/1337622.jpg',
  'https://img1.hulu.com/user/v3/artwork/94f53938-6240-42b4-abef-8be1d1c39d72?base_image_bucket_name=image_manager&base_image=a9c64c07-5ce2-4d3d-b74b-87cd732b3112&size=1200x630&format=webp'
];

const mobileImageUrls = [
  'https://m.media-amazon.com/images/M/MV5BMDBmYTZjNjUtN2M1MS00MTQ2LTk2ODgtNzc2M2QyZGE5NTVjXkEyXkFqcGdeQXVyNzAwMjU2MTY@._V1_FMjpg_UX1000_.jpg',
  'https://m.media-amazon.com/images/M/MV5BNGIyYWMzNjktNDE3MC00YWQyLWEyMmEtN2ZmNzZhZDk3NGJlXkEyXkFqcGdeQXVyMTUzMTg2ODkz._V1_FMjpg_UX1000_.jpg',
  'https://m.media-amazon.com/images/M/MV5BYzRmOGQwZjktYjM2Ni00M2NmLWFlZDYtZGFhM2RkM2VhZDI1XkEyXkFqcGdeQXVyMTM1NjM2ODg1._V1_FMjpg_UX1000_.jpg',
  'https://m.media-amazon.com/images/M/MV5BZDlkZmRlYTctNGJmNy00MjVkLThjZDQtMWY5Zjg2NjlhZDZkXkEyXkFqcGdeQXVyMDM2NDM2MQ@@._V1_FMjpg_UX1000_.jpg',
  'https://m.media-amazon.com/images/M/MV5BZjZkNThjNTMtOGU0Ni00ZDliLThmNGUtZmMxNWQ3YzAxZTQ1XkEyXkFqcGdeQXVyMTUzMTg2ODkz._V1_FMjpg_UX1000_.jpg',
  'https://m.media-amazon.com/images/M/MV5BOTI5MjNjMTMtN2NiNC00YjBlLTgzMWQtMGRhZDZkYmY1NGU2XkEyXkFqcGdeQXVyNTgyNTA4MjM@._V1_.jpg',
  'https://m.media-amazon.com/images/M/MV5BMDEwZmU1ZTUtNTlmOS00ZGZlLWIyZjAtOTc1MmE2ZGMyNTFkXkEyXkFqcGdeQXVyNjM0MTI4Mw@@._V1_.jpg',
  'https://m.media-amazon.com/images/M/MV5BMDBiYmRkNjUtYzc4My00NGFiLWE2NWUtMGU1ZDA1NTQ3ZjQwXkEyXkFqcGdeQXVyMTM1NjM2ODg1._V1_FMjpg_UX1000_.jpg'
];

const textMovies = [
  'Oppenheimer winner of 7 Oscars Awards',
  'Poor Things winner of 4 Oscars Awards',
  'The Zone of Interest of 2 Oscars Awards',
  'American Fiction winner the Best Adapted Screenplay',
  'The Boy and the Heron winner of the Best Animation',
  'Godzilla Minus One winner of the Best Visual Effects',
  'Barbie winner of the Best Original Song',
  'Anatomy of a Fall winner the Best Original Screenplay'
]

interface MyToken extends JwtPayload {
  _id: string;
  role: string[];
}

interface Movie {
  _id: string;
  name: string;
  cover: string;
  points: number;
  amount: number;
  oscars: number;
  year:number
}

export default function Home() {

    const [admin,setAdmin]= useState<boolean>(false);
    const [movies, setMovies]=useState<Movie[]>([]);
    const [thereUser, setThereUser]=useState<boolean>(false);
    const history = useRouter();
    const dispatch = useDispatch();
    const loadingUser = useSelector((state:RootState) => state.user.loading);
    const user = useSelector((state:RootState) => state.user.data);

    useEffect(() => {
      const token = Cookies.get("token");

      if (token) {
        dispatch(setUserLoading(true));
        const decoded = jwtDecode<MyToken>(token);
        const userID = decoded._id;
        const admin = decoded.role[0]
        if(admin === 'admin'){
          setAdmin(true)
        }
        fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/user/getUser/${userID}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
          .then(response => {
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
          })
          .then(data => {
            dispatch(setUser({name: data.name, email: data.email, imageProfile: data.imageProfile})); 
            setThereUser(true);
          })
          .catch(error => console.error('Error:', error))
          .finally(() => dispatch(setUserLoading(false)));
        
      }
      else {
        dispatch(setUserLoading(false));
        dispatch(setUser(null));

      }

      if(!admin){
        fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/movie/getRandomMovies`)
        .then(response => {
          if (response.status === 400) { // Unauthorized
            Cookies.remove('token');
            window.location.reload();
            return [];
          }
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json();
        })
        .then((data:any) => {
          setMovies(data);
        })
        .catch(error => console.error('Error:', error));

      }else {
        dispatch(setUserLoading(false));
        dispatch(setUser(null));
      }
    }, []);

    const signIn = () => {
      history.push('/signIn');
    }

    const signUp = () => {
      history.push('/signUp');
    }

    const handleChange = (selectedValue:string) => {
      if(selectedValue == 'logout'){
        handleLogout();
      }else if(selectedValue == 'createDirector'){
        history.push('/newDirector');
      }else if(selectedValue == 'createActor'){
        history.push('/newActor');
      }else if(selectedValue == 'createMovie'){
        history.push('/newMovie');
      }
    }

    const handleChangeUser = (selectedValue:string)=>{

      if(selectedValue == 'myratings'){
        history.push('/myratings');
      }else if(selectedValue == 'seemovies') {
        history.push('/movies');
      }else if(selectedValue == 'logout'){
        handleLogout();
      }
    }
    const handleLogout = () => {
      localStorage.removeItem('token');
      Cookies.remove('token');
      setUser(null);
      setAdmin(false);
      history.refresh()
      window.location.reload()
    }

  return (
    <div className="w-screen min-h-screen bg-black">
      <nav className="px-4 py-4 flex justify-between items-center bg-[#2B388F]">
        <ul >
          <li className="flex items-center">
            <img src="/snowlogo.png" alt="logo" className="w-12 h-12" />
            <h3 className="text-white lg:ml-4 md:ml-4 ml-1">Snow</h3>
          </li>
        </ul>
        <ul className="flex ">

          {thereUser ? (
            admin ? (
              <Select onValueChange={handleChange}>
              <SelectTrigger className="w-[180px] mr-2 lg:mr-8 md:mr-8 bg-black text-white">
                <SelectValue placeholder="Admin" />
              </SelectTrigger>
                <SelectContent className="w-[180px]">
                <SelectGroup className="w-[180px]">
                  <SelectItem value="createDirector" className="font-semibold">
                  <div className="flex items-center">
                    <Clapperboard/>
                    <span className="ml-2">+ Director</span>
                  </div>
                  </SelectItem>
                  <SelectItem value="createActor" className="font-semibold flex ">
                  <div className="flex items-center">
                    <Star/>
                    <span className="ml-2">+ Actor</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="createMovie" className="font-semibold">
                  <div className="flex items-center">
                    <Film/>
                    <span className="ml-2">+ Movie</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="logout" className="font-semibold bg-blue-600 text-white">
                  <div className="flex items-center">
                    <LogOut/>
                    <span className="ml-2">Logout</span>
                  </div>
                  </SelectItem>
                </SelectGroup>
                </SelectContent>
              </Select>
            ):(
              <Select onValueChange={handleChangeUser}>
              <SelectTrigger className="w-[180px] mr-2 lg:mr-8 md:mr-8 bg-black text-white">
                <SelectValue placeholder={user?.name} />
              </SelectTrigger>
                <SelectContent className="w-[180px]">
                <SelectGroup className="w-[180px]">
                  <SelectItem value="myratings" className="font-semibold">
                  <div className="flex items-center">
                    <BarChart3/>
                    <span className="ml-2">My Ratings</span>
                  </div>
                  </SelectItem>
                  <SelectItem value="seemovies" className="font-semibold">
                  <div className="flex items-center">
                    <Film/>
                    <span className="ml-2">See Movies</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="logout" className="font-semibold bg-blue-600 text-white">
                  <div className="flex items-center">
                    <LogOut/>
                    <span className="ml-2">Logout</span>
                  </div>
                  </SelectItem>
                </SelectGroup>
                </SelectContent>
              </Select>
            )
          ) : (
            null
          )
          }
          <li>
          {loadingUser ? (
          <LoaderCircle className="text-white" />
          ) : user ? (
            <Avatar className="lg:block md:block" >
              <AvatarImage src={user.imageProfile} alt="@shadcn"/>
              <AvatarFallback></AvatarFallback>
            </Avatar>
          ) : (
            <>
              <Button className="mr-4 hover:bg-[#2953A6] bg-[#1F82BF] px-5" onClick={signIn}>
                Sign In
              </Button>
              <Button className="mr-2 hover:bg-[#2953A6] bg-[#1F82BF]" onClick={signUp}>
                Sign Up
              </Button>
            </>
          )}
          </li>
        </ul>
      </nav>

    <div className="w-full flex flex-col items-center">
    <div className="mt-5 w-3/4 bg-blue-200 h-[26rem] flex justify-center">
    <Carousel className="w-full h-[26rem] bg-[#2953A6]"
    plugins={[
      AutoPlay({
        delay: 5000
      })
    ]}
    >
      <CarouselContent className="h-[26rem]">
        {Array.from({ length: 8 }).map((_, index) => (
        <CarouselItem key={index} className="h-[26rem] bg-[#2953a6]">
          <div className="p-1">
            <Card className="h-[26rem] bg-[#1F82BF]">
              <CardContent className="flex flex-col aspect-square items-center w-full justify-center p-6 h-[26rem]">
                <img
                  src={mobileImageUrls[index % mobileImageUrls.length]}
                  alt={`Mobile Image ${index + 1}`}
                  className="object-cover w-full h-full block lg:hidden md:hidden"
                />
                <img
                  src={desktopImageUrls[index % desktopImageUrls.length]}
                  alt={`Desktop Image ${index + 1}`}
                  className="object-cover w-full h-full hidden lg:block md:block"
                />

                <span className="text-center py-3 text-white flex">{textMovies[index]}
                <img
                  src='/oscar.png'
                  className="w-8 h-8 hidden lg:block md:block"
                />
                </span>

                </CardContent>

            </Card>
          </div>
        </CarouselItem>
      ))}
      </CarouselContent>

    </Carousel>
    </div>
    </div>

    {!admin ? (
    <div className="max-w-full flex justify-center mt-10 ">
      <div className="w-3/4 grid lg:grid-cols-4 gap-4 md:grid-cols-3">
      {movies.map(movie => (
      <div key={movie._id} className="bg-[#2953a6] flex flex-col items-center rounded-lg">
        <img src={movie.cover} className="h-48 w-36 mt-2" alt={movie.name} />
        <h2 className="text-center mx-1 h-12 flex items-center justify-center text-white">{movie.name}</h2>
        <div className="flex mt-2 items-center">
          <Snowflake className="w-10 h-10 text-white"/>
          {movie.amount === 0 ? (
            <p className="text-white ml-2">---</p>
          ):(
            <p className="text-white ml-2">{movie.points}</p>
          )}
          {movie.oscars > 0 &&
          <img src="/oscar.png" className="w-10 h-10 "/>
          }
        </div>
        <p className="text-white mt-2 text-sm">{movie.amount} votes</p>
      </div>
    ))}
    </div>
    </div>
    ):(
      <div>
        <h2 className="text-white"></h2>
      </div>
    )
    }

    <footer className="mt-8 bg-black">Snow</footer>
    </div>
  );
}
