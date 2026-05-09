import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { checkRateLimit, resetRateLimit } from "@/lib/rate-limit";

export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "127.0.0.1";

  const { allowed, resetIn } = checkRateLimit(ip);
  if (!allowed) {
    return Response.json(
      { error: `Trop de tentatives de connexion. Réessayez dans ${resetIn} minute${resetIn > 1 ? "s" : ""}.`, retryAfter: resetIn },
      { status: 429 }
    );
  }

  const { email, password } = await request.json();
  const cookieStore = await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (cookiesToSet) => {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
        },
      },
    }
  );

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error || !data.session) {
    return Response.json({ error: error?.message ?? "Erreur de connexion" }, { status: 401 });
  }

  resetRateLimit(ip);
  return Response.json({ role: data.session.user.user_metadata?.role ?? "citoyen" });
}
