import { StreamClient } from "@stream-io/node-sdk";
import { NextRequest, NextResponse } from "next/server";

const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY;
const apiSecret = process.env.STREAM_SECRET_KEY;

export async function POST(request: NextRequest) {
  try {
    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    if (!apiKey) {
      return NextResponse.json({ error: 'No API Key' }, { status: 500 });
    }

    if (!apiSecret) {
      return NextResponse.json({ error: 'No API Secret' }, { status: 500 });
    }

    const client = new StreamClient(apiKey, apiSecret);

    const exp = Math.round(new Date().getTime() / 1000) + 60 * 60; // 1 hour expiration
    const issued = Math.floor(Date.now() / 1000) - 60; // 1 minute ago

    const token = client.createToken(userId, exp, issued);

    return NextResponse.json({ token });
  } catch (error) {
    console.error('Error generating token:', error);
    return NextResponse.json({ error: 'Failed to generate token' }, { status: 500 });
  }
}