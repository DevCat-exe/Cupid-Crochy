import Link from "next/link";
import { Instagram, Facebook, Twitter, Mail, MapPin, Phone } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-brand-maroon text-brand-beige pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand Column */}
          <div className="space-y-4">
            <h2 className="text-3xl font-cookie">Cupid Crochy</h2>
            <p className="text-sm opacity-80 leading-relaxed">
              Handcrafting love into every stitch. Unique, beautiful crochet creations made just for you and your loved ones.
            </p>
            <div className="flex space-x-4 pt-2">
              <a href="#" className="hover:text-white transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="hover:text-white transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="hover:text-white transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-6">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/shop" className="hover:text-white transition-colors">Shop All</Link>
              </li>
              <li>
                <Link href="/order-tracking" className="hover:text-white transition-colors">Track Order</Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">Contact Us</Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-white transition-colors">FAQ</Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-lg font-bold mb-6">Customer Care</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/shipping" className="hover:text-white transition-colors">Shipping Policy</Link>
              </li>
              <li>
                <Link href="/returns" className="hover:text-white transition-colors">Returns & Refunds</Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold mb-6">Get in Touch</h3>
            <div className="flex items-start space-x-3">
              <MapPin className="h-5 w-5 flex-shrink-0 mt-0.5" />
              <p className="text-sm opacity-80">Dhaka, Bangladesh</p>
            </div>
            <div className="flex items-start space-x-3">
              <Phone className="h-5 w-5 flex-shrink-0 mt-0.5" />
              <p className="text-sm opacity-80">+880 1234 567890</p>
            </div>
            <div className="flex items-start space-x-3">
              <Mail className="h-5 w-5 flex-shrink-0 mt-0.5" />
              <p className="text-sm opacity-80">hello@cupidcrochy.com</p>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center text-xs opacity-60">
          <p>© {currentYear} Cupid Crochy. All rights reserved.</p>
          <p className="mt-4 md:mt-0">Handmade with love in Dhaka</p>
        </div>
      </div>
    </footer>
  );
}
