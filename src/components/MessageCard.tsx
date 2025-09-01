"use client";
import React from "react";
import {
  Card,
  CardAction,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { XIcon } from "lucide-react";
import { Message } from "@/model/user";
import axios from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import { toast } from "sonner";

type messageCardProps = {
  message: Message;
  onMessageDelete: (messageId: string) => void;
};

function MessageCard({ message, onMessageDelete }: messageCardProps) {
  const handlerDeleteConfirm = async () => {
    const response = await axios.delete<ApiResponse>(
      `/api/delete-message/${message._id}`
    );
    toast.success(response.data.message);
    onMessageDelete(message._id as string);
  };

  const formattedDate = new Date(message.createdAt).toLocaleString("en-US", {
    month: "short", // Jan, Feb, Mar
    day: "2-digit", // 01, 02
    year: "numeric", // 2024
    hour: "numeric", // 1, 2, ... 12
    minute: "2-digit", // 01, 02
    hour12: true, // AM/PM
  });

  return (
    <Card className="relative border-0 bg-transparent">
      <CardHeader className="z-10 p-6">
        <CardAction className="absolute top-4 right-4 cursor-pointer">
          <AlertDialog>
            <AlertDialogTrigger>
              <div className="cursor-pointer group/icon relative p-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full hover:scale-110 transition-all duration-100 hover:shadow-lg hover:shadow-purple-500/25">
                <XIcon className="w-4 h-4 text-white" />
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 opacity-0 group-hover/icon:opacity-100 blur transition-all duration-100"></div>
              </div>
            </AlertDialogTrigger>
            <AlertDialogContent className="bg-gradient-to-br from-slate-800/80 to-purple-900/80 backdrop-blur-xl border border-white/10 rounded-2xl">
              <AlertDialogHeader>
                <AlertDialogTitle className="text-white text-xl font-bold">
                  Are you sure?
                </AlertDialogTitle>
                <AlertDialogDescription className="text-gray-300">
                  This action cannot be undone. This will permanently delete
                  this message from our servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="cursor-pointer bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10 hover:text-white rounded-2xl transition-all duration-300">
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={handlerDeleteConfirm}
                  className="cursor-pointer group relative inline-flex items-center justify-center px-6 py-2 text-sm font-semibold text-white bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl hover:from-purple-500 hover:to-pink-500 transform hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/25 transition-all duration-300"
                >
                  <span className="relative z-10">Delete</span>
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 blur transition-all duration-300"></div>
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardAction>
        <CardTitle className="text-lg font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent leading-relaxed group-hover:text-white transition-colors duration-150">
          {message.content}
        </CardTitle>
        <CardDescription className="mt-2 text-gray-400 group-hover:text-gray-300">
          {formattedDate}
        </CardDescription>
      </CardHeader>
    </Card>
  );
}

export default MessageCard;
