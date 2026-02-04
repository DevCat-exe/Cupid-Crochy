"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import {
  Facebook,
  Instagram,
  Twitter,
  Mail,
  Phone,
  MapPin,
  Send,
  CheckCircle2,
  AlertTriangle
} from "lucide-react";
import { useToast } from "@/components/providers/ToastProvider";

export default function ContactPage() {
  const { success, error } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [formState, setFormState] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [statusMessage, setStatusMessage] = useState("");

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setFormState("loading");
    setStatusMessage("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data?.error || "Unable to send your message.");
      }

      setFormData({ name: "", email: "", subject: "", message: "" });
      setFormState("success");
      setStatusMessage("Thanks for reaching out! We'll reply within 1-2 business days.");
      success("Message sent successfully!");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Something went wrong. Please try again.";
      setFormState("error");
      setStatusMessage(message);
      error(message);
    }
  };

  return (
    <div className="pt-24 pb-16 min-h-screen bg-brand-beige/30">
      <div className="container mx-auto px-4">
        <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-white via-brand-beige/30 to-brand-pink/10 p-10 md:p-16 shadow-xl border border-brand-maroon/5 mb-12">
          <div className="absolute inset-0 bg-[url('/noise.png')] opacity-5 mix-blend-soft-light" />
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="relative z-10"
          >
            <p className="text-xs uppercase tracking-[0.4em] text-brand-maroon/50 font-bold mb-4">
              We&apos;re here to help
            </p>
            <h1 className="text-4xl md:text-5xl font-bold text-brand-maroon mb-4 font-outfit">
              Let&apos;s craft something beautiful together.
            </h1>
            <p className="text-lg text-brand-maroon/70 max-w-2xl font-outfit">
              Share your ideas, custom order requests, or feedback and our team will reply within 24-48 hours.
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white p-8 md:p-10 rounded-[2.5rem] shadow-xl border border-brand-maroon/5"
          >
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-semibold text-brand-maroon font-outfit">
                  Send us a message
                </h2>
                <p className="text-sm text-brand-maroon/60 font-outfit mt-2">
                  We respond quickly during business hours.
                </p>
              </div>
              <div className="h-12 w-12 rounded-2xl bg-brand-pink/20 flex items-center justify-center">
                <Send className="h-5 w-5 text-brand-maroon" />
              </div>
            </div>

            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium text-brand-maroon font-outfit">
                    Your Name
                  </label>
                  <input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your name"
                    required
                    className="flex h-11 w-full rounded-xl border border-brand-maroon/20 bg-background px-3 py-2 text-sm text-brand-maroon ring-offset-background placeholder:text-brand-maroon/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-maroon focus-visible:ring-offset-2"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium text-brand-maroon font-outfit">
                    Email Address
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    required
                    className="flex h-11 w-full rounded-xl border border-brand-maroon/20 bg-background px-3 py-2 text-sm text-brand-maroon ring-offset-background placeholder:text-brand-maroon/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-maroon focus-visible:ring-offset-2"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label htmlFor="subject" className="text-sm font-medium text-brand-maroon font-outfit">
                  Subject
                </label>
                <input
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="What is this regarding?"
                  required
                  className="flex h-11 w-full rounded-xl border border-brand-maroon/20 bg-background px-3 py-2 text-sm text-brand-maroon ring-offset-background placeholder:text-brand-maroon/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-maroon focus-visible:ring-offset-2"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="message" className="text-sm font-medium text-brand-maroon font-outfit">
                  Your Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Type your message here..."
                  required
                  className="flex min-h-40 w-full rounded-xl border border-brand-maroon/20 bg-background px-3 py-2 text-sm text-brand-maroon ring-offset-background placeholder:text-brand-maroon/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-maroon focus-visible:ring-offset-2"
                />
              </div>

              {formState !== "idle" && (
                <div
                  className={`flex items-start gap-3 rounded-2xl border px-4 py-3 text-sm font-medium ${
                    formState === "success"
                      ? "border-green-200 bg-green-50 text-green-700"
                      : formState === "error"
                      ? "border-red-200 bg-red-50 text-red-700"
                      : "border-brand-maroon/10 bg-brand-beige/30 text-brand-maroon/70"
                  }`}
                >
                  {formState === "success" ? <CheckCircle2 className="h-5 w-5" /> : <AlertTriangle className="h-5 w-5" />}
                  <span>{statusMessage || "Sending your message..."}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={formState === "loading"}
                className="w-full bg-brand-maroon hover:bg-brand-maroon/90 text-white rounded-xl py-4 font-outfit font-bold shadow-lg hover:shadow-brand-maroon/20 transition-all flex items-center justify-center gap-2 disabled:opacity-60"
              >
                <Send className="h-4 w-4" />
                {formState === "loading" ? "Sending..." : "Send Message"}
              </button>
            </form>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            <div className="bg-white p-8 rounded-[2.5rem] shadow-md border border-brand-maroon/5">
              <h2 className="text-2xl font-semibold text-brand-maroon mb-6 font-outfit">
                Contact Information
              </h2>
              <div className="space-y-4">
                <div className="flex items-start space-x-4">
                  <div className="bg-brand-pink/20 p-3 rounded-full">
                    <Mail className="h-5 w-5 text-brand-maroon" />
                  </div>
                  <div>
                    <h3 className="font-medium text-brand-maroon font-outfit">Email</h3>
                    <p className="text-brand-maroon/70 font-outfit">hello@cupidcrochy.com</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="bg-brand-pink/20 p-3 rounded-full">
                    <Phone className="h-5 w-5 text-brand-maroon" />
                  </div>
                  <div>
                    <h3 className="font-medium text-brand-maroon font-outfit">Phone</h3>
                    <p className="text-brand-maroon/70 font-outfit">+880 1234 567890</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="bg-brand-pink/20 p-3 rounded-full">
                    <MapPin className="h-5 w-5 text-brand-maroon" />
                  </div>
                  <div>
                    <h3 className="font-medium text-brand-maroon font-outfit">Location</h3>
                    <p className="text-brand-maroon/70 font-outfit">
                      123 Craft Street, Dhaka, Bangladesh
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-[2.5rem] shadow-md border border-brand-maroon/5">
              <h2 className="text-2xl font-semibold text-brand-maroon mb-6 font-outfit">
                Follow Us
              </h2>
              <p className="text-brand-maroon/70 mb-6 font-outfit">
                Let&apos;s connect and create something special together.
              </p>
              <div className="flex flex-wrap gap-4">
                {[
                  { href: "https://facebook.com", label: "Facebook", icon: Facebook },
                  { href: "https://instagram.com", label: "Instagram", icon: Instagram },
                  { href: "https://twitter.com", label: "Twitter", icon: Twitter }
                ].map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-3 rounded-full bg-brand-pink/20 px-5 py-3 text-sm font-bold text-brand-maroon transition-colors duration-300 hover:bg-brand-maroon hover:text-white"
                  >
                    <social.icon className="h-5 w-5" />
                    {social.label}
                  </a>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
