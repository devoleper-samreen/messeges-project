"use client";
import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import messages from "../../messages.json";
import Autoplay from "embla-carousel-autoplay";

function Home() {
  return (
    <main className="flex-grow flex flex-col items-center justify-center px-4 md:px-24 py-12">
      <section className="text-center mb-8 md:mb-12">
        <h1 className="text-3xl md:text-5xl font-bold">
          {" "}
          Dive into the World of Anonymous Conversations
        </h1>
        <p
          className="mt-3 md:mt-4 text-base
md:text-lg"
        >
          Explore Mystery Message - Where your identity remains a secret.
        </p>{" "}
      </section>

      {/* carousel*/}
      <Carousel
        className="w-full max-w-2xl"
        plugins={[Autoplay({ delay: 2000 })]}
      >
        <CarouselContent>
          {messages.map((message, index) => (
            <CarouselItem key={index}>
              <div className="p-3">
                <Card className="rounded-3xl overflow-hidden shadow-xl border-0 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 text-white">
                  <CardHeader className="p-4 border-b border-white/20">
                    <h3 className="text-xl font-bold tracking-wide text-center">
                      {message?.title}
                    </h3>
                  </CardHeader>

                  <CardContent className="p-6 flex flex-col justify-center items-center text-center">
                    <p className="text-lg leading-relaxed font-medium drop-shadow">
                      {message.content}
                    </p>
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        <CarouselPrevious className="left-4 bg-white/20 hover:bg-white/40 text-white rounded-full backdrop-blur-md shadow-md transition-all" />
        <CarouselNext className="right-4 bg-white/20 hover:bg-white/40 text-white rounded-full backdrop-blur-md shadow-md transition-all" />
      </Carousel>
    </main>
  );
}

export default Home;
