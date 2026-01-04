import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Facebook, Instagram, Twitter } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#5B1A1A] text-[#E8D7BC] pt-16 pb-8 rounded-t-3xl mt-auto">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div>
            <h3 className="text-xl font-bold mb-4">Cupid Crochy</h3>
            <p className="text-[#E8D7BC]/90 mb-4">
              Handcrafted crochet bags made with love and attention to detail.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-white transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="hover:text-white transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="hover:text-white transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Shop</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/shop"
                  className="text-[#E8D7BC]/90 hover:text-white transition-colors"
                >
                  All Products
                </Link>
              </li>
              <li>
                <Link
                  to="/shop/tote-bags"
                  className="text-[#E8D7BC]/90 hover:text-white transition-colors"
                >
                  Tote Bags
                </Link>
              </li>
              <li>
                <Link
                  to="/shop/crossbody-bags"
                  className="text-[#E8D7BC]/90 hover:text-white transition-colors"
                >
                  Crossbody Bags
                </Link>
              </li>
              <li>
                <Link
                  to="/shop/bucket-bags"
                  className="text-[#E8D7BC]/90 hover:text-white transition-colors"
                >
                  Bucket Bags
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/about"
                  className="text-[#E8D7BC]/90 hover:text-white transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-[#E8D7BC]/90 hover:text-white transition-colors"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  to="/faq"
                  className="text-[#E8D7BC]/90 hover:text-white transition-colors"
                >
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  to="/shipping"
                  className="text-[#E8D7BC]/90 hover:text-white transition-colors"
                >
                  Shipping & Returns
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Newsletter</h3>
            <p className="text-[#E8D7BC]/90 mb-4">
              Subscribe to get special offers, free giveaways, and new product
              announcements.
            </p>
            <div className="flex space-x-2">
              <Input
                type="email"
                placeholder="Your email"
                className="bg-white/10 border-white/20 text-white placeholder:text-white/50 rounded-xl"
              />
              <Button className="bg-[#F5DDEB] text-[#5B1A1A] hover:bg-[#F5DDEB]/90 rounded-xl">
                Subscribe
              </Button>
            </div>
          </div>
        </div>

        <div className="border-t border-white/20 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-[#E8D7BC]/80 text-sm mb-4 md:mb-0">
            © {new Date().getFullYear()} Cupid Crochy. All rights reserved.
          </p>
          <div className="flex space-x-6">
            <Link
              to="/privacy"
              className="text-[#E8D7BC]/80 text-sm hover:text-white transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              to="/terms"
              className="text-[#E8D7BC]/80 text-sm hover:text-white transition-colors"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
