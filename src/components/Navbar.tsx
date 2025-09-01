"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { User } from "next-auth";
import { Button } from "./ui/button";
import {
  MessageCircle,
  LogOut,
  User as UserIconLucide,
  Menu,
  X,
  Sparkles,
} from "lucide-react";

function Navbar() {
  const { data: session } = useSession();
  const user = session?.user as User;
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <nav
        className={`w-full fixed top-0 z-50 transition-all duration-500 ${
          isScrolled
            ? "bg-black/20 backdrop-blur-xl shadow-lg shadow-purple-500/10 border-b border-white/5"
            : "bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <Link
              href="/"
              className="group flex items-center space-x-3 transition-all duration-300 hover:scale-105"
            >
              <div className="relative">
                <MessageCircle className="w-8 h-8 text-purple-400 group-hover:text-pink-400 transition-colors duration-300" />
                <Sparkles className="w-4 h-4 text-yellow-400 absolute -top-1 -right-1 animate-pulse" />
              </div>
              <span className="text-xl md:text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Mystery Message
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-6">
              {session ? (
                <>
                  {/* User Info */}
                  <div className="flex items-center space-x-3 px-4 py-2 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                      <UserIconLucide className="w-4 h-4 text-white" />
                    </div>
                    <div className="text-sm">
                      <p className="text-gray-300">Welcome back!</p>
                      <p className="text-purple-400 font-medium truncate max-w-32">
                        @{user?.username || user?.email?.split("@")[0]}
                      </p>
                    </div>
                  </div>

                  {/* Logout Button */}
                  <Button
                    onClick={() => signOut()}
                    className="cursor-pointer group relative flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-500 hover:to-pink-500 text-white rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-red-500/25 border-0"
                  >
                    <LogOut className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    <span className="font-medium">Logout</span>
                  </Button>
                </>
              ) : (
                <div className="flex items-center space-x-4">
                  {/* Sign In Button */}
                  <Link href="/sign-in">
                    <Button className="cursor-pointer group relative px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white rounded-2xl transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/25 border-0">
                      <span className="font-medium">Sign In</span>
                      <div className="absolute inset-0 rounded-2xl bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </Button>
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 transition-all duration-300"
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>

          {/* Mobile Menu */}
          <div
            className={`md:hidden transition-all duration-300 overflow-hidden ${
              isMobileMenuOpen
                ? "max-h-96 opacity-100 mt-4"
                : "max-h-0 opacity-0"
            }`}
          >
            <div className="bg-slate-800/80 backdrop-blur-xl rounded-2xl border border-white/10 p-4">
              {session ? (
                <div className="space-y-4">
                  {/* Mobile User Info */}
                  <div className="flex items-center space-x-3 p-3 rounded-xl bg-white/5">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                      <UserIconLucide className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-gray-300 text-sm">Welcome back!</p>
                      <p className="text-purple-400 font-medium">
                        @{user?.username || user?.email?.split("@")[0]}
                      </p>
                    </div>
                  </div>

                  {/* Mobile Logout */}
                  <Button
                    onClick={() => {
                      signOut();
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center justify-center space-x-2 py-3 bg-gradient-to-r from-red-600 to-pink-600 text-white rounded-xl border-0"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </Button>
                </div>
              ) : (
                <Link href="/sign-in">
                  <Button
                    className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl border-0"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Sign In
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Animated border bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent"></div>
      </nav>

      {/* Spacer to prevent content overlap */}
      <div className="h-14 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900"></div>
    </>
  );
}

export default Navbar;
