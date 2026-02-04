"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { User, Mail, Loader2, Shield, Bell } from "lucide-react";
import UserSidebar from "@/components/ui/UserSidebar";
import { useToast } from "@/components/providers/ToastProvider";

export default function SettingsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [newName, setNewName] = useState(session?.user?.name || "");
  const [newImage, setNewImage] = useState(session?.user?.image || "");
  const [updateLoading, setUpdateLoading] = useState(false);
  const { success, error: toastError } = useToast();

  // Password section state
  const [showPasswordSection, setShowPasswordSection] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);

  // Notifications section state
  const [showNotificationSection, setShowNotificationSection] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [notificationLoading, setNotificationLoading] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login?callbackUrl=/dashboard/settings");
    } else if (status === "authenticated") {
      setNewName(session.user.name || "");
      setNewImage(session.user.image || "");
    }
  }, [status, session, router]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdateLoading(true);
    try {
       const res = await fetch("/api/users/profile", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: newName, image: newImage }),
       });
       if (res.ok) {
          router.refresh();
          success("Profile updated successfully!");
       } else {
          throw new Error("Failed to update");
       }
    } catch (error) {
       console.error("Update failed", error);
       toastError("Failed to update profile");
     } finally {
        setUpdateLoading(false);
     }
   };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toastError("Passwords do not match");
      return;
    }
    setPasswordLoading(true);
    try {
      const res = await fetch("/api/users/password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      if (res.ok) {
        success("Password changed successfully!");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setShowPasswordSection(false);
      } else {
        throw new Error("Failed to change password");
      }
    } catch (error) {
      console.error("Password change failed", error);
      toastError("Failed to change password");
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleSaveNotifications = async (e: React.FormEvent) => {
    e.preventDefault();
    setNotificationLoading(true);
    try {
      const res = await fetch("/api/users/notifications", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ emailNotifications }),
      });
      if (res.ok) {
        success("Notification preferences saved!");
        setShowNotificationSection(false);
      } else {
        throw new Error("Failed to save preferences");
      }
    } catch (error) {
      console.error("Save notifications failed", error);
      toastError("Failed to save notification preferences");
    } finally {
      setNotificationLoading(false);
    }
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-beige/30">
        <Loader2 className="h-8 w-8 animate-spin text-brand-maroon" />
      </div>
    );
  }

  return (
    <>
      <UserSidebar />

      <div className="ml-64 min-h-screen bg-brand-beige/20 pt-16 pb-16">
        <div className="p-8">
          <div className="max-w-3xl mx-auto">
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-brand-maroon mb-2">Profile Settings</h1>
              <p className="text-lg text-brand-maroon/60">Update your account information</p>
            </div>

            <div className="space-y-6">
              {/* Profile Card */}
              <div className="bg-white rounded-2xl p-8 border border-brand-maroon/5 shadow-sm">
                <div className="flex items-start gap-6 mb-6">
                  <div className="h-24 w-24 rounded-full overflow-hidden bg-brand-pink/20 flex items-center justify-center border-4 border-brand-pink/30 shrink-0 relative">
                    {session?.user?.image ? (
                      <Image src={session.user.image} alt="Profile" fill className="object-cover" />
                    ) : (
                      <User className="h-12 w-12 text-brand-maroon/40" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-brand-maroon mb-1">{session?.user?.name}</h2>
                    <div className="flex items-center gap-2 text-brand-maroon/60">
                      <Mail className="h-4 w-4" />
                      <span>{session?.user?.email}</span>
                    </div>
                  </div>
                </div>

                <form onSubmit={handleUpdateProfile} className="space-y-6">
                  <div>
                    <label className="text-sm font-bold text-brand-maroon mb-2 block">Display Name</label>
                    <input
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      className="w-full p-4 rounded-xl border border-brand-maroon/10 focus:border-brand-maroon outline-none transition-all"
                      placeholder="Your display name"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-bold text-brand-maroon mb-2 block">Profile Image URL</label>
                    <input
                      value={newImage}
                      onChange={(e) => setNewImage(e.target.value)}
                      placeholder="https://example.com/your-image.jpg"
                      className="w-full p-4 rounded-xl border border-brand-maroon/10 focus:border-brand-maroon outline-none transition-all"
                    />
                    <p className="text-xs text-brand-maroon/40 mt-2">Paste a link to your profile picture</p>
                  </div>

                  <button
                    type="submit"
                    disabled={updateLoading}
                    className="w-full px-8 py-4 bg-brand-maroon text-white font-bold rounded-2xl hover:bg-brand-maroon/90 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {updateLoading && <Loader2 className="h-5 w-5 animate-spin" />}
                    Save Changes
                  </button>
                </form>
              </div>

              {/* Account Options */}
              <div className="bg-white rounded-2xl p-8 border border-brand-maroon/5 shadow-sm space-y-4">
                <div className="flex items-center gap-4 p-4 bg-brand-pink/5 rounded-xl">
                  <Shield className="h-6 w-6 text-brand-maroon" />
                  <div className="flex-1">
                    <h3 className="font-bold text-brand-maroon">Password & Security</h3>
                    <p className="text-sm text-brand-maroon/60">Manage your password and security settings</p>
                  </div>
                  <button
                    onClick={() => setShowPasswordSection(!showPasswordSection)}
                    className="px-4 py-2 bg-white text-brand-maroon font-bold rounded-xl hover:bg-brand-pink transition-all"
                  >
                    {showPasswordSection ? "Close" : "Manage"}
                  </button>
                </div>

                {showPasswordSection && (
                  <form onSubmit={handleChangePassword} className="space-y-4 p-4 border-t border-brand-maroon/10">
                    <div>
                      <label className="text-sm font-bold text-brand-maroon mb-2 block">Current Password</label>
                      <input
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        className="w-full p-4 rounded-xl border border-brand-maroon/10 focus:border-brand-maroon outline-none transition-all"
                        placeholder="Enter your current password"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-bold text-brand-maroon mb-2 block">New Password</label>
                      <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full p-4 rounded-xl border border-brand-maroon/10 focus:border-brand-maroon outline-none transition-all"
                        placeholder="Enter your new password"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-bold text-brand-maroon mb-2 block">Confirm New Password</label>
                      <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full p-4 rounded-xl border border-brand-maroon/10 focus:border-brand-maroon outline-none transition-all"
                        placeholder="Confirm your new password"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={passwordLoading || !currentPassword || !newPassword || !confirmPassword}
                      className="w-full px-8 py-4 bg-brand-maroon text-white font-bold rounded-2xl hover:bg-brand-maroon/90 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {passwordLoading && <Loader2 className="h-5 w-5 animate-spin" />}
                      Change Password
                    </button>
                  </form>
                )}

                <div className="flex items-center gap-4 p-4 bg-brand-pink/5 rounded-xl">
                  <Bell className="h-6 w-6 text-brand-maroon" />
                  <div className="flex-1">
                    <h3 className="font-bold text-brand-maroon">Notifications</h3>
                    <p className="text-sm text-brand-maroon/60">Manage email and push notifications</p>
                  </div>
                  <button
                    onClick={() => setShowNotificationSection(!showNotificationSection)}
                    className="px-4 py-2 bg-white text-brand-maroon font-bold rounded-xl hover:bg-brand-pink transition-all"
                  >
                    {showNotificationSection ? "Close" : "Configure"}
                  </button>
                </div>

                {showNotificationSection && (
                  <form onSubmit={handleSaveNotifications} className="space-y-4 p-4 border-t border-brand-maroon/10">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-bold text-brand-maroon">Email Notifications</h4>
                        <p className="text-sm text-brand-maroon/60">Receive updates and alerts via email</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setEmailNotifications(!emailNotifications)}
                        className={`w-12 h-6 rounded-full transition-all relative ${emailNotifications ? "bg-brand-maroon" : "bg-brand-maroon/20"}`}
                      >
                        <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${emailNotifications ? "left-7" : "left-1"}`} />
                      </button>
                    </div>

                    <button
                      type="submit"
                      disabled={notificationLoading}
                      className="w-full px-8 py-4 bg-brand-maroon text-white font-bold rounded-2xl hover:bg-brand-maroon/90 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {notificationLoading && <Loader2 className="h-5 w-5 animate-spin" />}
                      Save Preferences
                    </button>
                  </form>
                )}
              </div>

              {/* Danger Zone */}
              <div className="bg-red-50 rounded-2xl p-8 border-2 border-red-100">
                <h3 className="text-lg font-bold text-red-600 mb-4">Danger Zone</h3>
                <p className="text-sm text-red-600/80 mb-6">Once you delete your account, there is no going back. Please be certain.</p>
                <button className="px-6 py-3 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition-all">
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
