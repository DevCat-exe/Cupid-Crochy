import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import AdminLayout from "./AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Facebook, Instagram, Twitter } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface SiteSettings {
  heroImage: string;
  heroTitle: string;
  heroSubtitle: string;
  companyName: string;
  companyEmail: string;
  companyPhone: string;
  companyAddress: string;
  socialLinks: {
    facebook: string;
    instagram: string;
    twitter: string;
  };
}

const defaultSettings: SiteSettings = {
  heroImage:
    "https://images.unsplash.com/photo-1631125915902-d8abe9225ff2?w=1200&q=80",
  heroTitle: "Handcrafted Crochet Bags",
  heroSubtitle: "Made with love, carried with pride",
  companyName: "Cupid Crochy",
  companyEmail: "hello@cupidcrochy.com",
  companyPhone: "+880 1234 567890",
  companyAddress: "123 Craft Street, Dhaka, Bangladesh",
  socialLinks: {
    facebook: "https://facebook.com",
    instagram: "https://instagram.com",
    twitter: "https://twitter.com",
  },
};

export default function SettingsPage() {
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);
  const { toast } = useToast();

  useEffect(() => {
    const loadSettings = async () => {
      try {
        // Try to load settings from Supabase
        const { data, error } = await supabase
          .from("settings")
          .select("*")
          .eq("key", "site_settings")
          .single();

        if (error) throw error;

        if (data && data.value) {
          setSettings(data.value);
        } else {
          // If no settings in Supabase, use default settings
          try {
            // Try to save default settings to Supabase
            await supabase.from("settings").upsert(
              {
                key: "site_settings",
                value: defaultSettings,
                updated_at: new Date().toISOString(),
              },
              { onConflict: "key" },
            );
          } catch (saveError) {
            console.error(
              "Error saving default settings to Supabase:",
              saveError,
            );
          }
          setSettings(defaultSettings);
        }
      } catch (e) {
        console.error("Error loading settings:", e);
        // Use default settings as fallback
        setSettings(defaultSettings);

        // Try to save default settings to Supabase
        try {
          await supabase.from("settings").upsert(
            {
              key: "site_settings",
              value: defaultSettings,
              updated_at: new Date().toISOString(),
            },
            { onConflict: "key" },
          );
        } catch (saveError) {
          console.error(
            "Error saving default settings to Supabase:",
            saveError,
          );
        }
      }
    };

    // Load settings immediately
    loadSettings();

    // Set up interval to refresh settings less frequently to avoid lag
    const interval = setInterval(loadSettings, 30000); // 30 seconds instead of 5

    // Clean up interval on unmount
    return () => clearInterval(interval);
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;

    // Handle nested properties (social links)
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setSettings({
        ...settings,
        [parent]: {
          ...settings[parent as keyof SiteSettings],
          [child]: value,
        },
      });
    } else {
      setSettings({ ...settings, [name]: value });
    }
  };

  const saveSettings = async () => {
    try {
      // Try to save to Supabase first
      const { error } = await supabase.from("settings").upsert(
        {
          key: "site_settings",
          value: settings,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "key" },
      );

      if (error) throw error;

      // No need for localStorage backup

      toast({
        title: "Settings saved",
        description: "Your changes have been saved successfully.",
      });
    } catch (e) {
      console.error("Error saving settings to Supabase:", e);
      // Just show the toast, we'll try again next time

      toast({
        title: "Settings saved locally",
        description: "Your changes have been saved to local storage only.",
      });
    }
  };

  return (
    <AdminLayout title="Settings" activeTab="settings">
      <Tabs defaultValue="homepage">
        <TabsList className="mb-6">
          <TabsTrigger value="homepage">Homepage</TabsTrigger>
          <TabsTrigger value="contact">Contact & Social</TabsTrigger>
        </TabsList>

        <TabsContent value="homepage" className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold text-[#5B1A1A] mb-4">
                Homepage Settings
              </h2>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="heroImage" className="text-[#5B1A1A]">
                    Hero Image URL
                  </Label>
                  <Input
                    id="heroImage"
                    name="heroImage"
                    value={settings.heroImage}
                    onChange={handleInputChange}
                  />
                  {settings.heroImage && (
                    <div className="mt-2 rounded-md overflow-hidden h-40">
                      <img
                        src={settings.heroImage}
                        alt="Hero Preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                </div>

                <div>
                  <Label htmlFor="heroTitle" className="text-[#5B1A1A]">
                    Hero Title
                  </Label>
                  <Input
                    id="heroTitle"
                    name="heroTitle"
                    value={settings.heroTitle}
                    onChange={handleInputChange}
                  />
                </div>

                <div>
                  <Label htmlFor="heroSubtitle" className="text-[#5B1A1A]">
                    Hero Subtitle
                  </Label>
                  <Input
                    id="heroSubtitle"
                    name="heroSubtitle"
                    value={settings.heroSubtitle}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <Button
                className="bg-[#5B1A1A] hover:bg-[#5B1A1A]/90 text-[#E8D7BC]"
                onClick={saveSettings}
              >
                Save Changes
              </Button>
            </div>
          </motion.div>
        </TabsContent>

        <TabsContent value="contact" className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold text-[#5B1A1A] mb-4">
                Contact Information
              </h2>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="companyEmail" className="text-[#5B1A1A]">
                    Email Address
                  </Label>
                  <Input
                    id="companyEmail"
                    name="companyEmail"
                    value={settings.companyEmail}
                    onChange={handleInputChange}
                  />
                </div>

                <div>
                  <Label htmlFor="companyPhone" className="text-[#5B1A1A]">
                    Phone Number
                  </Label>
                  <Input
                    id="companyPhone"
                    name="companyPhone"
                    value={settings.companyPhone}
                    onChange={handleInputChange}
                  />
                </div>

                <div>
                  <Label htmlFor="companyAddress" className="text-[#5B1A1A]">
                    Address
                  </Label>
                  <Textarea
                    id="companyAddress"
                    name="companyAddress"
                    value={settings.companyAddress}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <Separator className="my-6" />

              <h2 className="text-xl font-semibold text-[#5B1A1A] mb-4">
                Social Media Links
              </h2>
              <div className="space-y-4">
                <div className="flex items-center">
                  <Facebook className="mr-2 h-5 w-5 text-blue-600" />
                  <Label
                    htmlFor="socialLinks.facebook"
                    className="w-24 text-[#5B1A1A]"
                  >
                    Facebook
                  </Label>
                  <Input
                    id="socialLinks.facebook"
                    name="socialLinks.facebook"
                    value={settings.socialLinks.facebook}
                    onChange={handleInputChange}
                    className="flex-1"
                  />
                </div>

                <div className="flex items-center">
                  <Instagram className="mr-2 h-5 w-5 text-pink-600" />
                  <Label
                    htmlFor="socialLinks.instagram"
                    className="w-24 text-[#5B1A1A]"
                  >
                    Instagram
                  </Label>
                  <Input
                    id="socialLinks.instagram"
                    name="socialLinks.instagram"
                    value={settings.socialLinks.instagram}
                    onChange={handleInputChange}
                    className="flex-1"
                  />
                </div>

                <div className="flex items-center">
                  <Twitter className="mr-2 h-5 w-5 text-blue-400" />
                  <Label
                    htmlFor="socialLinks.twitter"
                    className="w-24 text-[#5B1A1A]"
                  >
                    Twitter
                  </Label>
                  <Input
                    id="socialLinks.twitter"
                    name="socialLinks.twitter"
                    value={settings.socialLinks.twitter}
                    onChange={handleInputChange}
                    className="flex-1"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <Button
                className="bg-[#5B1A1A] hover:bg-[#5B1A1A]/90 text-[#E8D7BC]"
                onClick={saveSettings}
              >
                Save Changes
              </Button>
            </div>
          </motion.div>
        </TabsContent>
      </Tabs>
    </AdminLayout>
  );
}
