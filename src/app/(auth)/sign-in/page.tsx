"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Loader,
  Sparkles,
  Eye,
  EyeOff,
  Lock,
  User,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import { signinSchema } from "@/schemas/signinSchema";
import { signIn } from "next-auth/react";

const Page = () => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: any) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  //zod implementation
  const form = useForm({
    resolver: zodResolver(signinSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  const submitHandler = async (data: z.infer<typeof signinSchema>) => {
    setIsSubmitting(true);
    const result = await signIn("credentials", {
      redirect: false,
      identifier: data.identifier,
      password: data.password,
    });

    if (result?.error) {
      toast.error(result.error);
      setIsSubmitting(false);
    }

    if (result?.url) {
      router.replace("/dashboard");
    }
  };

  const handleGetCredentials = () => {
    form.setValue("identifier", "sam000");
    form.setValue("password", "12345678");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden flex items-center justify-center">
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
        }}
      />

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-md mx-4">
        {/* Form Card */}
        <div className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl shadow-purple-500/20 p-8 hover:shadow-purple-500/30 transition-all duration-500 lg:mt-8">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(submitHandler)}
              className="space-y-6"
            >
              {/* Username/Email Field */}
              <FormField
                name="identifier"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white font-medium flex items-center space-x-2">
                      <User className="w-4 h-4" />
                      <span>Username or Email</span>
                    </FormLabel>
                    <FormControl>
                      <div className="relative group">
                        <Input
                          placeholder="Enter your username or email"
                          {...field}
                          className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 rounded-2xl py-6 px-4 focus:border-purple-400 focus:bg-white/15 transition-all duration-300 hover:bg-white/15"
                        />
                        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500/20 to-pink-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                      </div>
                    </FormControl>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />

              {/* Password Field */}
              <FormField
                name="password"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white font-medium flex items-center space-x-2">
                      <Lock className="w-4 h-4" />
                      <span>Password</span>
                    </FormLabel>
                    <FormControl>
                      <div className="relative group">
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter your password"
                          {...field}
                          className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 rounded-2xl py-6 px-4 pr-12 focus:border-purple-400 focus:bg-white/15 transition-all duration-300 hover:bg-white/15"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-purple-400 transition-colors duration-200"
                        >
                          {showPassword ? (
                            <EyeOff className="w-5 h-5" />
                          ) : (
                            <Eye className="w-5 h-5" />
                          )}
                        </button>
                        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500/20 to-pink-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                      </div>
                    </FormControl>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />

              {/* Buttons */}
              <div className="space-y-4 pt-4">
                {/* Sign In Button */}
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="cursor-pointer w-full group relative py-6 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white rounded-2xl font-semibold text-lg transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/25 border-0 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center space-x-2">
                      <Loader className="w-5 h-5 animate-spin" />
                      <span>Signing In...</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center space-x-2">
                      <span>Sign In</span>
                      <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                    </div>
                  )}
                  <div className="absolute inset-0 rounded-2xl bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </Button>

                {/* Get Credentials Button */}
                <Button
                  type="button"
                  onClick={handleGetCredentials}
                  className="cursor-pointer w-full py-6 bg-white/10 hover:bg-white/20 text-white rounded-2xl font-medium border border-white/20 hover:border-white/30 transition-all duration-300 hover:scale-105"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  Get Test Credentials
                </Button>
              </div>
            </form>
          </Form>

          {/* Sign Up Link */}
          <div className="text-center mt-8 pt-6 border-t border-white/10">
            <p className="text-gray-300">
              Don't have an account?{" "}
              <Link
                href="/sign-up"
                className="text-purple-400 hover:text-pink-400 font-semibold transition-colors duration-300 hover:underline"
              >
                Sign up here
              </Link>
            </p>
          </div>
        </div>

        {/* Bottom decorative text */}
        <div className="text-center mt-8">
          <p className="text-gray-400 text-sm flex items-center justify-center space-x-2">
            <Lock className="w-4 h-4" />
            <span>Your privacy is our priority</span>
            <Lock className="w-4 h-4" />
          </p>
        </div>
      </div>

      {/* Floating elements */}
      <div className="fixed top-20 left-10 w-3 h-3 bg-purple-400 rounded-full animate-ping opacity-60"></div>
      <div className="fixed top-40 right-20 w-2 h-2 bg-pink-400 rounded-full animate-ping opacity-40 delay-1000"></div>
      <div className="fixed bottom-32 left-1/4 w-4 h-4 bg-blue-400 rounded-full animate-ping opacity-30 delay-2000"></div>
    </div>
  );
};

export default Page;
