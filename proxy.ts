import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll(); },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();
  const { pathname } = request.nextUrl;

  const isAuthPage = pathname.startsWith("/login") || pathname.startsWith("/register");
  const isProtected = pathname.startsWith("/dashboard") || pathname.startsWith("/mes-demandes") || pathname.startsWith("/nouvelle-demande");
  const isAdmin = pathname.startsWith("/nca");

  if ((isProtected || isAdmin) && !user) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (isAdmin && user) {
    if (user.user_metadata?.role !== "admin") {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  if (isAuthPage && user) {
    const dest = user.user_metadata?.role === "admin" ? "/nca" : "/dashboard";
    return NextResponse.redirect(new URL(dest, request.url));
  }

  return supabaseResponse;
}

export const config = {
  matcher: ["/dashboard/:path*", "/nca/:path*", "/mes-demandes/:path*", "/nouvelle-demande/:path*", "/login", "/register"],
};
