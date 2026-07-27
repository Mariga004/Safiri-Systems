import { auth, clerkClient } from "@clerk/nextjs/server";

export async function getUserRole(): Promise<string> {
  const { userId } = await auth();
  if (!userId) return "viewer";

  const client = await clerkClient();
  const user = await client.users.getUser(userId);
  const role = user.publicMetadata?.role as string;

  return role === "admin" ? "admin" : "viewer";
}

export async function requireAdmin() {
  const role = await getUserRole();
  if (role !== "admin") {
    throw new Error("FORBIDDEN");
  }
}