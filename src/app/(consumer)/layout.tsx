import {Button} from "@/components/ui/button"
import {canAccessAdminPages} from "@/permissions/general"
import {getCurrentUser} from "@/services/auth"
import {SignInButton} from "@/components/SignInButton";
import {UserButton} from "@/components/UserButton";
import Link from "next/link"
import {ReactNode} from "react"
import {Session} from "next-auth";

export default async function ConsumerLayout({
                                                 children,
                                             }: Readonly<{ children: ReactNode }>) {
    const {session} = await getCurrentUser()
    return (
        <>
            <Navbar session={session}/>
            {children}
        </>
    )
}

interface NavbarProps {
    session: Session | null;
}

function Navbar({session}: NavbarProps) {
    return (
        <header className="flex h-12 shadow bg-background z-10">
            <nav className="flex gap-4 container">
                <Link
                    className="mr-auto text-lg hover:underline flex items-center"
                    href="/"
                >
                    Web Dev Simplified
                </Link>
                {session?.user ? (
                    <>
                        <AdminLink/>
                        <Link
                            className="hover:bg-accent/10 flex items-center px-2"
                            href="/courses"
                        >
                            My Courses
                        </Link>
                        <Link
                            className="hover:bg-accent/10 flex items-center px-2"
                            href="/purchases"
                        >
                            Purchase History
                        </Link>
                        <div className="size-8 self-center">
                            <UserButton
                                session={session}
                            />
                        </div>
                    </>
                ) : (
                    <Button className="self-center" asChild>
                        <SignInButton/>
                    </Button>
                )}
            </nav>
        </header>
    )
}

async function AdminLink() {
    const {role} = await getCurrentUser()
    if (!canAccessAdminPages(role)) return null

    return (
        <Link className="hover:bg-accent/10 flex items-center px-2" href="/admin">
            Admin
        </Link>
    )
}
