import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";

const UpvoteSchema = z.object({
  streamId: z.string(),
});

export async function POST(req: NextRequest) {
  const session = await auth();
  const email =
    typeof session?.user?.email === "string" ? session.user.email : "";

  const user = await prisma.user.findFirst({
    where: { email },
  });

  if (!user) {
    return NextResponse.json(
      {
        message: "UnAuthorize",
      },
      {
        status: 403,
      },
    );
  }

  try {
    const data = UpvoteSchema.parse(await req.json());

    await prisma.upvote.create({
      data: {
        userId: user.id,
        streamId: data.streamId,
      },
    });

    
  } catch (e) {
    return NextResponse.json(
      {
        message: "Error while upvoting",
        e,
      },
      {
        status: 411,
      },
    );
  }
}


