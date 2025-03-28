import {getServerSession} from "next-auth";
import {authOptions} from "@/lib/auth";
import {UserRole} from "@/drizzle/schema/user";

type User = {
    id: string;
    name: string;
    email: string;
    image?: string;
};

export async function getCurrentUser() {
    const session = await getServerSession(authOptions);

    if (!session?.user) return {userId: undefined, role: undefined, user: null, session: null};

    return {
        userId: session.user.id,
        role: session.user.role as UserRole,
        user: session.user as User,
        session: session,
    }
}

