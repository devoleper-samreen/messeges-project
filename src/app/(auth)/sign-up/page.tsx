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
import { Loader } from "lucide-react";
import Link from "next/link";

const Page = () => {
  const [username, setUsername] = useState<string>("");
  const [usernameMessage, setUsernameMessage] = useState<string>("");
  const [isCheckingUsername, setIsCheckingUsername] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const debouncedUsername = useDebounce(username, 400);
  const router = useRouter();

  //zod impletation
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
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1
            className="text-4xl font-extrabold
tracking-tight lg:text-5xl mb-6"
          >
            Join Mystery Message
          </h1>
          <p className="mb-4">Sign up to start your anonymous adventure</p>
        </div>
        {/* form */}
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(submitHandler)}
            className="space-y-6"
          >
            <FormField
              name="username"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter Username"
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        setUsername(e.target.value);
                      }}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            {isCheckingUsername && (
              <Loader className="animate-spin text-sm text-green-400" />
            )}
            {usernameMessage && (
              <p
                className={`text-sm mt-0 ${usernameMessage === "Username is available" ? "text-green-500" : "text-red-500"}`}
              >
                {usernameMessage}
              </p>
            )}
            <FormField
              name="email"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter Email" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="password"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Enter Password"
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              disabled={isSubmitting}
              className="cursor-pointer"
            >
              {isSubmitting ? (
                <Loader className="mr-2 h-4 animate-spin" />
              ) : (
                "Sign up"
              )}
            </Button>
          </form>
          <div className="text-center mt-4">
            <p>
              Already a member?{""}
              <Link
                href="/sign-in"
                className="text-blue-600 hover:text-blue-800"
              >
                Sign in
              </Link>
            </p>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default Page;
