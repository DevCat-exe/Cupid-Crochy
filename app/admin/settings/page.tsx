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
  Loader2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/providers/ToastProvider";

export default function SettingsPage() {
  const { success, error, loading: toastLoading } = useToast();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("general");

  const tabs = [
    { id: "general", label: "General", icon: Settings },
    { id: "profile", label: "Profile", icon: User },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "security", label: "Security", icon: Shield },
  ];

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    toastLoading("Saving settings...");

    setTimeout(() => {
      setLoading(false);
      success("Settings saved successfully!");
    }, 1000);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-brand-maroon">Settings</h1>
        <p className="text-sm text-brand-maroon/40 font-medium mt-1">Manage your account and preferences</p>
      </div>

      <div className="flex gap-6">
        <aside className="w-64 shrink-0">
          <div className="bg-white rounded-2xl border border-brand-maroon/5 p-4 space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all",
                  activeTab === tab.id
                    ? "bg-brand-maroon text-white shadow-lg"
                    : "text-brand-maroon/60 hover:bg-brand-pink/10 hover:text-brand-maroon"
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
            <form onSubmit={handleSave} className="space-y-8">
              <div>
                <h3 className="text-xl font-bold text-brand-maroon mb-6 flex items-center gap-2">
                  <Settings className="h-6 w-6" />
                  General Settings
                </h3>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-brand-maroon/60 uppercase tracking-widest">
                      Store Name
                    </label>
                    <input
                      type="text"
                      defaultValue="Cupid Crochy"
                      className="w-full bg-brand-pink/10 border border-brand-maroon/5 rounded-2xl py-4 px-6 focus:ring-2 focus:ring-brand-maroon/20 outline-none transition-all text-brand-maroon font-bold"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-brand-maroon/60 uppercase tracking-widest">
                      Store Email
                    </label>
                    <input
                      type="email"
                      defaultValue="info@cupidcrochy.com"
                      className="w-full bg-brand-pink/10 border border-brand-maroon/5 rounded-2xl py-4 px-6 focus:ring-2 focus:ring-brand-maroon/20 outline-none transition-all text-brand-maroon font-bold"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-brand-maroon/60 uppercase tracking-widest">
                      Currency
                    </label>
                    <select className="w-full bg-brand-pink/10 border border-brand-maroon/5 rounded-2xl py-4 px-6 focus:ring-2 focus:ring-brand-maroon/20 outline-none transition-all text-brand-maroon font-bold appearance-none">
                      <option>BDT - Bangladeshi Taka</option>
                      <option>USD - US Dollar</option>
                      <option>EUR - Euro</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-brand-maroon/60 uppercase tracking-widest">
                      Default Language
                    </label>
                    <select className="w-full bg-brand-pink/10 border border-brand-maroon/5 rounded-2xl py-4 px-6 focus:ring-2 focus:ring-brand-maroon/20 outline-none transition-all text-brand-maroon font-bold appearance-none">
                      <option>English</option>
                      <option>Bangla</option>
                      <option>Hindi</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-brand-maroon/5">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-brand-maroon text-white font-bold px-8 py-4 rounded-2xl shadow-xl hover:bg-brand-maroon/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center"
                >
                  {loading ? <Loader2 className="h-5 w-5 animate-spin mr-2" /> : <><Save className="h-5 w-5 mr-2" /> Save Changes</>}
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}
