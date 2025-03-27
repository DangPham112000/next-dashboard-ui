import { auth } from "@clerk/nextjs/server";

export const getUserRole: () => Promise<string> = async () => {
  const { sessionClaims } = await auth();
  return (sessionClaims?.metadata as { role: string })?.role;
};

export const getUserId: () => Promise<string> = async () => {
  const { userId } = await auth();
  return userId!
}