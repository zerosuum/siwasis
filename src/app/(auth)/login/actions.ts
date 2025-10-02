"use server";

import { cookies } from "next/headers";
import { apiFetch } from "@/lib/api";

export async function doLogin(formData: FormData) {
 const email = String(formData.get("email"));
 const password = String(formData.get("password"));
 const { token } = await apiFetch("/login", {
 method: "POST",
 body: { email, password },
 });

 cookies().set("siwasis_token", token, {
 httpOnly: true,
 sameSite: "lax",
 path: "/",
 });
 return { ok: true };
}
