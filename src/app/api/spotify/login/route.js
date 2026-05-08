// TODO M4: PKCE flow start. Generate code_verifier, set httpOnly cookie,
// redirect to https://accounts.spotify.com/authorize with code_challenge.
import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ todo: "M4: implement Spotify PKCE start" });
}
