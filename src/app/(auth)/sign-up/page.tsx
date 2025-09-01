"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useEffect, useState } from "react";
import { useDebounce } from "@uidotdev/usehooks";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { signupSchema } from "@/schemas/signupSchema";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";
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
  MessageCircle,
  Sparkles,
  Eye,
  EyeOff,
  Lock,
  User,
  Mail,
  CheckCircle,
  XCircle,
  UserCheck,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

const Page = () => {
  const [username, setUsername] = useState<string>("");
  const [usernameMessage, setUsernameMessage] = useState<string>("");
  const [isCheckingUsername, setIsCheckingUsername] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const debouncedUsername = useDebounce(username, 400);
  const router = useRouter();

  useEffect(() => {
    const handleMouseMove = (e: any) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  //zod implementation
  const form = useForm({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  const checkUsernameUnique = async (debouncedUsername: string) => {
    if (debouncedUsername) {
      setIsCheckingUsername(true);
      setUsernameMessage("");
      try {
        const response = await axios.get(
          `/api/check-username-unique?username=${debouncedUsername}`
        );
        console.log(response);

        setUsernameMessage(response.data.message);
      } catch (error: any) {
        console.log(error);

        if (error.response?.data?.message) {
          setUsernameMessage(error.response.data.message);
        } else {
          setUsernameMessage("Something went wrong");
        }
      } finally {
        setIsCheckingUsername(false);
      }
    }
  };

  const submitHandler = async (data: z.infer<typeof signupSchema>) => {
    setIsSubmitting(true);
    console.log(data);

    try {
      const response = await axios.post("/api/signup", data);

      router.replace(`/verify/${username}`);
      toast.success(response.data.message);
    } catch (error) {
      console.log(error);
      toast.error((error as AxiosError<ApiResponse>).response?.data.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    checkUsernameUnique(debouncedUsername);
  }, [debouncedUsername]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden flex items-center justify-center py-12">
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
        <div className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl shadow-purple-500/20 p-8 hover:shadow-purple-500/30 transition-all duration-500">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(submitHandler)}
              className="space-y-6"
            >
              {/* Username Field  */}
              <FormField
                name="username"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white font-medium flex items-center space-x-2">
                      <UserCheck className="w-4 h-4" />
                      <span>Username</span>
                    </FormLabel>
                    <FormControl>
                      <div className="relative group">
                        <Input
                          placeholder="Enter Username"
                          {...field}
                          onChange={(e) => {
                            field.onChange(e);
                            setUsername(e.target.value);
                          }}
                          className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 rounded-2xl py-6 px-4 focus:border-purple-400 focus:bg-white/15 transition-all duration-300 hover:bg-white/15"
                        />
                        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-500/20 to-pink-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                      </div>
                    </FormControl>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />

              {/* Username checking loader */}
              {isCheckingUsername && (
                <div className="flex items-center space-x-2 text-blue-400 text-sm">
                  <Loader className="w-4 h-4 animate-spin" />
                  <span>Checking availability...</span>
                </div>
              )}

              {/* Username message  */}
              {usernameMessage && (
                <div
                  className={`flex items-center space-x-2 text-sm ${
                    usernameMessage === "Username is available"
                      ? "text-green-400"
                      : "text-red-400"
                  }`}
                >
                  {usernameMessage === "Username is available" ? (
                    <CheckCircle className="w-4 h-4" />
                  ) : (
                    <XCircle className="w-4 h-4" />
                  )}
                  <span>{usernameMessage}</span>
                </div>
              )}

              {/* Email Field */}
              <FormField
                name="email"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white font-medium flex items-center space-x-2">
                      <Mail className="w-4 h-4" />
                      <span>Email</span>
                    </FormLabel>
                    <FormControl>
                      <div className="relative group">
                        <Input
                          placeholder="Enter Email"
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
                          placeholder="Enter Password"
                          {...field}
                          className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 rounded-2xl py-6 px-4 pr-12 focus:border-purple-400 focus:bg-white/15 transition-all duration-300 hover:bg-white/15"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-purple-400 transition-colors duration-200 cursor-pointer"
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

              {/* Submit Button  */}
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full group relative py-6 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white rounded-2xl font-semibold text-lg transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/25 border-0 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center space-x-2">
                    <Loader className="w-5 h-5 animate-spin" />
                    <span>Signing up...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center space-x-2">
                    <span>Sign up</span>
                    <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                  </div>
                )}
                <div className="absolute inset-0 rounded-2xl bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Button>
            </form>

            {/* Sign In Link  */}
            <div className="text-center mt-8 pt-6 border-t border-white/10">
              <p className="text-gray-300">
                Already a member?{" "}
                <Link
                  href="/sign-in"
                  className="text-purple-400 hover:text-pink-400 font-semibold transition-colors duration-300 hover:underline cursor-pointer"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </Form>
        </div>

        {/* Bottom decorative text */}
        <div className="text-center mt-8">
          <p className="text-gray-400 text-sm flex items-center justify-center space-x-2">
            <Sparkles className="w-4 h-4" />
            <span>Join thousands of users in anonymous conversations</span>
            <Sparkles className="w-4 h-4" />
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
