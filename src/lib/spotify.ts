// TODO M4: PKCE helpers + getSpotifyClient(userId) that auto-refreshes
// expiring access tokens against spotify_accounts.
//
// Server-only. Never import from 'use client'.

export type SpotifyTrackPlay = {
  trackId: string;
  name: string;
  artist: string;
  playedAt: string;
};

export async function fetchRecentlyPlayed(
  _userId: string,
  _beforeIso: string,
): Promise<SpotifyTrackPlay[]> {
  throw new Error("M4: not implemented");
}
