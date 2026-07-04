import React  from "react";

export default function Card(){
    return (
        <section className="my-7 mx-7 bg-amber-50 h-screen w-full flex items-center justify-center">
            <div className="flex flex-col  border rounded-2xl bg-white w-[400px] shadow-xl shadow-green-500 hover:scale-105 transition-all ease-in-out duration-500">
                <div className="object-fit overflow-hidden">
                    <img src="https://images.pexels.com/photos/23581703/pexels-photo-23581703.jpeg" alt="img" className="rounded-2xl object-cover hover:scale-105 transition-all durattion-500 ease-in-out"/>
                </div>
                <div className="flex flex-col p-3">
                    <div >
                        <p className=" ">hii</p>
                    </div>
                    <div className="text-2xl font-bold">hello</div>
                </div>
            </div>
        </section>
    )
}