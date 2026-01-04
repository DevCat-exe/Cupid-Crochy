import { ReactNode } from "react";
import Header from "./Header";
import Footer from "./Footer";

interface LayoutProps {
  children: ReactNode;
  transparentHeader?: boolean;
}

export default function Layout({
  children,
  transparentHeader = false,
}: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-[#F5DDEB]/30">
      <Header transparent={transparentHeader} />
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  );
}
