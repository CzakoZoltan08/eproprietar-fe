import { cookies } from "next/headers";

export async function getUserFromToken() {
  const token = (await cookies()).get("token")?.value;

  if (!token) return null;

  try {
    const payload = JSON.parse(atob(token.split(".")[1])); // Decode JWT payload
    return payload; // Return user payload (including role)
  } catch (error) {
    return null;
  }
}