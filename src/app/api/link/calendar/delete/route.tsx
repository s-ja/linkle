import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";
import { Collection } from "mongodb";

import { User } from "@/types/user";

import clientPromise from "../../../../../lib/mongodb";

interface JwtPayload {
  userId: string;
}
interface UserDocument {
  userId: string;
  data: Array<{ id: string }>;
  calendar: { id: string }[];
}

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json(
        { message: "Cookie not found" },
        { status: 401 },
      );
    }
    const { id } = await request.json();
    const client = await clientPromise;
    const db = client.db("linkle");
    const collection: Collection<UserDocument> = db.collection("userdata");
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string,
    ) as JwtPayload;
    const userId = decoded.userId;

    const result = await collection.updateOne(
      { userId },
      { $pull: { calendar: { id: id } } },
    );
    if (result.modifiedCount === 0) {
      return NextResponse.json(
        { message: "Failed to delete schedule" },
        { status: 500 },
      );
    }
    return NextResponse.json(
      { message: "Schedule deleted successfully" },
      { status: 200 },
    );
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { message: "Failed to create data", error: errorMessage },
      { status: 500 },
    );
  }
}