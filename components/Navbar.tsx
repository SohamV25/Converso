import Link from "next/link";
import Logo from "@/components/Logo";
import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import NavItems from "@/components/NavItems";

const Navbar = () => {
    return (
        <header className="sticky top-0 z-50 border-b border-border/70 bg-ink/75 backdrop-blur-xl">
            <nav className="relative mx-auto flex h-16 max-w-[1320px] items-center justify-between gap-4 px-6 md:px-10">
                <Link href="/" className="flex items-center gap-2.5" aria-label="Converso home">
                    <Logo />
                    <span className="font-display text-xl font-semibold tracking-tight">Converso</span>
                </Link>

                <div className="flex items-center gap-3">
                    <NavItems />
                    {/* Signed out: show a sign in button */}
                    <SignedOut>
                        <SignInButton>
                            <button className="btn-signin">Sign in</button>
                        </SignInButton>
                    </SignedOut>
                    {/* Signed in: show the account menu (includes sign out) */}
                    <SignedIn>
                        <UserButton appearance={{ elements: { avatarBox: "size-9 ring-2 ring-border" } }} />
                    </SignedIn>
                </div>
            </nav>
        </header>
    )
}

export default Navbar
