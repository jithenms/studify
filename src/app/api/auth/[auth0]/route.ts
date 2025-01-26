import { db } from "@/db/drizzle";
import { users } from "@/db/schema";
import {
  handleAuth,
  handleCallback,
  handleLogin,
  Session,
} from "@auth0/nextjs-auth0";
import { eq } from "drizzle-orm";
import { NextApiRequest, NextApiResponse } from "next";
import { NextRequest } from "next/server";

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

const afterCallback = async (req: NextRequest, session: Session) => {
  const user = await getOrCreateUser(session.user.email, session.user.sub);
  session.user.user_id = user.id;
  return {
    ...session,
    redirect: "/chat",
  };
};

export const GET = handleAuth({
  callback: handleCallback({ afterCallback }),
  async login(req: NextApiRequest, res: NextApiResponse) {
    return await handleLogin(req, res, {
      returnTo: "/chat",
    });
  },
});
