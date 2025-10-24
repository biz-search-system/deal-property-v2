import { Button } from "@/components/ui/button";
import Logo from "@/components/logo";
import MainNav from "@/components/main-nav";
import MobileNav from "@/components/mobile-nav";
import Link from "next/link";

export default function Header() {
  return (
    <header className="border-b sticky top-0 bg-background z-20">
      <div className="container h-16 mx-auto flex items-center gap-2">
        <MobileNav />
        <Link href="/" className="block">
          <Logo className="h-5" />
        </Link>
        <MainNav />
        <span className="flex-1"></span>
        <Button asChild variant="outline">
          <Link href="/login">ログイン</Link>
        </Button>
      </div>
    </header>
  );
}
