'use client';

import {signOut} from 'next-auth/react';
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import {Session} from "next-auth";

interface UserButtonProps {
    session: Session | null;
}

export function UserButton({session}: UserButtonProps) {

    if (!session?.user) {
        return null;
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger className="cursor-pointer">
                <Avatar>
                    {session?.user?.image &&
                        <AvatarImage src={session.user.image} alt={session.user.name || "User Avatar"}/>}
                    <AvatarFallback>{session?.user?.name?.charAt(0)}</AvatarFallback>
                </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                    <Link href="/">Home</Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => signOut()}>
                    Sign Out
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}