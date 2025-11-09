import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/user";
import mongoose from "mongoose";
import { User } from "next-auth";
import { Message } from "@/model/user";
import { google } from "@ai-sdk/google";
import { generateText } from "ai";

export const maxDuration = 30;

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

    // Handle case when no messages exist
    if (!messages || messages.length === 0 || !messages[0]?.messages) {
      return Response.json(
        {
          success: true,
          aiResult: { clusters: [] },
        },
        { status: 200 }
      );
    }

    const transformedMessages = messages[0].messages.map(
      (msg: Message) => msg.content
    );

    console.log("Analyzing messages:", transformedMessages.length);

    // Use Gemini AI to analyze and cluster messages
    const prompt = `
You are an AI assistant that analyzes anonymous messages and groups them into meaningful themes/clusters.

Given the following list of anonymous messages, analyze them and group them into 3-5 clusters based on their themes, topics, or sentiment.

Messages:
${transformedMessages.map((msg: string, i: number) => `${i + 1}. ${msg}`).join("\n")}

Please respond with a JSON object in this exact format:
{
  "clusters": [
    {
      "title": "Theme name (e.g., 'Compliments & Appreciation')",
      "messages": ["message 1", "message 2"]
    }
  ]
}

Rules:
- Create 3-5 meaningful clusters
- Each cluster should have a clear, descriptive title
- Group similar messages together
- Include all messages in at least one cluster
- Return ONLY valid JSON, no extra text`;

    const result = await generateText({
      model: google("gemini-2.5-flash"),
      prompt,
    });

    console.log("AI Raw Response:", result.text);

    // Parse AI response
    let aiResult;
    try {
      // Extract JSON from response (in case AI adds extra text)
      const jsonMatch = result.text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        aiResult = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("No JSON found in response");
      }
    } catch (parseError) {
      console.error("Failed to parse AI response:", parseError);
      // Fallback: create simple clusters
      aiResult = {
        clusters: [
          {
            title: "All Messages",
            messages: transformedMessages,
          },
        ],
      };
    }

    console.log("AI Result:", aiResult);

    return Response.json(
      {
        success: true,
        aiResult,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error analyzing messages:", error);
    return Response.json(
      {
        success: false,
        message: "Failed to analyze messages",
      },
      { status: 500 }
    );
  }
}
