'use client'
import { createClient } from '@/supabase/client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function Header({ font }: { font?: string }) {
    const router = useRouter();
    const [authenticatedUser, setAuthenticatedUser] = useState(false);
    useEffect(() => {
        async function getSession() {
            const supabase = createClient();
            try {
                const { data: user, error } = await supabase.auth.getSession();
                if (user && user.session != null) {
                    setAuthenticatedUser(true);
                } else {
                    setAuthenticatedUser(false);
                }
            } catch (error) {
                console.error('Error checking authentication:', error);
            }
        }

        getSession();
    }, []);
    const handleSignOut = async () => {
        const supabase = createClient();
        const { error } = await supabase.auth.signOut()
        setAuthenticatedUser(false)
        router.push('/')
        console.log("loggedout")
    }

    const handleUpload = async () => {
        const supabase = createClient();
        try {
            const { data: user, error } = await supabase.auth.getSession();
            if (user.session != null) {
                console.log(user)
                router.push('/products/upload'); // Navigate to the upload page
            } else {
                console.log('User is not authenticated');
                router.push('/auth/signup'); // Navigate to the sign-up page
            }
        } catch (error) {
            console.error('Error checking authentication:', error);
        }
    };

    const handleSignIn = () => {
        router.push('/auth/signin');
    };
    return (
        <header className="py-2 bg-gray-952">
            <div className="max-w-[100rem] px-12 mx-auto flex justify-between">
                <Link href="/">
                    <h1 className={` text-yellow-500 text-center py-2 ${font}`}>
                        SwapShop
                    </h1>
                </Link>
                <label
                    onClick={handleUpload}
                    className="uppercase text-green-951 text-xl py-2 hover:text-yellow-700 cursor-pointer"
                >
                    Sell
                </label>
                {authenticatedUser ? (
                    <button onClick={handleSignOut} className="uppercase text-red-600 text-lg py-2 hover:text-red-700 cursor-pointer">
                        Logout
                    </button>
                ) : (
                    <button onClick={handleSignIn} className="uppercase text-green-951 text-lg py-2 hover:text-yellow-700 cursor-pointer">
                        Login
                    </button>
                )}
            </div>
        </header>
    );
}
