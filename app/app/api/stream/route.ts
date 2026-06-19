import { NextRequest, NextResponse } from "next/server";

import prisma from "@/lib/prisma";
import youtubesearchapi from "youtube-search-api";
import { z } from "zod";

const YT_REGEX =
  /^(?:(?:https?:)?\/\/)?(?:www\.)?(?:m\.)?(?:youtu(?:be)?\.com\/(?:v\/|embed\/|watch(?:\/|\?v=))|youtu\.be\/)((?:\w|-){11})(?:\S+)?$/;

const CreateStreamSchema = z.object({
  creatorId: z.string(),
  url: z.string(),
});

export async function POST(req: NextRequest) {
  try {
    const data = CreateStreamSchema.parse(await req.json());
    const isYt = data.url.match(YT_REGEX);

    if (!isYt) {
      return NextResponse.json(
        {
          message: "Wrong URL fromate",
        },
        {
          status: 411,
        },
      );
    }
    const extractedId = data.url.split("?v=")[1];
    console.log("ex", extractedId);

    const res = await youtubesearchapi.GetVideoDetails(extractedId);

    const thumbnails = res.thumbnail.thumbnails;
    thumbnails.sort((a: { width: number }, b: { width: number }) =>
      a.width < b.width ? -1 : 1,
    );

    const stream = await prisma.stream.create({
      data: {
        userId: data.creatorId,
        url: data.url,
        extractedId,
        type: "Youtube",
        title: res.title ?? "",
        SmallImage:
          (thumbnails.length > 1
            ? thumbnails[thumbnails.length - 2].url
            : thumbnails[thumbnails.length - 1].url) ?? "",
        BigImage: thumbnails[thumbnails.length - 1].url ?? "",
      },
    });
    return NextResponse.json({
      message: "Added stream",
      id: stream.id,
    });
  } catch (e) {
    return NextResponse.json(
      {
        message: "Error while adding a stream",
        error: e instanceof Error ? e.message : String(e),
      },
      {
        status: 411,
      },
    );
  }
}
export async function GET(req: NextRequest) {
  const creatorId = req.nextUrl.searchParams.get("creatorId");

  if (!creatorId) {
    return NextResponse.json({ stream: [] }, { status: 200 });
  }

  const stream = await prisma.stream.findMany({
    where: {
      userId: creatorId,
    },
  });

  return NextResponse.json({ stream });
}
