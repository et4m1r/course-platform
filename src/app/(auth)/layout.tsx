'use client';

import {useSession} from "next-auth/react"
import {useEffect, useState} from 'react';
import {useRouter} from 'next/navigation';

export default function AuthLayout({children,}: { children: React.ReactNode }) {
    const {status} = useSession()
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (status === 'authenticated') {
            router.push('/courses');
        } else if (status === 'unauthenticated') {
            setIsLoading(false);
        } else if (status === 'loading') {
            setIsLoading(true);
        }
    }, [status, router]);

    if (isLoading) {
        return <div></div>;
    }

    return (
        <div className="">
            {children}
        </div>
    )
}
