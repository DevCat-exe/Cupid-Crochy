import { motion } from "framer-motion";
import Layout from "../layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Facebook,
  Instagram,
  Twitter,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";

export default function ContactPage() {
  return (
    <Layout>
      <div className="pt-24 pb-16 min-h-screen bg-[#F5DDEB]/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-3xl md:text-4xl font-bold text-[#5B1A1A] mb-4"
            >
              Get In Touch
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-lg text-[#5B1A1A]/70 max-w-2xl mx-auto"
            >
              We'd love to hear from you! Reach out with any questions,
              comments, or custom order inquiries.
            </motion.p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-white p-8 rounded-2xl shadow-md"
            >
              <h2 className="text-2xl font-semibold text-[#5B1A1A] mb-6">
                Send Us a Message
              </h2>
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label
                      htmlFor="name"
                      className="text-sm font-medium text-[#5B1A1A]"
                    >
                      Your Name
                    </label>
                    <Input
                      id="name"
                      placeholder="Enter your name"
                      className="border-[#5B1A1A]/20 focus:border-[#5B1A1A] rounded-xl"
                    />
                  </div>
                  <div className="space-y-2">
                    <label
                      htmlFor="email"
                      className="text-sm font-medium text-[#5B1A1A]"
                    >
                      Email Address
                    </label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      className="border-[#5B1A1A]/20 focus:border-[#5B1A1A] rounded-xl"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="subject"
                    className="text-sm font-medium text-[#5B1A1A]"
                  >
                    Subject
                  </label>
                  <Input
                    id="subject"
                    placeholder="What is this regarding?"
                    className="border-[#5B1A1A]/20 focus:border-[#5B1A1A] rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="message"
                    className="text-sm font-medium text-[#5B1A1A]"
                  >
                    Your Message
                  </label>
                  <Textarea
                    id="message"
                    placeholder="Type your message here..."
                    className="min-h-[150px] border-[#5B1A1A]/20 focus:border-[#5B1A1A] rounded-xl"
                  />
                </div>
                <Button className="w-full bg-[#5B1A1A] hover:bg-[#5B1A1A]/90 rounded-xl py-6">
                  Send Message
                </Button>
              </form>
            </motion.div>

            {/* Contact Info & Social Media */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-8"
            >
              {/* Contact Information */}
              <div className="bg-white p-8 rounded-2xl shadow-md mb-8">
                <h2 className="text-2xl font-semibold text-[#5B1A1A] mb-6">
                  Contact Information
                </h2>
                <div className="space-y-4">
                  <div className="flex items-start space-x-4">
                    <div className="bg-[#F5DDEB] p-3 rounded-full">
                      <Mail className="h-5 w-5 text-[#5B1A1A]" />
                    </div>
                    <div>
                      <h3 className="font-medium text-[#5B1A1A]">Email</h3>
                      <p className="text-[#5B1A1A]/70">hello@cupidcrochy.com</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="bg-[#F5DDEB] p-3 rounded-full">
                      <Phone className="h-5 w-5 text-[#5B1A1A]" />
                    </div>
                    <div>
                      <h3 className="font-medium text-[#5B1A1A]">Phone</h3>
                      <p className="text-[#5B1A1A]/70">+880 1234 567890</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <div className="bg-[#F5DDEB] p-3 rounded-full">
                      <MapPin className="h-5 w-5 text-[#5B1A1A]" />
                    </div>
                    <div>
                      <h3 className="font-medium text-[#5B1A1A]">Location</h3>
                      <p className="text-[#5B1A1A]/70">
                        123 Craft Street, Dhaka, Bangladesh
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Social Media */}
              <div className="bg-white p-8 rounded-2xl shadow-md">
                <h2 className="text-2xl font-semibold text-[#5B1A1A] mb-6">
                  Follow Us
                </h2>
                <p className="text-[#5B1A1A]/70 mb-6">
                  Stay connected with us on social media for updates,
                  behind-the-scenes content, and special offers.
                </p>
                <div className="flex space-x-4">
                  <a
                    href="https://facebook.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-[#F5DDEB] hover:bg-[#5B1A1A] text-[#5B1A1A] hover:text-white p-4 rounded-full transition-colors duration-300"
                  >
                    <Facebook className="h-6 w-6" />
                  </a>
                  <a
                    href="https://instagram.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-[#F5DDEB] hover:bg-[#5B1A1A] text-[#5B1A1A] hover:text-white p-4 rounded-full transition-colors duration-300"
                  >
                    <Instagram className="h-6 w-6" />
                  </a>
                  <a
                    href="https://twitter.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-[#F5DDEB] hover:bg-[#5B1A1A] text-[#5B1A1A] hover:text-white p-4 rounded-full transition-colors duration-300"
                  >
                    <Twitter className="h-6 w-6" />
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
