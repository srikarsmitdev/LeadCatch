"use server";
import { cookies } from "next/headers";

export async function setAuthCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set("admin_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 60 * 24 // 1 day
  });
}

export async function removeAuthCookie() {
  const cookieStore = await cookies();
  cookieStore.delete("admin_token");
}
