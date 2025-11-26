import { NextResponse } from "next/server";
import { generateCsrfToken } from "@/lib/csrf";

export async function GET() {
  const token = await generateCsrfToken();

  return NextResponse.json(
    { csrfToken: token },
    {
      headers: {
        "x-csrf-token": token,
        "Set-Cookie": `ssync_csrf=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${60 * 60 * 24 * 7}`
      }
    }
  );
}
