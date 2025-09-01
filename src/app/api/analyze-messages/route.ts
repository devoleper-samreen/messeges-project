import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/user";
import mongoose from "mongoose";
import { User } from "next-auth";
import { Message } from "@/model/user";
import { log } from "console";

export async function GET() {
  await dbConnect();
  try {
    const session = await getServerSession(authOptions);
    const user = session?.user as User;

    if (!session || !session.user) {
      return Response.json(
        {
          success: false,
          message: "User Not Authenticated",
        },
        { status: 401 }
      );
    }

    const userId = new mongoose.Types.ObjectId(user._id);

    const messages = await UserModel.aggregate([
      { $match: { _id: userId } },
      { $unwind: "$messages" },
      { $sort: { "messages.createdAt": -1 } },
      {
        $group: {
          _id: "$_id",
          messages: { $push: "$messages" },
        },
      },
    ]);

    console.log("Messages fetched:", messages);

    const transformedMessages = messages[0].messages.map(
      (msg: Message) => msg.content
    );
    console.log("Transformed Messages:", transformedMessages);

    // Send to n8n webhook
    const n8nRes = await fetch(
      "https://maliksamreen721.app.n8n.cloud/webhook/analyze-feedback",
      {
        method: "POST",
        body: JSON.stringify({ messages: transformedMessages }),
      }
    );

    const aiResult = await n8nRes.json();
    console.log("AI Result from api:", aiResult);

    return Response.json(
      {
        success: true,
        aiResult,
      },
      { status: 200 }
    );
  } catch (error) {
    return Response.json(
      {
        success: false,
        message: "Internal Error",
      },
      { status: 500 }
    );
  }
}
