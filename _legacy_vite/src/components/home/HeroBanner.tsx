import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/lib/supabase";

export default function HeroBanner() {
  // Default settings
  const defaultSettings = {
    heroImage:
      "https://images.unsplash.com/photo-1631125915902-d8abe9225ff2?w=1200&q=80",
    heroTitle: "Handcrafted Crochet Bags",
    heroSubtitle: "Made with love, carried with pride",
  };

  const [settings, setSettings] = useState(defaultSettings);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data, error } = await supabase
          .from("settings")
          .select("value")
          .eq("key", "site_settings")
          .single();

        if (error) throw error;

        if (data && data.value) {
          setSettings({
            heroImage: data.value.heroImage || defaultSettings.heroImage,
            heroTitle: data.value.heroTitle || defaultSettings.heroTitle,
            heroSubtitle:
              data.value.heroSubtitle || defaultSettings.heroSubtitle,
          });
        }
      } catch (e) {
        console.error("Error loading settings:", e);
      }
    };

    fetchSettings();
  }, []);

  return (
    <div
      className="relative w-full h-[80vh] min-h-[600px] overflow-hidden rounded-b-3xl"
      style={{ backgroundColor: "#F5DDEB" }}
    >
      <div className="container relative z-10 mx-auto h-full flex flex-col justify-center items-start px-4 md:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl"
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#5B1A1A] mb-6 drop-shadow-sm">
            {settings.heroTitle}
            <span className="block text-2xl md:text-3xl mt-2 font-normal">
              {settings.heroSubtitle}
            </span>
          </h1>

          <p className="text-lg md:text-xl text-[#5B1A1A]/80 mb-8">
            Each bag tells a unique story, crafted with care and designed to
            bring joy to your everyday style.
          </p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <Link to="/shop">
              <Button
                size="lg"
                className="bg-[#5B1A1A] hover:bg-[#5B1A1A]/90 text-white rounded-xl px-8 py-6 text-lg group"
              >
                Shop Now
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </div>

      <motion.div
        className="absolute bottom-0 right-0 w-[45%] h-[90%] hidden lg:block"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2, duration: 0.8 }}
      >
        <img
          src={settings.heroImage}
          alt="Featured crochet bag"
          className="w-full h-full object-cover object-center rounded-tl-3xl"
        />
      </motion.div>
    </div>
  );
}
