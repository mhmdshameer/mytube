import { SidebarTrigger } from "@/components/ui/sidebar";
import Image from "next/image";
import Link from "next/link";
import { AuthButton } from "@/modules/auth/ui/components/auth-button";
import { SearchInput } from "@/modules/home/ui/components/home-navbar/search-input";

const Protected = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 h-16 bg-white flex items-center px-2 pr-5 z-50">
      {/* Menu and Logo */}
      <div className="flex items-center gap-4 w-full">
        <div className="flex items-center flex-shrink-0 gap-2">
          <SidebarTrigger />
          <Link href="/">
            <div className="flex items-center gap-1 cursor-pointer">
              <Image src="/logo.svg" alt="logo" width={32} height={32} />
              <p className="text-xl font-semibold tracking-tight">MyTube</p>
            </div>
          </Link>
        </div>
        {/* Search Bar */}
        <div className="flex-1 flex justify-center max-w-[720px] mx-auto">
          <SearchInput />
        </div>

        {/* Auth Button */}
        <div className="flex-shrink-0 items-center flex gap-4">
            <AuthButton/>
        </div>
      </div>
    </nav>
  );
};

export default Protected;
