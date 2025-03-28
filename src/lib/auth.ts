import NextAuth, {NextAuthOptions} from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import {findUserByProviderAccountId, insertUser} from '@/features/users/db/users';
import {UserRole} from "@/drizzle/schema/user";

export const authOptions: NextAuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
    ],
    secret: process.env.NEXTAUTH_SECRET,
    callbacks: {
        async signIn({user, account, profile}) {
            if (account?.provider === 'google' && profile) {
                const existingUser = await findUserByProviderAccountId(
                    account.providerAccountId,
                    account.provider
                );

                if (!existingUser) {
                    const newUser = await insertUser({
                        providerAccountId: account.providerAccountId,
                        provider: account.provider,
                        name: profile.name as string,
                        email: profile.email as string,
                        imageUrl: 'picture' in profile ? (profile.picture as string) : '',
                    });

                    if (newUser) {
                        user.id = newUser.id;
                        return true;
                    } else {
                        console.error('Failed to create new user from Google sign-in');
                        return false;
                    }
                } else {
                    user.id = existingUser.id;
                    user.role = existingUser.role as UserRole;
                }
                return true;
            }
            return true;
        },
        async session({session, token}) {
            if (session?.user && token.sub) {
                session.user.id = token.sub;
            }
            if (token?.role) {
                session.user.role = token.role as UserRole;
            }
            return session;
        },
        async jwt({token, user}) {
            if (user?.id) {
                token.sub = user.id;
            }
            if (user?.role) {
                token.role = user.role as UserRole;
            }
            return token;
        },
        async redirect({url, baseUrl}) {
            // Allows relative callback URLs
            if (url.startsWith("/")) return `${baseUrl}${url}`;
            // Allows callback URLs on the same origin
            else if (new URL(url).origin === baseUrl) return url;

            // Redirect to a specific default page if the callback URL is not safe
            return '/'; // Your default route
        },
    },
};

const handler = NextAuth(authOptions);

export const handlers = {GET: handler, POST: handler};