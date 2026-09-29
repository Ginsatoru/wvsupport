import React, { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import HeroForm from "./HeroForm";
import { ModernAlert } from "../../../Modals/Alert";
import { getAllHeroContent } from "../../../../../services/heroApi";

// The home page hero, straight into the editor (the live one, or the newest if none is live)
const HeroManagement = () => {
  const [hero, setHero] = useState(null);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState({ show: false, message: "", type: "success" });

  const showAlert = (message, type = "success") => {
    setAlert({ show: true, message, type });
    setTimeout(() => setAlert((prev) => ({ ...prev, show: false })), 3000);
  };

  useEffect(() => {
    getAllHeroContent()
      .then((res) => {
        const list = res.data || [];
        setHero(list.find((h) => h.isActive) || list[0] || null);
      })
      .catch((err) => showAlert(err.message, "error"))
      .finally(() => setLoading(false));
  }, []);

  const handleSaved = (result) => {
    setHero(result.data);
    showAlert(result.message || "Hero saved");
  };

  return (
    <div className="px-4 bg-gray-200 dark:bg-gray-900 rounded-xl">
      {alert.show && (
        <div className="mb-4">
          <ModernAlert message={alert.message} type={alert.type} />
        </div>
      )}

      {loading ? (
        <div className="flex flex-col items-center justify-center py-16 bg-white dark:bg-gray-800 rounded-xl">
          <Loader2 className="w-8 h-8 animate-spin mb-3 text-[#0f8abe]" />
          <p className="text-black dark:text-white">Loading hero...</p>
        </div>
      ) : (
        // Re-mount after each save so images/previews reflect what the server stored
        <HeroForm key={`${hero?._id || "new"}-${hero?.updatedAt || ""}`} hero={hero} onSaved={handleSaved} />
      )}
    </div>
  );
};

export default HeroManagement;