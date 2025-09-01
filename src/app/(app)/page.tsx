"use client";
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  MessageCircle,
  Sparkles,
  Shield,
  Users,
  ArrowRight,
  Star,
} from "lucide-react";
import Link from "next/link";

const messages = [
  {
    title: "Anonymous Feedback",
    content:
      "Get honest opinions without the fear of judgment. Perfect for creators, professionals, and anyone seeking genuine feedback.",
  },
  {
    title: "Secret Admirers",
    content:
      "Someone has something beautiful to say but is too shy? Let them express their feelings anonymously.",
  },
  {
    title: "Constructive Criticism",
    content:
      "Receive valuable insights and suggestions that can help you grow personally and professionally.",
  },
  {
    title: "Hidden Thoughts",
    content:
      "Sometimes the most powerful messages come from those who prefer to stay in the shadows.",
  },
];

function Home() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);

    const handleMouseMove = (e: any) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-2000"></div>
      </div>

      {/* Floating cursor effect */}
      <div
        className="fixed w-6 h-6 pointer-events-none z-50 transition-all duration-300 ease-out"
        style={{
          left: mousePosition.x - 12,
          top: mousePosition.y - 12,
          background:
            "radial-gradient(circle, rgba(168, 85, 247, 0.4) 0%, transparent 70%)",
          borderRadius: "50%",
          transform: "scale(1)",
        }}
      />

      <main className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 md:px-8 py-12">
        {/* Hero Section */}
        <div
          className={`text-center mb-16 transform transition-all duration-1000 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
        >
          <div className="mb-6 flex items-center justify-center">
            <div className="relative">
              <MessageCircle className="w-16 h-16 text-purple-400 animate-bounce" />
              <Sparkles className="w-8 h-8 text-yellow-400 absolute -top-2 -right-2 animate-spin" />
            </div>
          </div>

          <h1 className="text-4xl md:text-7xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent mb-6 leading-tight">
            Mystery Messages
          </h1>

          <p className="text-xl md:text-2xl text-gray-300 mb-4 max-w-3xl mx-auto leading-relaxed">
            Dive into the World of{" "}
            <span className="text-purple-400 font-semibold">
              Anonymous Conversations
            </span>
          </p>

          <p className="text-lg text-gray-400 mb-8 max-w-2xl mx-auto">
            Where your identity remains a secret, but your voice is heard loud
            and clear.
          </p>

          {/* Feature highlights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-12">
            {[
              { icon: Shield, text: "100% Anonymous", color: "text-green-400" },
              { icon: Users, text: "Connect Safely", color: "text-blue-400" },
              { icon: Star, text: "AI-Powered", color: "text-yellow-400" },
            ].map((feature, index) => (
              <div
                key={index}
                className={`flex items-center justify-center space-x-3 p-4 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 transform transition-all duration-300 hover:scale-105 hover:bg-white/10 delay-${index * 200}`}
              >
                <feature.icon className={`w-6 h-6 ${feature.color}`} />
                <span className="text-white font-medium">{feature.text}</span>
              </div>
            ))}
          </div>

          {/* CTA Button */}
          <Link href="/dashboard">
            <button className="cursor-pointer group relative inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white transition-all duration-300 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl hover:from-purple-500 hover:to-pink-500 transform hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/25">
              <span className="relative z-10">Start Your Journey</span>
              <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 blur transition-all duration-300"></div>
            </button>
          </Link>
        </div>

        {/* Enhanced Carousel */}
        <div
          className={`w-full max-w-4xl transform transition-all duration-1000 delay-500 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
        >
          <h2 className="text-3xl font-bold text-center text-white mb-8">
            Discover the <span className="text-purple-400">Magic</span> of
            Anonymous Communication
          </h2>

          <Carousel className="w-full">
            <CarouselContent>
              {messages.map((message, index) => (
                <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                  <div className="p-4">
                    <Card className="group relative overflow-hidden border-0 bg-gradient-to-br from-slate-800/80 to-purple-900/80 backdrop-blur-xl hover:shadow-2xl hover:shadow-purple-500/20 transition-all duration-500 hover:scale-105 rounded-3xl">
                      {/* Gradient overlay */}
                      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                      <CardHeader className="relative z-10 p-6 border-b border-white/10">
                        <div className="flex items-center space-x-3">
                          <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                          <h3 className="text-xl font-bold text-white group-hover:text-purple-300 transition-colors duration-300">
                            {message.title}
                          </h3>
                        </div>
                      </CardHeader>

                      <CardContent className="relative z-10 p-6">
                        <p className="text-gray-300 leading-relaxed group-hover:text-white transition-colors duration-300">
                          {message.content}
                        </p>
                      </CardContent>

                      {/* Animated border */}
                      <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                        <div className="absolute inset-0 rounded-3xl border-2 border-purple-500/30 animate-pulse"></div>
                      </div>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>

            <CarouselPrevious className="left-4 bg-white/10 hover:bg-white/20 text-white border-white/20 backdrop-blur-md shadow-xl transition-all duration-300 hover:scale-110" />
            <CarouselNext className="right-4 bg-white/10 hover:bg-white/20 text-white border-white/20 backdrop-blur-md shadow-xl transition-all duration-300 hover:scale-110" />
          </Carousel>
        </div>

        {/* Bottom Section */}
        <div
          className={`mt-16 text-center transform transition-all duration-1000 delay-1000 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
          }`}
        >
          <div className="flex items-center justify-center space-x-2 text-gray-400 mb-4">
            <Sparkles className="w-5 h-5" />
            <span>
              Join thousands of users in meaningful anonymous conversations
            </span>
            <Sparkles className="w-5 h-5" />
          </div>
          <p className="text-sm text-gray-500">
            Your privacy is our priority. Always secure, always anonymous.
          </p>
        </div>
      </main>

      {/* Floating elements */}
      <div className="fixed top-20 left-10 w-3 h-3 bg-purple-400 rounded-full animate-ping opacity-60"></div>
      <div className="fixed top-40 right-20 w-2 h-2 bg-pink-400 rounded-full animate-ping opacity-40 delay-1000"></div>
      <div className="fixed bottom-32 left-1/4 w-4 h-4 bg-blue-400 rounded-full animate-ping opacity-30 delay-2000"></div>
    </div>
  );
}

export default Home;
