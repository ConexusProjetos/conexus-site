import { cookies } from "next/headers";
import { AUTH_COOKIE_NAME, AUTH_COOKIE_OPTIONS, verifyToken } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { token } = body as { token?: string };

    if (!token) {
      return Response.json({ error: "Token ausente" }, { status: 400 });
    }

    // Verify the token is valid before storing it
    await verifyToken(token);

    const cookieStore = await cookies();
    cookieStore.set(AUTH_COOKIE_NAME, token, AUTH_COOKIE_OPTIONS);

    return Response.json({ ok: true });
  } catch {
    return Response.json(
      { error: "Token inválido ou expirado" },
      { status: 401 }
    );
  }
}
