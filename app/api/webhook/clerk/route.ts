import { WebhookEvent } from "@clerk/nextjs/server";
import { headers } from "next/headers";
import { Webhook } from "svix";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

// Initialize rate limiter if Redis is configured
let ratelimit: Ratelimit | null = null;
if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
  const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
  });
  ratelimit = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(10, "1 m"), // 10 requests per minute
    analytics: true,
  });
}

export async function POST(req: Request) {
  // Apply rate limiting if configured
  if (ratelimit) {
    const headerPayload = await headers();
    const ip = headerPayload.get("x-forwarded-for") ?? "anonymous";
    const { success, limit, reset, remaining } = await ratelimit.limit(ip);

    if (!success) {
      return new Response("Too many requests", {
        status: 429,
        headers: {
          "X-RateLimit-Limit": limit.toString(),
          "X-RateLimit-Remaining": remaining.toString(),
          "X-RateLimit-Reset": new Date(reset).toISOString(),
        },
      });
    }
  }

  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Error occurred -- no svix headers", { status: 400 });
  }

  const payload = await req.json();
  const body = JSON.stringify(payload);

  const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET!);
  let evt: WebhookEvent;

  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new Response("Error occurred", { status: 400 });
  }

  const eventType = evt.type;

  if (eventType === "user.created" || eventType === "user.updated") {
    try {
      const { id, email_addresses, first_name, last_name, image_url } = evt.data;

      // Add null check for email_addresses
      if (!email_addresses || email_addresses.length === 0) {
        console.error("User has no email addresses:", id);
        return new Response("User has no email addresses", { status: 400 });
      }

      const email = email_addresses[0]?.email_address;
      if (!email) {
        console.error("Primary email is missing:", id);
        return new Response("Primary email is missing", { status: 400 });
      }

      const name = `${first_name || ""} ${last_name || ""}`.trim() || undefined;

      await convex.mutation(api.users.syncUser, {
        clerkUserId: id,
        email,
        name,
        imageUrl: image_url,
      });
    } catch (error) {
      console.error("Failed to sync user:", error);
      // Return 200 to prevent Clerk from retrying indefinitely
      return new Response("User sync failed", { status: 200 });
    }
  }

  if (eventType === "user.deleted") {
    try {
      const { id } = evt.data;
      if (!id) {
        console.error("User ID is missing in deletion event");
        return new Response("User ID is missing", { status: 400 });
      }
      await convex.mutation(api.users.deleteUser, {
        clerkUserId: id,
      });
    } catch (error) {
      console.error("Failed to delete user:", error);
      // Return 200 to prevent Clerk from retrying indefinitely
      return new Response("User deletion failed", { status: 200 });
    }
  }

  return new Response("", { status: 200 });
}
