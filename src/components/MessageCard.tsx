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
  console.log(message);

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
    <Card>
      <CardHeader>
        <CardTitle>{message.content}</CardTitle>
        <CardDescription className="mt-2">{formattedDate}</CardDescription>
        <CardAction>
          <AlertDialog>
            <AlertDialogTrigger>
              <XIcon className="w-4 h-4" />
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete
                  your account and remove your data from our servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handlerDeleteConfirm}>
                  Continue
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardAction>
      </CardHeader>
    </Card>
  );
}

export default MessageCard;
