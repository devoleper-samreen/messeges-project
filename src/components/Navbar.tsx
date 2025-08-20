"use client";
import React from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { User } from "next-auth";
import { Button } from "./ui/button";

function Navbar() {
  const { data: session } = useSession();
  const user = session?.user as User;

  return (
    <nav className="w-full bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold transition-colors">
          Mystry Message
        </Link>

        {/* Right Side */}
        <div className="flex items-center gap-4">
          {session ? (
            <>
              <span className="text-gray-700 text-sm md:text-base">
                Welcome,{" "}
                <span className="font-medium">
                  @{user?.username || user?.email}
                </span>
              </span>
              <Button
                onClick={() => signOut()}
                className="text-white cursor-pointer px-4 py-2 rounded-lg shadow transition-all"
              >
                Logout
              </Button>
            </>
          ) : (
            <Link href="/sign-in">
              <Button className="text-white px-4 py-2 rounded-lg shadow transition-all cursor-pointer">
                Sign In
              </Button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
