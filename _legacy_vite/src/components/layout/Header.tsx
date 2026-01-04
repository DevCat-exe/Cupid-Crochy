import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Menu, X, User } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "../../../supabase/auth";
import { useCart } from "../cart/CartProvider";

interface HeaderProps {
  transparent?: boolean;
}

export default function Header({ transparent = false }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, signOut } = useAuth();
  const cart = useCart();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const headerBg = "bg-[#5B1A1A]";
  const headerClasses = `fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? "py-2 shadow-md" : "py-4"} ${headerBg}`;

  const navItems = [
    { label: "Home", path: "/" },
    { label: "Shop", path: "/shop" },
    { label: "Contact", path: "/contact" },
  ];

  return (
    <header className={headerClasses}>
      <div className="container mx-auto px-4 flex items-center justify-between">
        <Link to="/" className="flex items-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="text-2xl font-bold text-[#E8D7BC]"
          >
            Cupid Crochy
          </motion.div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className="relative font-medium text-[#E8D7BC] hover:text-white transition-colors group"
            >
              {item.label}
              <span className="absolute inset-x-0 -bottom-1 h-0.5 bg-white transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
            </Link>
          ))}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center space-x-4">
          <Button
            variant="outline"
            size="icon"
            className="relative rounded-full border-2 border-[#F5DDEB] bg-[#F5DDEB] text-[#5B1A1A] hover:bg-[#F5DDEB]/80 hover:border-[#F5DDEB]/80 transition-colors overflow-visible"
            onClick={() => cart.openCart()}
          >
            <ShoppingBag className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 bg-[#5B1A1A] text-[#F5DDEB] text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
              {cart.getCartCount()}
            </span>
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <Button
          variant="outline"
          size="icon"
          className="md:hidden rounded-full border-2 border-[#F5DDEB] bg-[#F5DDEB] text-[#5B1A1A] hover:bg-[#F5DDEB]/80 hover:border-[#F5DDEB]/80 transition-colors"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </Button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-[#5B1A1A] border-t border-white/20"
          >
            <div className="container mx-auto px-4 py-4">
              <nav className="flex flex-col space-y-4">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className="font-medium text-[#E8D7BC] hover:text-white transition-colors py-2 px-3 rounded-lg hover:bg-white/10"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
                <div className="flex items-center space-x-4 pt-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="relative rounded-full border-2 border-[#F5DDEB] bg-[#F5DDEB] text-[#5B1A1A] hover:bg-[#F5DDEB]/80 hover:border-[#F5DDEB]/80 transition-colors overflow-visible"
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      cart.openCart();
                    }}
                  >
                    <ShoppingBag className="h-5 w-5" />
                    <span className="absolute -top-1 -right-1 bg-[#5B1A1A] text-[#F5DDEB] text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                      {cart.getCartCount()}
                    </span>
                  </Button>
                </div>
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
