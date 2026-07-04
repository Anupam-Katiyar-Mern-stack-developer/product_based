import React,{useState,useEffect} from 'react'
import { Link } from 'react-router-dom';
const img1 = "/images/img1.jpg";
const img2 = "/images/img2.jpg";
const img3 = "/images/img3.jpg";

const Hero = () => {
  const[current,setCurrent]=useState(0);

  useEffect(()=>{
    const interval = setInterval(()=>{
      setCurrent((prev)=>(prev + 1 )%3);
    },3000);

    return ()=>clearInterval(interval);

  },[]);

  const nextSlide =()=>{
    setCurrent((prev)=>(prev + 1)%3);
  };

  const prevSlide =()=>{
    setCurrent((prev) => (prev === 0 ? 2 : prev-1));
  };


  return (
    <section className='relative w-full h-[600px] overflow-hidden '>
      {/* slide 1 */}

    {current === 0 && (

      <div className='w-full h-full relative'>
        <img src="{img1}" alt="img1" className='w-full h-full object-cover' />

        <div className='absolute inset-0 z-10 bg-black/50'></div>

        <div className='absolute inset-0 z-10 flex flex-col  justify-center px-6 md:px-20 text-white'>
          <h1 className='text-3xl md:text-6xl font-bold mb-4'>Modern Interior Design</h1>
           <p className="text-sm md:text-xl max-w-xl mb-6">
              Create your dream home with beautiful interiors.
            </p>

            <Link to='/about'
             className="w-fit px-6 py-3 rounded-full bg-blue-500 hover:scale-105 transition">
              Explore More
            </Link>
        </div>
      </div>
      
    )}

    {current === 1  && (
       <div className="w-full h-full relative">
          <img
            src={img2}
            alt="slide2"
            className="w-full h-full object-cover"
          />

          <div className="absolute inset-0 bg-black/50"></div>

          <div className="absolute inset-0 z-10 flex flex-col justify-center px-6 md:px-20 text-white">
            <h1 className="text-3xl md:text-6xl font-bold mb-4">
              Creative Workspace
            </h1>

            <p className="text-sm md:text-xl max-w-xl mb-6">
              Professional office designs for better productivity.
            </p>

            <Link 
            to='/products' className="w-fit px-6 py-3 rounded-full bg-green-500 hover:scale-105 transition">
              View Projects
            </Link>
          </div>
        </div>
    )}

     {current === 2  && (
       <div className="w-full h-full relative">
          <img
            src={img3}
            alt="slide2"
            className="w-full h-full object-cover"
          />

          <div className="absolute inset-0 bg-black/50"></div>

          <div className="absolute inset-0 z-10 flex flex-col justify-center px-6 md:px-20 text-white">
            <h1 className="text-3xl md:text-6xl font-bold mb-4">
              Creative Workspace
            </h1>

            <p className="text-sm md:text-xl max-w-xl mb-6">
              Professional office designs for better productivity.
            </p>

            <button className="w-fit px-6 py-3 rounded-full bg-green-500 hover:scale-105 transition">
              View Projects
            </button>
          </div>
        </div>
    )}

    </section>
  )
}

export default Hero