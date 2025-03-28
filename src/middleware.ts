import {withAuth} from 'next-auth/middleware';
import {NextResponse} from 'next/server';
import {getToken} from 'next-auth/jwt';

const publicRoutes = [
    '/',
    '/sign-in',
    '/sign-up',
    '/api(.*)', // Match all /api routes
    '/courses/[courseId]/lessons/[lessonId]',
    '/products(.*)',
    "/courses",
];

const adminRoutes = ['/admin(.*)'];

export default withAuth(
    async function middleware(req) {
        const pathname = req.nextUrl.pathname;
        const isPublic = publicRoutes.some((route) =>
            pathname.match(new RegExp(`^${route}$`))
        );
        const isAdmin = adminRoutes.some((route) =>
            pathname.match(new RegExp(`^${route}$`))
        );

        const token = await getToken({req});
        if (!isPublic) {
            if (!token) {
                // Redirect to sign-in if not authenticated and not on a public route
                const signInUrl = new URL('/sign-in', req.nextUrl);
                signInUrl.searchParams.set('callbackUrl', pathname);
                return NextResponse.redirect(signInUrl);
            }
        }

        if (isAdmin) {
            // Assuming you've added a 'role' property to your NextAuth session
            if (token?.role !== 'admin') {
                return new NextResponse(null, {status: 404});
            }
        }

        return NextResponse.next();
    },
    {
        pages: {
            signIn: '/sign-in', // Custom sign-in page
        },
    }
);

export const config = {
    matcher: [
        // Skip Next.js internals and all static files, unless found in search params
        "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
        // Always run for API routes
        "/(api|trpc)(.*)",
    ],
}
