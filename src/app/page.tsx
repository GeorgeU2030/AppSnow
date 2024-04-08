"use client"

import { Button } from "@/components/ui/button";
import AutoPlay from "embla-carousel-autoplay"
import { Card, CardContent } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem
} from "@/components/ui/carousel"

const desktopImageUrls = [
  'https://peachz.ca/wp-content/uploads/2023/06/R.jpeg',
  'https://image.tmdb.org/t/p/w1280/lbp1BmJNz979SbwqEZDgHYUeVg7.jpg',
  'https://assets.mubicdn.net/images/artworks/668724/images-original.png?1708612772',
  'https://chscommunicator.com/wp-content/uploads/2024/03/Screenshot-2024-03-04-at-9.17.21%E2%80%AFAM-1200x693.png',
  'https://themiamihurricane.com/wp-content/uploads/2024/01/boyandtheheron.png',
  'https://static1.colliderimages.com/wordpress/wp-content/uploads/2023/09/godzilla-minus-one-banner.jpg',
  'https://images7.alphacoders.com/133/1337622.jpg',
  'https://img1.hulu.com/user/v3/artwork/94f53938-6240-42b4-abef-8be1d1c39d72?base_image_bucket_name=image_manager&base_image=a9c64c07-5ce2-4d3d-b74b-87cd732b3112&size=1200x630&format=webp'
];

const mobileImageUrls = [
  'mobileUrl1',
  'mobileUrl2',
  'mobileUrl3',
  'mobileUrl4',
  'mobileUrl5',
];


export default function Home() {
  return (
    <div className="w-screen h-screen bg-black">
      <nav className="px-4 py-4 flex justify-between items-center bg-[#2B388F]">
        <ul>
          <li className="flex items-center">
            <img src="/snowlogo.png" alt="logo" className="w-12 h-12" />
            <h3 className="text-white ml-4">Snow</h3>
          </li>
        </ul>
        <ul>
          <li>
            <Button className="mr-4 hover:bg-[#2953A6] bg-[#1F82BF] px-5">
              Sign In
            </Button>
            <Button className="mr-2 hover:bg-[#2953A6] bg-[#1F82BF]">
              Sign Up
            </Button>
          </li>
        </ul>
      </nav>

    <div className="w-full flex flex-col items-center">
    <div className="mt-5 w-3/4 bg-blue-200 h-[26rem] flex justify-center">
    <Carousel className="w-full h-[26rem] bg-blue-700"
    plugins={[
      AutoPlay({
        delay: 5000
      })
    ]}
    >
      <CarouselContent className="h-[26rem]">
        {Array.from({ length: 8 }).map((_, index) => (
        <CarouselItem key={index} className="h-[26rem] bg-yellow-500">
          <div className="p-1">
            <Card className="h-[26rem] bg-red-400">
              <CardContent className="flex flex-col aspect-square items-center w-full justify-center p-6 h-96">
                <img 
                  src={mobileImageUrls[index % mobileImageUrls.length]} 
                  alt={`Mobile Image ${index + 1}`} 
                  className="object-cover w-full h-full block lg:hidden" // Visible en móvil
                />
                <img 
                  src={desktopImageUrls[index % desktopImageUrls.length]} 
                  alt={`Desktop Image ${index + 1}`} 
                  className="object-cover w-full h-full hidden lg:block md:block" // Visible en escritorio
                />
                <span>{index+1}</span>
              </CardContent>
              
            </Card>
          </div>
        </CarouselItem>
      ))}
      </CarouselContent>

    </Carousel>
    </div>
    </div>

    </div>
  );
}
