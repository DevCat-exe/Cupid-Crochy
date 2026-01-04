import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../../../supabase/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useNavigate, useLocation } from "react-router-dom";
import { LogIn } from "lucide-react";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || "/admin";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Basic validation
    if (!email) {
      setError("Email is required");
      return;
    }

    if (!password) {
      setError("Password is required");
      return;
    }

    try {
      // Attempt to sign in with Supabase
      await signIn(email, password);

      // If successful, navigate to the admin dashboard
      navigate("/admin");
    } catch (error: any) {
      console.error("Login error:", error);
      setError(error.message || "Invalid email or password");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F5DDEB]/30 bg-gradient-to-br from-[#F5DDEB]/40 to-[#E8D7BC]/30">
      <div className="max-w-md w-full px-4">
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold text-[#5B1A1A]">Cupid Crochy</h1>
          <p className="text-[#5B1A1A]/70 mt-2">Admin Login</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="w-full border-[#5B1A1A]/10 shadow-lg transform transition-all duration-500 hover:shadow-xl">
            <CardHeader className="space-y-1 pb-4">
              <CardTitle className="text-2xl text-center flex items-center justify-center gap-2 text-[#5B1A1A]">
                <LogIn className="h-5 w-5" /> Sign in
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-[#5B1A1A]">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="border-[#5B1A1A]/20 focus:border-[#5B1A1A] rounded-xl"
                    autoComplete="email"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-[#5B1A1A]">
                    Password
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="border-[#5B1A1A]/20 focus:border-[#5B1A1A] rounded-xl"
                    autoComplete="current-password"
                    required
                  />
                </div>
                {error && <p className="text-sm text-red-500">{error}</p>}
                <Button
                  type="submit"
                  className="w-full bg-[#5B1A1A] hover:bg-[#5B1A1A]/90 text-[#E8D7BC] rounded-xl py-6 mt-2 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-md"
                >
                  Sign in
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
