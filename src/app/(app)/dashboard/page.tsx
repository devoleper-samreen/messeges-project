"use client";
import MessageCard from "@/components/MessageCard";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Message } from "@/model/user";
import { acceptMessageSchema } from "@/schemas/accepMessageSchema";
import { ApiResponse } from "@/types/ApiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { Loader2, RefreshCcw } from "lucide-react";
import { User } from "next-auth";
import { useSession } from "next-auth/react";
import { use, useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

function page() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSwitching, setIsSwitching] = useState<boolean>(false);
  const { data: session } = useSession();
  if (!session || !session.user) {
    return <div>Please Login</div>;
  }

  const form = useForm({
    resolver: zodResolver(acceptMessageSchema),
  });

  const { register, watch, setValue } = form;
  const acceptMessages = watch("acceptMessage");

  const fetchAcceptMessages = useCallback(async () => {
    setIsSwitching(true);
    try {
      const response = await axios.get<ApiResponse>(`/api/accept-messages`);
      setValue("acceptMessage", response.data?.isAcceptingMessages ?? false);
    } catch (error) {
      const AxiosErrror = error as AxiosError<ApiResponse>;
      toast.error(AxiosErrror.response?.data.message);
    } finally {
      setIsSwitching(false);
    }
  }, [setValue]);

  const fetchMessages = useCallback(
    async (refresh?: boolean) => {
      setIsLoading(true);
      setIsSwitching(true);
      try {
        const response = await axios.get<ApiResponse>("/api/get-messages");
        setMessages(response.data.messages || []);

        if (refresh) {
          toast.success("Refreshed messages");
        }
      } catch (error) {
        const AxiosErrror = error as AxiosError<ApiResponse>;
        toast.error(AxiosErrror.response?.data.message);
      } finally {
        setIsLoading(false);
        setIsSwitching(false);
      }
    },
    [setIsLoading, setMessages]
  );

  useEffect(() => {
    if (!session || !session.user) {
      return;
    }

    fetchMessages();
    fetchAcceptMessages();
  }, [fetchAcceptMessages, fetchMessages, session, setValue]);

  //handle switch case
  const handleSwitchChange = async () => {
    try {
      const response = await axios.post<ApiResponse>("/api/accept-messages", {
        acceptMessages: !acceptMessages,
      });
      setValue("acceptMessage", !acceptMessages);
      toast.success(response.data.message);
    } catch (error) {
      const AxiosErrror = error as AxiosError<ApiResponse>;
      toast.error(AxiosErrror.response?.data.message);
    }
  };

  const handleDeleteMessage = async (messageId: string) => {
    setMessages(messages.filter((message) => message._id !== messageId));
  };

  const { username } = session?.user as User;
  //TODO: more research
  const baseUrl = `${window.location.protocol}//${window.location.host}`;
  const profileUrl = `${baseUrl}/u/${username}`;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(profileUrl);
      toast.success("Copied to clipboard");
    } catch (error) {
      toast.error("Failed to copy to clipboard");
    }
  };

  if (!session || !session.user) {
    return <div>Please Login</div>;
  }

  //  return (
  // <div className="my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white rounded w-full max-w-6xl">
  //      <h1 className="text-4xl font-bold mb-4">
  //        User Dashboard
  // </h1>
  // <div className="mb-4">
  // <h2 className="text-lg font-semibold mb-2">Copy Your
  // Unique Link</h2>{''}
  //        <div className="flex items-center">
  //          <input
  // type="text"
  // value={profileUrl}
  // disabled
  // className="input input-bordered w-full p-2 mr-2"
  // />
  // <Button onClick={copyToClipboard}>Copy</Button>
  //        </div>
  //      </div>

  //      <div className="mb-4">
  // <Switch
  // {...register('acceptMessage')}
  // checked={acceptMessages}
  // onCheckedChange={handleSwitchChange}
  // disabled={isSwitching}
  // />
  //        <span className="ml-2"> Accept Messages: {acceptMessages ? 'On' : 'Off'}
  // </span>
  // </div>
  //      <Separator />

  //      <Button
  // className="mt-4"
  // variant="outline"
  // onClick={(e) => {
  // e.preventDefault();
  // fetchMessages(true);
  // }}
  //      >
  //        {isLoading ? (
  // <Loader2 className="h-4 w-4 animate-spin" />
  // ):(
  // <RefreshCcw className="h-4 w-4"
  // ) }
  //      </Button>

  //      <div className="mt-4 grid grid-cols-1 md:grid-cols-2
  // gap-6">
  // {messages.length > 0 ? (
  // messages.map((message, index)
  // <MessageCard
  // key={message._id}
  // message={message}
  // onMessageDelete={handleDeleteMessage}
  // />
  // ))
  // ):(
  // <p>No messages to display.</p>
  //      </div>

  //      </div>
  //      )
  // }

  return (
    <div className="my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white rounded w-full max-w-6xl">
      <h1 className="text-4xl font-bold mb-4">User Dashboard</h1>

      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Copy Your Unique Link</h2>
        <div className="flex items-center">
          <input
            type="text"
            value={profileUrl}
            disabled
            className="input input-bordered w-full p-2 mr-2"
          />
          <Button onClick={copyToClipboard}>Copy</Button>
        </div>
      </div>

      <div className="mb-4">
        <Switch
          {...register("acceptMessage")}
          checked={acceptMessages}
          onCheckedChange={handleSwitchChange}
          disabled={isSwitching}
        />
        <span className="ml-2">
          Accept Messages: {acceptMessages ? "On" : "Off"}
        </span>
      </div>

      <Separator />

      <Button
        className="mt-4"
        variant="outline"
        onClick={(e) => {
          e.preventDefault();
          fetchMessages(true);
        }}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <RefreshCcw className="h-4 w-4" />
        )}
      </Button>

      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
        {messages.length > 0 ? (
          messages.map((message, index) => (
            <MessageCard
              key={message._id as string}
              message={message}
              onMessageDelete={handleDeleteMessage}
            />
          ))
        ) : (
          <p>No messages to display.</p>
        )}
      </div>
    </div>
  );
}

export default page;
