import {Badge} from "@/components/ui/badge"
import Link from "next/link"
import {ReactNode} from "react"
import {UserButton} from "@/components/UserButton";
import '@mdxeditor/editor/style.css';
import {getCurrentUser} from "@/services/auth";
import {Session} from "next-auth";

export default async function AdminLayout({
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
                <div className="mr-auto flex items-center gap-2">
                    <Link className="text-lg hover:underline" href="/admin">
                        Web Dev Simplified
                    </Link>
                    <Badge>Admin</Badge>
                </div>
                <Link
                    className="hover:bg-accent/10 flex items-center px-2"
                    href="/admin/courses"
                >
                    Courses
                </Link>
                <Link
                    className="hover:bg-accent/10 flex items-center px-2"
                    href="/admin/products"
                >
                    Products
                </Link>
                <Link
                    className="hover:bg-accent/10 flex items-center px-2"
                    href="/admin/sales"
                >
                    Sales
                </Link>
                <div className="size-8 self-center">
                    <UserButton
                        session={session}
                    />
                </div>
            </nav>
        </header>
    )
}
