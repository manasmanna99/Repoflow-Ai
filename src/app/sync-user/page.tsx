import { auth } from "@clerk/nextjs/server";
import { clerkClient } from "@clerk/clerk-sdk-node";
import { redirect } from "next/navigation";
import { db } from "~/server/db";

export default async function SyncUser() {
  const { userId } = await auth();
  
  if (!userId) {
    return redirect("/sign-in");
  }

  // Get user data from Clerk
  const user = await clerkClient.users.getUser(userId);
  const primaryEmail = user.emailAddresses[0]?.emailAddress;

  if (!primaryEmail) {
    return redirect("/sign-in");
  }

  // Create or update user in database with Clerk data
  await db.user.upsert({
    where: { id: userId },
    create: {
      id: userId,
      emailAddress: primaryEmail,
      firstName: user.firstName ?? "",
      lastName: user.lastName ?? "",
      imageUrl: user.imageUrl,
    },
    update: {
      emailAddress: primaryEmail,
      firstName: user.firstName ?? "",
      lastName: user.lastName ?? "",
      imageUrl: user.imageUrl,
    },
  });

  // Redirect to dashboard after sync
  return redirect("/dashboard");
}
