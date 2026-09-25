import React, { useState, useEffect } from "react";
import { Save, Upload, MapPin, Phone, Mail, Building, Image } from "lucide-react";
import { getSettings, updateSettings } from "../../../services/settingsService";
import { ModernAlert } from "../Modals/Alert";

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    logo: "", companyName: "", address: "", phoneNumber: "", email: "", mapEmbedCode: "",
  });
  const [isDirty, setIsDirty] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isCompressing, setIsCompressing] = useState(false);
  const [alert, setAlert] = useState({ show: false, message: "", type: "" });

  // Dark mode detection
  const [darkMode, setDarkMode] = useState(() =>
    typeof document !== "undefined" && document.documentElement.classList.contains("dark")
  );
  useEffect(() => {
    const observer = new MutationObserver(() => setDarkMode(document.documentElement.classList.contains("dark")));
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);
  const textColor = darkMode ? '#ffffff' : '#000000';

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const data = await getSettings();
        setSettings(data);
        setIsLoading(false);
      } catch (error) {
        console.error("Failed to load settings:", error);
        setIsLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleInputChange = (field, value) => {
    setSettings((prev) => ({ ...prev, [field]: value }));
    setIsDirty(true);
  };

  const compressImage = (file, maxWidth = 800, maxHeight = 600, quality = 0.8) => {
    return new Promise((resolve, reject) => {
      try {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        if (!ctx) { reject(new Error("Canvas context not supported")); return; }
        const img = document.createElement("img");
        img.onload = () => {
          try {
            let width = img.naturalWidth, height = img.naturalHeight;
            if (width > maxWidth || height > maxHeight) {
              const aspectRatio = width / height;
              if (width > height) { width = Math.min(width, maxWidth); height = width / aspectRatio; }
              else { height = Math.min(height, maxHeight); width = height * aspectRatio; }
            }
            canvas.width = width; canvas.height = height;
            ctx.clearRect(0, 0, width, height);
            ctx.drawImage(img, 0, 0, width, height);
            const compressedDataUrl = canvas.toDataURL("image/jpeg", quality);
            if (!compressedDataUrl || compressedDataUrl === "data:,") { reject(new Error("Failed to generate compressed image")); return; }
            URL.revokeObjectURL(img.src);
            resolve(compressedDataUrl);
          } catch (error) { reject(error); }
        };
        img.onerror = () => { URL.revokeObjectURL(img.src); reject(new Error("Failed to load image file")); };
        img.src = URL.createObjectURL(file);
      } catch (error) { reject(error); }
    });
  };

  const handleLogoUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setAlert({ show: true, message: "Please select a valid image file.", type: "error" });
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setAlert({ show: true, message: "Image file is too large. Please select an image smaller than 10MB.", type: "error" });
      return;
    }
    setIsCompressing(true);
    try {
      if (file.size < 100 * 1024) {
        const reader = new FileReader();
        reader.onload = (e) => {
          handleInputChange("logo", e.target.result);
          setAlert({ show: true, message: "Image uploaded successfully!", type: "success" });
        };
        reader.readAsDataURL(file);
      } else {
        const compressedImage = await compressImage(file, 800, 600, 0.8);
        handleInputChange("logo", compressedImage);
        setAlert({ show: true, message: "Image uploaded and compressed successfully!", type: "success" });
      }
    } catch (error) {
      try {
        const reader = new FileReader();
        reader.onload = (e) => {
          handleInputChange("logo", e.target.result);
          setAlert({ show: true, message: "Image uploaded successfully (without compression)!", type: "success" });
        };
        reader.readAsDataURL(file);
      } catch (fallbackError) {
        setAlert({ show: true, message: "Failed to process image. Please try a different image format.", type: "error" });
      }
    } finally {
      setIsCompressing(false);
      event.target.value = "";
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    const currentSettings = { ...settings };
    try {
      const updatedSettings = await updateSettings(settings);
      if (updatedSettings && typeof updatedSettings === "object") {
        setSettings({ ...currentSettings, ...updatedSettings });
      }
      setAlert({ show: true, message: "Settings saved successfully!", type: "success" });
      const button = document.querySelector(".save-button");
      button?.classList.add("animate-pulse");
      setTimeout(() => button?.classList.remove("animate-pulse"), 2000);
    } catch (error) {
      setSettings(currentSettings);
      if (error.response?.status === 401) {
        setAlert({ show: true, message: "Session expired. Please login again.", type: "error" });
        setTimeout(() => { window.location.href = "/login"; }, 3000);
      } else {
        setAlert({ show: true, message: "Failed to save settings. Please try again.", type: "error" });
      }
    } finally {
      setIsSaving(false);
      setTimeout(() => setIsDirty(false), 300);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[90vh] bg-gray-200 dark:bg-gray-900 rounded-xl p-6">
        <div className="flex flex-col items-center space-y-6">
          <div className="w-12 h-12 border-4 border-gray-200 dark:border-gray-700 border-t-[#0f8abe] rounded-full animate-spin" />
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-2" style={{ color: textColor }}>Loading...</h2>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-200 dark:bg-gray-900 rounded-xl">
      {alert.show && <ModernAlert message={alert.message} type={alert.type} onClose={() => setAlert({ ...alert, show: false })} />}

      <div className="container mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold" style={{ color: textColor }}>Company Settings</h1>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="md:col-span-2">
              <label className="flex items-center gap-2 text-sm font-medium mb-2" style={{ color: textColor }}>
                <Image className="w-4 h-4" />
                Company Logo
              </label>
              <div className="flex items-center gap-3">
                <div className="shrink-0">
                  {settings.logo ? (
                    <img src={settings.logo} alt="Company Logo" className="w-16 h-16 object-contain rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-1" />
                  ) : (
                    <div className="w-16 h-16 bg-gray-50 dark:bg-gray-700 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600 flex items-center justify-center">
                      <Image className="w-5 h-5" style={{ color: textColor }} />
                    </div>
                  )}
                </div>
                <div className="grow">
                  <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" id="logo-upload" disabled={isCompressing} />
                  <label
                    htmlFor="logo-upload"
                    className={`inline-flex items-center gap-2 px-4 py-2 text-sm rounded-xl cursor-pointer transition-colors ${
                      isCompressing ? "bg-gray-200 dark:bg-gray-700 cursor-not-allowed" : "bg-[#0f8abe] hover:bg-[#0d7aaa]"
                    }`}
                    style={{ color: isCompressing ? textColor : '#ffffff' }}
                  >
                    {isCompressing ? (<><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Compressing...</>) : (<><Upload className="w-4 h-4" />Upload Logo</>)}
                  </label>
                  <p className="text-xs mt-1" style={{ color: textColor }}>Max 10MB.</p>
                </div>
              </div>
            </div>

            {[
              { icon: Building, label: "Company Name", name: "companyName", type: "text", placeholder: "Enter company name", span: 1 },
              { icon: Phone, label: "Phone Number", name: "phoneNumber", type: "text", placeholder: "Enter phone number", span: 1 },
              { icon: Mail, label: "Email Address", name: "email", type: "email", placeholder: "Enter email address", span: 1 },
              { icon: MapPin, label: "Address", name: "address", type: "textarea", placeholder: "Enter company address", span: 1 },
              { icon: MapPin, label: "Map Embed Code", name: "mapEmbedCode", type: "textarea", placeholder: "Paste Google Maps embed code", span: 2 },
            ].map(({ icon: Icon, label, name, type, placeholder, span }) => (
              <div key={name} className={`space-y-1 ${span === 2 ? "md:col-span-2" : ""}`}>
                <label className="flex items-center gap-2 text-sm font-medium" style={{ color: textColor }}>
                  <Icon className="w-4 h-4" />
                  {label}
                </label>
                {type === "textarea" ? (
                  <textarea
                    value={settings[name] || ""}
                    onChange={(e) => handleInputChange(name, e.target.value)}
                    rows={name === "mapEmbedCode" ? 4 : 3}
                    className="w-full px-3 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-2xl focus:outline-none focus:ring-1 focus:ring-[#0f8abe] focus:border-transparent transition-all duration-200 resize-none text-sm"
                    style={{ color: textColor }}
                    placeholder={placeholder}
                  />
                ) : (
                  <input
                    type={type}
                    value={settings[name] || ""}
                    onChange={(e) => handleInputChange(name, e.target.value)}
                    className="w-full px-3 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-2xl focus:outline-none focus:ring-1 focus:ring-[#0f8abe] focus:border-transparent transition-all duration-200 text-sm"
                    style={{ color: textColor }}
                    placeholder={placeholder}
                  />
                )}
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center pt-5 mt-6 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={handleSave}
              disabled={!isDirty || isSaving || isCompressing}
              className={`save-button flex items-center gap-2 px-4 py-2 text-sm rounded-xl transition-colors ${
                isDirty && !isSaving && !isCompressing ? "bg-[#0f8abe] hover:bg-[#0d7aaa]" : "bg-gray-100 dark:bg-gray-700 cursor-not-allowed"
              }`}
              style={{ color: isDirty && !isSaving && !isCompressing ? '#ffffff' : textColor }}
            >
              {isSaving ? (<><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Saving...</>) : (<><Save className="w-4 h-4" />Save Changes</>)}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}