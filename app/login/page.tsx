"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowRight, Loader2, CheckCircle2 } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const registered = searchParams.get("registered");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (res?.error) {
        setError("Invalid email or password");
      } else {
        router.push("/");
        router.refresh();
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white rounded-4xl shadow-2xl p-10 relative overflow-hidden group border border-brand-maroon/5 text-center"
      >
        {registered && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-6 p-4 bg-green-50 border border-green-200 rounded-2xl flex items-center space-x-3 text-green-700 font-medium"
          >
            <CheckCircle2 className="h-5 w-5 text-green-500" />
            <span>Registration successful! Please sign in.</span>
          </motion.div>
        )}

        <div className="bg-white rounded-[2rem] shadow-2xl overflow-hidden border border-brand-maroon/5">
          <div className="bg-brand-maroon p-8 text-center">
            <h2 className="text-3xl font-cookie text-brand-beige mb-2">Welcome Back</h2>
            <p className="text-brand-pink/70 text-sm">Sign in to your Cupid Crochy account</p>
          </div>

          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-brand-maroon mb-2">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-brand-maroon/10 focus:border-brand-maroon outline-none transition-all"
                  placeholder="name@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-brand-maroon mb-2">Password</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-brand-maroon/10 focus:border-brand-maroon outline-none transition-all"
                  placeholder="••••••••"
                />
              </div>

              {error && (
                <p className="text-red-500 text-sm font-medium bg-red-50 p-3 rounded-lg border border-red-100 italic">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-brand-maroon hover:bg-brand-maroon/90 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-brand-maroon/20 transition-all flex items-center justify-center group"
              >
                {isLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <>
                    Sign In
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-8 pt-6 border-t border-gray-100 text-center">
              <p className="text-brand-maroon/60 font-medium">
              Don&apos;t have an account?{" "}
              <Link href="/register" className="text-brand-maroon font-bold hover:underline">
                Create one
              </Link>
            </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
