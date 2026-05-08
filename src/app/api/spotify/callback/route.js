// TODO M4: exchange ?code= for tokens, persist to spotify_accounts (vault),
// then redirect back to /app/log.
import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ todo: "M4: implement Spotify PKCE callback" });
}
