"use client";

import { useState } from "react";
import {
  Settings,
  User,
  Bell,
  Shield,
  Palette,
  Globe,
  Save,
  Loader2,
  Lock,
  Mail,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/providers/ToastProvider";

export default function SettingsPage() {
  const { success, loading: toastLoading } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("general");

  const tabs = [
    { id: "general", label: "General", icon: Settings },
    { id: "profile", label: "Profile", icon: User },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "security", label: "Security", icon: Shield },
  ];

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const savePromise = new Promise((resolve) => {
      setTimeout(() => {
        setIsLoading(false);
        resolve("Settings saved successfully!");
      }, 1000);
    });

    toastLoading("Saving settings...");
    await savePromise.then(() => success("Settings saved successfully!"));
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-brand-maroon">Settings</h1>
        <p className="text-sm text-brand-maroon/40 font-medium mt-1">Manage your account and preferences</p>
      </div>

      <div className="flex gap-6">
        <aside className="w-64 shrink-0">
          <div className="bg-white rounded-2xl border border-brand-maroon/5 p-4 space-y-1 sticky top-32">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all",
                  activeTab === tab.id
                    ? "bg-brand-maroon text-white"
                    : "text-brand-maroon/70 hover:bg-brand-pink/10 hover:text-brand-maroon"
                )}
              >
                <tab.icon className="h-5 w-5" />
                <span className="font-medium text-sm">{tab.label}</span>
              </button>
            ))}
          </div>
        </aside>

        <main className="flex-1">
          <div className="bg-white rounded-[2.5rem] border border-brand-maroon/5 p-8">
            {activeTab === "general" && (
              <form onSubmit={handleSave} className="space-y-8">
                <div>
                  <h3 className="text-xl font-bold text-brand-maroon mb-6 flex items-center gap-2">
                    <Palette className="h-6 w-6" />
                    Store Settings
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-brand-maroon/60 uppercase tracking-widest pl-1">Store Name</label>
                    <input
                      type="text"
                      defaultValue="Cupid Crochy"
                      className="w-full bg-brand-pink/10 border border-brand-maroon/5 rounded-2xl py-4 px-6 focus:ring-2 focus:ring-brand-maroon/20 outline-none transition-all text-brand-maroon font-bold"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-brand-maroon/60 uppercase tracking-widest pl-1">Store Email</label>
                    <input
                      type="email"
                      defaultValue="info@cupidcrochy.com"
                      className="w-full bg-brand-pink/10 border border-brand-maroon/5 rounded-2xl py-4 px-6 focus:ring-2 focus:ring-brand-maroon/20 outline-none transition-all text-brand-maroon font-bold"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-brand-maroon/60 uppercase tracking-widest pl-1">Currency</label>
                    <select className="w-full bg-brand-pink/10 border border-brand-maroon/5 rounded-2xl py-4 px-6 focus:ring-2 focus:ring-brand-maroon/20 outline-none transition-all text-brand-maroon font-bold appearance-none">
                      <option>BDT - Bangladeshi Taka</option>
                      <option>USD - US Dollar</option>
                      <option>EUR - Euro</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-brand-maroon/60 uppercase tracking-widest pl-1">Default Language</label>
                    <select className="w-full bg-brand-pink/10 border border-brand-maroon/5 rounded-2xl py-4 px-6 focus:ring-2 focus:ring-brand-maroon/20 outline-none transition-all text-brand-maroon font-bold appearance-none">
                      <option>English</option>
                      <option>বাংলা (Bangla)</option>
                      <option>हिंदी (Hindi)</option>
                    </select>
                  </div>
                </div>

                <div className="pt-6 border-t border-brand-maroon/5">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-brand-maroon text-white font-bold py-4 rounded-2xl hover:bg-brand-maroon/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center"
                  >
                    {isLoading ? <Loader2 className="h-5 w-5 animate-spin mr-2" /> : <><Save className="h-5 w-5 mr-2" /> Save Changes</>}
                  </button>
                </div>
              </form>
            )}

            {activeTab === "profile" && (
              <form onSubmit={handleSave} className="space-y-8">
                <div>
                  <h3 className="text-xl font-bold text-brand-maroon mb-6 flex items-center gap-2">
                    <User className="h-6 w-6" />
                    Personal Information
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-brand-maroon/60 uppercase tracking-widest pl-1">Full Name</label>
                    <input
                      type="text"
                      defaultValue="John Doe"
                      className="w-full bg-brand-pink/10 border border-brand-maroon/5 rounded-2xl py-4 px-6 focus:ring-2 focus:ring-brand-maroon/20 outline-none transition-all text-brand-maroon font-bold"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-brand-maroon/60 uppercase tracking-widest pl-1">Email Address</label>
                    <input
                      type="email"
                      defaultValue="john@example.com"
                      className="w-full bg-brand-pink/10 border border-brand-maroon/5 rounded-2xl py-4 px-6 focus:ring-2 focus:ring-brand-maroon/20 outline-none transition-all text-brand-maroon font-bold"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-brand-maroon/60 uppercase tracking-widest pl-1">Phone Number</label>
                    <input
                      type="tel"
                      defaultValue="+880 1234 5678"
                      className="w-full bg-brand-pink/10 border border-brand-maroon/5 rounded-2xl py-4 px-6 focus:ring-2 focus:ring-brand-maroon/20 outline-none transition-all text-brand-maroon font-bold"
                    />
                  </div>
                </div>

                <div className="pt-6 border-t border-brand-maroon/5">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-brand-maroon text-white font-bold py-4 rounded-2xl hover:bg-brand-maroon/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center"
                  >
                    {isLoading ? <Loader2 className="h-5 w-5 animate-spin mr-2" /> : <><Save className="h-5 w-5 mr-2" /> Update Profile</>}
                  </button>
                </div>
              </form>
            )}

            {activeTab === "notifications" && (
              <form onSubmit={handleSave} className="space-y-8">
                <div>
                  <h3 className="text-xl font-bold text-brand-maroon mb-6 flex items-center gap-2">
                    <Bell className="h-6 w-6" />
                    Notification Preferences
                  </h3>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-brand-pink/10 rounded-2xl">
                    <div className="flex items-center gap-3">
                      <Mail className="h-5 w-5 text-brand-maroon" />
                      <div>
                        <h4 className="font-bold text-brand-maroon text-sm">Email Notifications</h4>
                        <p className="text-sm text-brand-maroon/60 mt-1">Order confirmations, shipping updates, promotional emails</p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" defaultChecked className="sr-only peer" />
                      <div className="w-12 h-6 bg-brand-maroon/20 rounded-full peer-checked:bg-brand-maroon transition-all after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:w-5 after:h-5 after:rounded-full after:bg-white after:transition-all peer-checked:after:translate-x-6" />
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-brand-pink/10 rounded-2xl">
                    <div className="flex items-center gap-3">
                      <Bell className="h-5 w-5 text-brand-maroon" />
                      <div>
                        <h4 className="font-bold text-brand-maroon text-sm">Order Status Updates</h4>
                        <p className="text-sm text-brand-maroon/60 mt-1">When your order ships or is delivered</p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" defaultChecked className="sr-only peer" />
                      <div className="w-12 h-6 bg-brand-maroon/20 rounded-full peer-checked:bg-brand-maroon transition-all after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:w-5 after:h-5 after:rounded-full after:bg-white after:transition-all peer-checked:after:translate-x-6" />
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-brand-pink/10 rounded-2xl">
                    <div className="flex items-center gap-3">
                      <Globe className="h-5 w-5 text-brand-maroon" />
                      <div>
                        <h4 className="font-bold text-brand-maroon text-sm">Promotional Emails</h4>
                        <p className="text-sm text-brand-maroon/60 mt-1">New product launches, special offers</p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" defaultChecked className="sr-only peer" />
                      <div className="w-12 h-6 bg-brand-maroon/20 rounded-full peer-checked:bg-brand-maroon transition-all after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:w-5 after:h-5 after:rounded-full after:bg-white after:transition-all peer-checked:after:translate-x-6" />
                    </label>
                  </div>
                </div>

                <div className="pt-6 border-t border-brand-maroon/5">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-brand-maroon text-white font-bold py-4 rounded-2xl hover:bg-brand-maroon/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center"
                  >
                    {isLoading ? <Loader2 className="h-5 w-5 animate-spin mr-2" /> : <><Save className="h-5 w-5 mr-2" /> Save Preferences</>}
                  </button>
                </div>
              </form>
            )}

            {activeTab === "security" && (
              <form onSubmit={handleSave} className="space-y-8">
                <div>
                  <h3 className="text-xl font-bold text-brand-maroon mb-6 flex items-center gap-2">
                    <Shield className="h-6 w-6" />
                    Security Settings
                  </h3>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-brand-maroon/60 uppercase tracking-widest pl-1">Current Password</label>
                    <div className="relative">
                      <input
                        type="password"
                        defaultValue="••••••"
                        disabled
                        className="w-full bg-brand-pink/10 border border-brand-maroon/5 rounded-2xl py-4 pl-12 pr-6 focus:ring-2 focus:ring-brand-maroon/20 outline-none transition-all text-brand-maroon disabled:opacity-50 disabled:cursor-not-allowed"
                      />
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-brand-maroon/40" />
                    </div>
                  </div>

                  <button
                    type="button"
                    className="w-full bg-brand-pink/20 text-brand-maroon font-bold py-4 rounded-2xl hover:bg-brand-pink/30 transition-all"
                  >
                    Change Password
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-brand-maroon/60 uppercase tracking-widest pl-1">Two-Factor Authentication</label>
                    <div className="flex items-center justify-between p-4 bg-brand-pink/10 rounded-xl">
                      <div>
                        <h4 className="font-bold text-brand-maroon text-sm">Add extra security to your account</h4>
                        <p className="text-xs text-brand-maroon/60 mt-1">Require a code when signing in</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" defaultChecked className="sr-only peer" />
                        <div className="w-12 h-6 bg-brand-maroon/20 rounded-full peer-checked:bg-brand-maroon transition-all after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:w-5 after:h-5 after:rounded-full after:bg-white after:transition-all peer-checked:after:translate-x-6" />
                      </label>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-brand-maroon/60 uppercase tracking-widest pl-1">Active Sessions</label>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-3 bg-brand-pink/10 rounded-xl">
                      <div>
                        <p className="text-sm font-medium text-brand-maroon">Current Session</p>
                        <p className="text-xs text-brand-maroon/40">Chrome on Windows • IP: 192.168.1.1</p>
                        <span className="text-xs text-green-600 font-bold">Active</span>
                      </div>
                      <button className="text-xs text-red-600 font-bold hover:underline">Sign out all devices</button>
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-brand-maroon/5">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-brand-maroon text-white font-bold py-4 rounded-2xl hover:bg-brand-maroon/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center"
                  >
                    {isLoading ? <Loader2 className="h-5 w-5 animate-spin mr-2" /> : <><Save className="h-5 w-5 mr-2" /> Save Security Settings</>}
                  </button>
                </div>
              </form>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
