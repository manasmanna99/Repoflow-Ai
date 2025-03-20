import { NextResponse } from "next/server";
import { db } from "~/server/db";
import { clerkClient } from "@clerk/clerk-sdk-node";
import { auth } from "@clerk/nextjs/server";

export async function GET() {
  try {
    console.log("🔄 Starting sync-user API call");
    
    const authResult = await auth();
    console.log("🔑 Auth result:", { 
      userId: authResult.userId,
      sessionId: authResult.sessionId,
      timestamp: new Date().toISOString()
    });
    
    const userId = authResult.userId;
    if (!userId) {
      console.error("❌ No user ID found in auth");
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    console.log("🔄 Starting user sync for:", userId);

    // Get user data from Clerk
    console.log("📥 Fetching user data from Clerk...");
    const clerkUser = await clerkClient.users.getUser(userId);
    console.log("✅ Clerk user data:", {
      id: clerkUser.id,
      email: clerkUser.emailAddresses[0]?.emailAddress,
      firstName: clerkUser.firstName,
      lastName: clerkUser.lastName,
    });

    const userEmail = clerkUser.emailAddresses[0]?.emailAddress;
    if (!userEmail) {
      console.error("❌ No email found for user:", userId);
      return NextResponse.json(
        { error: "User email not found" },
        { status: 400 }
      );
    }

    // First, try to find the user in our database
    console.log("🔍 Checking if user exists in database...");
    const existingUser = await db.user.findUnique({
      where: { id: userId },
    });
    console.log("📊 Database check result:", {
      exists: !!existingUser,
      userId,
      timestamp: new Date().toISOString(),
    });

    let user;
    try {
      if (!existingUser) {
        // User doesn't exist in our database, create new user
        console.log("➕ Creating new user in database...");
        const userData = {
          id: userId,
          emailAddress: userEmail,
          firstName: clerkUser.firstName || "",
          lastName: clerkUser.lastName || "",
          credits: 50, // Default credits for new users
        };
        console.log("📝 User data to create:", userData);
        
        user = await db.user.create({
          data: userData,
        });
        console.log("✅ New user created successfully:", {
          userId,
          email: userEmail,
          credits: user.credits,
          timestamp: new Date().toISOString(),
        });
      } else {
        // User exists, update their information
        console.log("📝 Updating existing user...");
        const updateData = {
          emailAddress: userEmail,
          firstName: clerkUser.firstName || "",
          lastName: clerkUser.lastName || "",
        };
        console.log("📝 User data to update:", updateData);
        
        user = await db.user.update({
          where: { id: userId },
          data: updateData,
        });
        console.log("✅ Existing user updated successfully:", {
          userId,
          email: userEmail,
          credits: user.credits,
          timestamp: new Date().toISOString(),
        });
      }
    } catch (dbError) {
      console.error("❌ Database operation failed:", {
        error: dbError instanceof Error ? dbError.message : "Unknown error",
        stack: dbError instanceof Error ? dbError.stack : undefined,
        userId,
        timestamp: new Date().toISOString(),
      });
      throw dbError;
    }

    // Verify the user was created/updated
    console.log("🔍 Verifying user in database...");
    const verifiedUser = await db.user.findUnique({
      where: { id: userId },
    });
    console.log("✅ User verification:", {
      exists: !!verifiedUser,
      userId,
      email: verifiedUser?.emailAddress,
      credits: verifiedUser?.credits,
      timestamp: new Date().toISOString(),
    });

    if (!verifiedUser) {
      console.error("❌ User verification failed - user not found after create/update");
      return NextResponse.json(
        { error: "Failed to verify user creation" },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      success: true,
      user: {
        id: user.id,
        email: user.emailAddress,
        credits: user.credits,
      }
    });
  } catch (error) {
    console.error("❌ Error syncing user:", {
      error: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json(
      { error: "Failed to sync user" },
      { status: 500 }
    );
  }
} 