import Menu from "@/components/Menu";
import Navbar from "@/components/Navbar";
import Image from "next/image";
import Link from "next/link";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="h-screen flex">
      {/* Left */}
      <div className="xl:w-[14%] lg:w-[16%] md:w-[18%] w-[14%] p-4 overflow-y-scroll">
        <Link
          href="/"
          className="flex items-center justify-center lg:justify-start gap-2"
        >
          <Image src="/logo.png" alt="logo" width={32} height={32} />
          <span className="lg:block hidden">CSM Tool</span>
        </Link>
        <Menu />
      </div>
      {/* Right */}
      <div className="bg-[#F7F8FA] xl:w-[86%] lg:w-[84%] md:w-[92%] w-[86%] overflow-y-scroll">
        <Navbar />
        {children}
      </div>
    </div>
  );
}
