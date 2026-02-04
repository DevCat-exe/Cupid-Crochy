import Link from "next/link";
import { Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-brand-beige/20 flex items-center justify-center px-4">
        <div className="text-center max-w-2xl">
          <h1 className="text-[12rem] font-bold text-brand-maroon/20 leading-none">404</h1>

        <div className="space-y-6">
           <h2 className="text-4xl font-bold text-brand-maroon">
             Oops! Page Not Found
           </h2>
           <p className="text-lg text-brand-maroon/80">
             The treasure you&apos;re looking for doesn&apos;t exist or has been moved.
           </p>
        </div>

        <div className="mt-12">
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-brand-maroon text-white font-bold px-8 py-4 rounded-2xl shadow-xl hover:shadow-brand-maroon/20 hover:bg-brand-maroon/90 transition-all"
          >
            <Home className="h-5 w-5" />
            <span>Back Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
