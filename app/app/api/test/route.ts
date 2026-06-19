// app/api/test/route.ts

import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const users = await prisma.user.findMany();
    const stream = await prisma.stream.findMany()

    return Response.json({
      success: true,
      users:users,
      stream:stream
    });
  } catch (error) {
    console.error(error);

    return Response.json({
      success: false,
      error: String(error),
    });
  }
}
