import { NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import Knowledge from "@/models/Knowledge";

export async function POST(req) {

  try {

    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();

    await connectDB();

    const user = await User.findOne({
      email: session.user.email
    });

    const knowledge = await Knowledge.create({
      ...body,
      userId: user._id
    });

    return NextResponse.json({
      success: true,
      knowledge
    });

  } catch (error) {

    return NextResponse.json(
      {
        success: false,
        error: error.message
      },
      { status: 500 }
    );

  }
}