import "next-auth"
import {UserRole} from "@/drizzle/schema/user";

declare module "next-auth" {
    interface User {
        id?: string
        role?: UserRole
    }

    interface Session {
        user: {
            id?: string
            role?: UserRole
            name?: string
            email?: string
            image?: string
        }
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        id?: string
        role?: UserRole
    }
}

