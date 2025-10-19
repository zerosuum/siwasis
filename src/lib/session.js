import { cookies } from "next/headers";
export function isAdmin() {
  return !!cookies().get("siwasis_token")?.value;
}
