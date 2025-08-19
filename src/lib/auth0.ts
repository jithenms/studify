import { db } from "@/db/drizzle";
import { users } from "@/db/schema";
import {
  Auth0Client,
  filterDefaultIdTokenClaims,
} from "@auth0/nextjs-auth0/server";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

async function getOrCreateUser(email: string, auth_id: string) {
  const existingUser = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  if (existingUser.length > 0) {
    return existingUser[0];
  }

  const [newUser] = await db
    .insert(users)
    .values({ email, auth_id })
    .returning();

  return newUser;
}

export const auth0 = new Auth0Client({
  async onCallback(error, _, session) {
    if (error) {
      return NextResponse.redirect(
        new URL(`/error?error=${error.message}`, process.env.APP_BASE_URL)
      );
    }

    if (!session) {
      return NextResponse.redirect(
        new URL("/auth/login", process.env.APP_BASE_URL)
      );
    }

    return NextResponse.redirect(new URL("/chat", process.env.APP_BASE_URL));
  },
  async beforeSessionSaved(session) {
    // todo gracefully handle undefined email
    const user = await getOrCreateUser(session.user.email!, session.user.sub);
    return {
      ...session,
      user: {
        ...filterDefaultIdTokenClaims(session.user),
        user_id: user.id,
      },
    };
  },
});
