import React, { useEffect, useRef, useState } from "react";
import { Plus, Trash2, Loader2, ChevronLeft, ChevronRight, RefreshCw } from "lucide-react";
import { ModernAlert } from "../../../Modals/Alert";
import ConfirmationModal from "../../../Modals/ConfirmationModal";
import { getPartners, addPartner, updatePartner, deletePartner, reorderPartners } from "../../../../../services/partnerApi";

const inputClass =
  "w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 !text-[13px] text-black dark:text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#0f8abe]";

const checkImage = (file) =>
  !file.type.startsWith("image/") ? "Please choose an image file" : file.size > 10 * 1024 * 1024 ? "Image must be 10MB or smaller" : "";

// Hidden file input opened by a button
const useFilePicker = (onPick) => {
  const ref = useRef(null);
  const input = (
    <input
      ref={ref}
      type="file"
      accept="image/*"
      hidden
      onChange={(e) => {
        const file = e.target.files?.[0];
        e.target.value = "";
        if (file) onPick(file);
      }}
    />
  );
  return [() => ref.current?.click(), input];
};

// ── One logo card: preview, name (saved on blur), replace, move, delete ──
const LogoCard = ({ partner, index, total, onRename, onReplace, onMove, onDelete }) => {
  const [name, setName] = useState(partner.name);
  const [openPicker, pickerInput] = useFilePicker((file) => onReplace(partner, file));

  return (
    <div className="group rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-hidden">
      <div className="relative h-24 bg-white flex items-center justify-center p-4">
        <img src={partner.image} alt={partner.name} className="max-h-full max-w-full object-contain" draggable={false} />
        <div className="absolute inset-0 flex items-center justify-center gap-1 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
          <button type="button" title="Replace image" onClick={openPicker} className="p-2 rounded-full bg-white text-black hover:bg-gray-100">
            <RefreshCw className="w-4 h-4" />
          </button>
          <button type="button" title="Delete" onClick={() => onDelete(partner)} className="p-2 rounded-full bg-black text-white hover:bg-gray-800">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
        {pickerInput}
      </div>
      <div className="flex items-center gap-1 p-2 border-t border-gray-100 dark:border-gray-700">
        <button
          type="button"
          title="Move left"
          disabled={index === 0}
          onClick={() => onMove(index, -1)}
          className="p-1.5 rounded-full text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-30"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          onBlur={() => name.trim() && name.trim() !== partner.name && onRename(partner, name.trim())}
          onKeyDown={(e) => e.key === "Enter" && e.currentTarget.blur()}
          className="flex-1 min-w-0 bg-transparent text-center !text-[13px] font-medium text-black dark:text-white rounded-lg px-1 py-1 focus:outline-none focus:ring-1 focus:ring-[#0f8abe]"
        />
        <button
          type="button"
          title="Move right"
          disabled={index === total - 1}
          onClick={() => onMove(index, 1)}
          className="p-1.5 rounded-full text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-30"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

// ── "Add logo" card ──
const AddCard = ({ onAdd, onError }) => {
  const [name, setName] = useState("");
  const [file, setFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [openPicker, pickerInput] = useFilePicker((picked) => {
    const problem = checkImage(picked);
    problem ? onError(problem) : setFile(picked);
  });

  const submit = async () => {
    if (!name.trim() || !file) return onError("Add a name and a logo image");
    setSaving(true);
    const ok = await onAdd(name.trim(), file);
    setSaving(false);
    if (ok) {
      setName("");
      setFile(null);
    }
  };

  return (
    <div className="rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 overflow-hidden">
      <button type="button" onClick={openPicker} className="w-full h-24 flex items-center justify-center p-4 hover:bg-gray-50 dark:hover:bg-gray-700/40">
        {file ? (
          <img src={URL.createObjectURL(file)} alt="" className="max-h-full max-w-full object-contain" />
        ) : (
          <span className="flex flex-col items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
            <Plus className="w-5 h-5" />
            Choose logo
          </span>
        )}
      </button>
      {pickerInput}
      <div className="flex items-center gap-2 p-2 border-t border-gray-100 dark:border-gray-700">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && submit()}
          placeholder="Name"
          className={inputClass}
        />
        <button
          type="button"
          onClick={submit}
          disabled={saving}
          className="flex-shrink-0 p-2 rounded-xl text-white bg-[#0f8abe] hover:bg-[#0d7aaa] disabled:opacity-50"
          title="Add logo"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
};

// ── Page ──
const PartnersManager = () => {
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toDelete, setToDelete] = useState(null);
  const [alert, setAlert] = useState({ show: false, message: "", type: "success" });

  const showAlert = (message, type = "success") => {
    setAlert({ show: true, message, type });
    setTimeout(() => setAlert((prev) => ({ ...prev, show: false })), 3000);
  };

  useEffect(() => {
    getPartners()
      .then((res) => setPartners(res.data || []))
      .catch((err) => showAlert(err.message, "error"))
      .finally(() => setLoading(false));
  }, []);

  const replaceInList = (updated) => setPartners((prev) => prev.map((p) => (p._id === updated._id ? updated : p)));

  const handleAdd = async (name, file) => {
    try {
      const body = new FormData();
      body.append("name", name);
      body.append("image", file);
      const res = await addPartner(body);
      setPartners((prev) => [...prev, res.data]);
      showAlert(res.message);
      return true;
    } catch (err) {
      showAlert(err.message, "error");
      return false;
    }
  };

  const handleRename = async (partner, name) => {
    try {
      const body = new FormData();
      body.append("name", name);
      replaceInList((await updatePartner(partner._id, body)).data);
    } catch (err) {
      showAlert(err.message, "error");
    }
  };

  const handleReplace = async (partner, file) => {
    const problem = checkImage(file);
    if (problem) return showAlert(problem, "error");
    try {
      const body = new FormData();
      body.append("image", file);
      const res = await updatePartner(partner._id, body);
      replaceInList(res.data);
      showAlert(res.message);
    } catch (err) {
      showAlert(err.message, "error");
    }
  };

  const handleMove = async (index, step) => {
    const next = [...partners];
    [next[index], next[index + step]] = [next[index + step], next[index]];
    setPartners(next);
    try {
      await reorderPartners(next.map((p) => p._id));
    } catch (err) {
      showAlert(err.message, "error");
    }
  };

  const handleDelete = async () => {
    const partner = toDelete;
    setToDelete(null);
    try {
      await deletePartner(partner._id);
      setPartners((prev) => prev.filter((p) => p._id !== partner._id));
      showAlert("Logo deleted");
    } catch (err) {
      showAlert(err.message, "error");
    }
  };

  return (
    <div className="px-4 bg-gray-200 dark:bg-gray-900 rounded-xl">
      {alert.show && (
        <div className="mb-4">
          <ModernAlert message={alert.message} type={alert.type} />
        </div>
      )}

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin mb-3 text-[#0f8abe]" />
            <p className="text-black dark:text-white">Loading logos...</p>
          </div>
        ) : (
          <>
            <p className="text-sm text-black dark:text-white mb-4">
              {partners.length} {partners.length === 1 ? "logo" : "logos"}, shown in this order
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {partners.map((partner, i) => (
                <LogoCard
                  key={partner._id}
                  partner={partner}
                  index={i}
                  total={partners.length}
                  onRename={handleRename}
                  onReplace={handleReplace}
                  onMove={handleMove}
                  onDelete={setToDelete}
                />
              ))}
              <AddCard onAdd={handleAdd} onError={(msg) => showAlert(msg, "error")} />
            </div>
          </>
        )}
      </div>

      <ConfirmationModal
        isOpen={!!toDelete}
        title="Delete logo"
        message={`Remove ${toDelete?.name} from the partner strip?`}
        confirmText="Delete"
        cancelText="Cancel"
        danger
        onConfirm={handleDelete}
        onCancel={() => setToDelete(null)}
      />
    </div>
  );
};

export default PartnersManager;