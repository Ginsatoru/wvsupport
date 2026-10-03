import React, { useEffect, useRef, useState } from "react";
import { Loader2, Upload, Trash2, Plus, X } from "lucide-react";
import { ModernAlert } from "../../Modals/Alert";
import SaveButton, { useSaveProgress } from "../../Common/SaveButton";
import { getServicesPageAdmin, saveServicesPage } from "../../../../services/servicesPageApi";
import servicesImg from "../../../../Components/Images/services.webp";
import posImage from "../../../../Components/Images/pos1.webp";
import webstoreImage from "../../../../Components/Images/webstore1.webp";
import multistoreImage from "../../../../Components/Images/ms.webp";
import emailImage from "../../../../Components/Images/email.webp";
import supportImage from "../../../../Components/Images/tech.webp";

// ── Defaults (match the live page) ──
const MAX_SERVICES = 12;
const MAX_PRODUCTS = 6;
const EMPTY_TEXT = { en: "", km: "" };
const DEFAULT_IMAGES = { pos: posImage, webstore: webstoreImage, multistore: multistoreImage, hosting: emailImage, support: supportImage };

const DEFAULT_TEXT = {
  eyebrow: { en: "Our Services", km: "សេវាកម្មរបស់យើង" },
  headingLine1: { en: "Everything your retail", km: "អ្វីគ្រប់យ៉ាងសម្រាប់ការលក់រាយ" },
  headingLine2: { en: "business needs.", km: "ការគាំទ្ររបស់អ្នក" },
  body: {
    en: "From point of sale to reporting, we cover the full RetailManager toolkit your business relies on.",
    km: "ពីចំណុចលក់រហូតដល់របាយការណ៍ យើងផ្តល់ដំណោះស្រាយ RetailManager ពេញលេញសម្រាប់អាជីវកម្មរបស់អ្នក។",
  },
  productsTitle: { en: "Other AAAPOS products you may like", km: "ផលិតផលផ្សេងទៀតពី AAAPOS ដែលអ្នកអាចចាប់អារម្មណ៍" },
  productsButton: { en: "Learn More", km: "ស្វែងយល់បន្ថែម" },
};

const DEFAULT_SERVICES = {
  pos: {
    title: { en: "RetailManager POS", km: "ចំណុចលក់ RetailManager" },
    description: {
      en: "Process sales in seconds, including lay-bys, account sales, quotes, and gift vouchers, while RetailManager quietly tracks every price, discount, and stock movement behind the scenes. Built-in reports show what's selling, your margins, and where stock needs attention, so decisions are based on real numbers, not guesswork.",
      km: "ដំណើរការការលក់ក្នុងរយៈពេលប៉ុន្មានវិនាទី រួមទាំង lay-by គណនី ការដកស្មៀន និងវិធីទូទាត់ច្រើនប្រភេទ ខណៈពេលដែល RetailManager តាមដានតម្លៃ ការបញ្ចុះតម្លៃ និងចលនាស្តុកដោយស្វ័យប្រវត្តិ។ របាយការណ៍ក្នុងប្រព័ន្ធបង្ហាញអ្វីដែលកំពុងលក់ដាច់ និងចំណេញ ដើម្បីជួយសម្រេចចិត្តដោយផ្អែកលើទិន្នន័យពិត។",
    },
  },
  webstore: {
    title: { en: "Webstore Integration", km: "ការតភ្ជាប់ហាងអនឡាញ" },
    description: {
      en: "Connect RetailManager to Shopify, WooCommerce, eBay, or BigCommerce through AAAPOS Webstore Manager, and let stock levels, pricing, and order downloads sync automatically between your online store and the shop floor. No more updating the same product in two places.",
      km: "ភ្ជាប់ RetailManager ជាមួយ Shopify, WooCommerce, eBay ឬ BigCommerce តាមរយៈ AAAPOS Webstore Manager ហើយអនុញ្ញាតឱ្យស្តុក តម្លៃ និងការបញ្ជាទិញធ្វើសមកាលកម្មដោយស្វ័យប្រវត្តិរវាងហាងអនឡាញ និងហាងជាក់ស្តែង។ លែងចាំបាច់ធ្វើបច្ចុប្បន្នភាពផលិតផលដដែលពីរដងទៀតទេ។",
    },
  },
  multistore: {
    title: { en: "Multi-Store Management", km: "ការគ្រប់គ្រងច្រើនហាង" },
    description: {
      en: "Run sales, stock, and pricing across every register and every location from one system. Multi-level security keeps staff access appropriate to their role, and every additional register is included in the one subscription, with no per-terminal surprises as you grow.",
      km: "ដំណើរការការលក់ ស្តុក និងតម្លៃនៅគ្រប់ម៉ាស៊ីនលក់ និងគ្រប់ទីតាំងពីប្រព័ន្ធតែមួយ។ ការកំណត់សុវត្ថិភាពច្រើនកម្រិតរក្សាសិទ្ធិចូលប្រើឱ្យសមស្របតាមតួនាទីបុគ្គលិក ហើយម៉ាស៊ីនលក់បន្ថែមនីមួយៗត្រូវបានរួមបញ្ចូលក្នុងតម្លៃចុះឈ្មោះតែមួយ។",
    },
  },
  hosting: {
    title: { en: "Web Hosting Service", km: "សេវាកម្ម Hosting" },
    description: {
      en: "Keep your webstore fast, secure, and always reachable, so customers can browse and buy any time without interruptions to the site that's connected to your RetailManager stock.",
      km: "រក្សាហាងអនឡាញរបស់អ្នកឱ្យលឿន សុវត្ថិភាព និងអាចចូលប្រើបានគ្រប់ពេល ដើម្បីឱ្យអតិថិជនអាចរកមើល និងទិញទំនិញនៅពេលណាក៏បាន ដោយមិនមានការរំខានចំពោះគេហទំព័រដែលភ្ជាប់ជាមួយស្តុក RetailManager របស់អ្នក។",
    },
  },
  support: {
    title: { en: "Ongoing Support & Customer Tools", km: "ការគាំទ្រជាប់លាប់ និងឧបករណ៍អតិថិជន" },
    description: {
      en: "Reach real support 7 days a week, Monday to Friday 7am-7pm and weekends 9am-5pm, by phone, email, or remote TeamViewer session. RetailManager's built-in CRM also helps you target the right customers with promotions, special offers, and loyalty barcodes, so support and growth work together.",
      km: "ទាក់ទងសេវាកម្មគាំទ្រពិតប្រាកដ 7 ថ្ងៃក្នុងមួយសប្តាហ៍, ចន្ទ័ដល់សុក្រ 7:00-19:00 និងចុងសប្តាហ៍ 9:00-17:00, តាមទូរស័ព្ទ អ៊ីមែល ឬ TeamViewer ពីចម្ងាយ។ ប្រព័ន្ធ CRM ក្នុង RetailManager ក៏ជួយអ្នកកំណត់គោលដៅអតិថិជនត្រឹមត្រូវជាមួយការផ្សព្វផ្សាយ និងកាតសមាជិកភាព ដើម្បីឱ្យការគាំទ្រ និងកំណើនអាជីវកម្មដំណើរការជាមួយគ្នា។",
    },
  },
};

const DEFAULT_PRODUCTS = [
  {
    title: { en: "RM Mobile", km: "RM Mobile" },
    description: {
      en: "Manage stock and sales on the go with the mobile companion for RetailManager.",
      km: "គ្រប់គ្រងស្តុក និងការលក់ពីទូរស័ព្ទ ជាដៃគូនឹង RetailManager។",
    },
    href: "https://www.aaapos.com/rm-mobile/",
  },
  {
    title: { en: "Webstore Manager", km: "Webstore Manager" },
    description: { en: "Sync your online store with RetailManager automatically.", km: "ធ្វើសមកាលកម្មហាងអនឡាញរបស់អ្នកជាមួយ RetailManager ដោយស្វ័យប្រវត្តិ។" },
    href: "https://www.aaapos.com/aaapos-webstore-manager/",
  },
  {
    title: { en: "RM Multi-Store", km: "RM Multi-Store" },
    description: {
      en: "Manage multiple store locations from a single, centralized system.",
      km: "គ្រប់គ្រងទីតាំងហាងច្រើនកន្លែងពីប្រព័ន្ធកណ្តាលតែមួយ។",
    },
    href: "https://www.aaapos.com/rm-multistore/",
  },
];

// Saved text over the defaults (empty keeps the default)
const text = (saved, fallback = EMPTY_TEXT) => ({ en: saved?.en || fallback.en, km: saved?.km || fallback.km });

const toForm = (saved) => {
  const services = saved?.services?.length ? saved.services : Object.keys(DEFAULT_SERVICES).map((key) => ({ key }));
  return {
    ...Object.fromEntries(Object.entries(DEFAULT_TEXT).map(([field, d]) => [field, text(saved?.[field], d)])),
    image: { saved: saved?.image || "", file: null }, // saved "" = built-in image
    services: services.map((s) => {
      const d = DEFAULT_SERVICES[s.key] || { title: EMPTY_TEXT, description: EMPTY_TEXT };
      return {
        key: s.key || "",
        title: text(s.title, d.title),
        description: text(s.description, d.description),
        image: s.image || "", // "" = built-in image (built-in panels only)
        file: null,
      };
    }),
    products: structuredClone(saved?.products?.length ? saved.products : DEFAULT_PRODUCTS).map((p) => ({
      title: text(p.title),
      description: text(p.description),
      href: p.href || "",
    })),
  };
};

// ── Form parts ──
const KHMER_FONT = { fontFamily: '"Noto Sans Khmer", "Khmer OS", sans-serif' };
const inputClass =
  "w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 !text-[13px] leading-relaxed text-black dark:text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#0f8abe]";

const Field = ({ label, children }) => (
  <label className="block space-y-1">
    <span className="text-xs font-medium text-black dark:text-white">{label}</span>
    {children}
  </label>
);

const SectionTitle = ({ children }) => (
  <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">{children}</h3>
);

const ImagePicker = ({ preview, onPick, onReset, className = "h-32" }) => {
  const inputRef = useRef(null);
  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className={`w-full ${className} rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-[#0f8abe] overflow-hidden flex items-center justify-center bg-gray-50 dark:bg-gray-700/40`}
      >
        {preview ? <img src={preview} alt="" className="w-full h-full object-contain p-1" /> : <Upload className="w-5 h-5 text-gray-400" />}
      </button>
      {onReset && (
        <button
          type="button"
          onClick={onReset}
          title="Remove image"
          className="absolute top-2 right-2 p-1.5 rounded-full bg-black/70 text-white hover:bg-black"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        hidden
        onChange={(e) => {
          const file = e.target.files?.[0];
          e.target.value = "";
          if (file) onPick(file);
        }}
      />
    </div>
  );
};

const AddButton = ({ onClick, children }) => (
  <button type="button" onClick={onClick} className="inline-flex items-center gap-1 text-xs font-medium text-[#0f8abe] hover:opacity-70">
    <Plus className="w-3.5 h-3.5" />
    {children}
  </button>
);

// ── Editor ──
const ServicesPageManager = () => {
  const [form, setForm] = useState(null);
  const [lang, setLang] = useState("en");
  const save = useSaveProgress();
  const [alert, setAlert] = useState({ show: false, message: "", type: "success" });

  const showAlert = (message, type = "success") => {
    setAlert({ show: true, message, type });
    setTimeout(() => setAlert((prev) => ({ ...prev, show: false })), 3000);
  };

  const load = () =>
    getServicesPageAdmin()
      .then((res) => setForm(toForm(res.data)))
      .catch((err) => {
        setForm(toForm(null));
        showAlert(err.message, "error");
      });

  useEffect(() => {
    load();
  }, []);

  // Change anything in the form via a draft copy
  const edit = (fn) =>
    setForm((prev) => {
      const next = structuredClone(prev);
      fn(next);
      return next;
    });

  // Bilingual input for the current language; path like ["services", 2, "title"]
  const biProps = (...path) => {
    const node = (obj) => path.reduce((n, key) => n[key], obj);
    return {
      value: node(form)[lang] || "",
      style: lang === "km" ? KHMER_FONT : undefined,
      onChange: (e) => edit((next) => (node(next)[lang] = e.target.value)),
    };
  };

  const checkImage = (file) => {
    if (!file.type.startsWith("image/")) return showAlert("Please choose an image file", "error"), false;
    if (file.size > 10 * 1024 * 1024) return showAlert("Image must be 10MB or smaller", "error"), false;
    return true;
  };
  const servicePreview = (s) => (s.file ? URL.createObjectURL(s.file) : s.image || DEFAULT_IMAGES[s.key] || "");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const missing = form.services.findIndex((s) => !s.title.en.trim() || !servicePreview(s));
    if (missing !== -1) {
      setLang("en");
      return showAlert(`Service ${missing + 1} needs an English title and an image`, "error");
    }
    try {
      const body = new FormData();
      const content = {
        ...form,
        image: form.image.saved,
        services: form.services.map(({ file, ...s }) => s),
      };
      body.append("content", JSON.stringify(content));
      if (form.image.file) body.append("image", form.image.file);
      form.services.forEach((s, i) => s.file && body.append(`service${i}`, s.file));
      const res = await save.run((onProgress) => saveServicesPage(body, onProgress));
      showAlert(res.message);
      await load();
    } catch (err) {
      showAlert(err.message, "error");
    }
  };

  if (!form) {
    return (
      <div className="flex flex-col items-center justify-center py-16 bg-white dark:bg-gray-800 rounded-xl mx-4">
        <Loader2 className="w-8 h-8 animate-spin mb-3 text-[#0f8abe]" />
        <p className="text-black dark:text-white">Loading services page...</p>
      </div>
    );
  }

  return (
    <div className="px-4 bg-gray-200 dark:bg-gray-900 rounded-xl">
      {alert.show && (
        <div className="mb-4">
          <ModernAlert message={alert.message} type={alert.type} />
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-xl shadow">
        <div className="grid grid-cols-1 lg:grid-cols-[2fr_3fr]">
          {/* LEFT — intro + other products */}
          <section className="px-6 py-5 space-y-3">
            <div className="flex items-center justify-between">
              <SectionTitle>Intro</SectionTitle>
              <div className="flex p-1 rounded-full bg-gray-100 dark:bg-gray-700">
                {[
                  ["en", "English"],
                  ["km", "ខ្មែរ"],
                ].map(([value, label]) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setLang(value)}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                      lang === value ? "bg-black text-white dark:bg-white dark:text-black" : "text-gray-600 dark:text-gray-300"
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
            <Field label="Eyebrow">
              <input className={inputClass} {...biProps("eyebrow")} />
            </Field>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Field label="Heading line 1">
                <input className={inputClass} {...biProps("headingLine1")} />
              </Field>
              <Field label="Heading line 2">
                <input className={inputClass} {...biProps("headingLine2")} />
              </Field>
            </div>
            <Field label="Body">
              <textarea rows={3} className={inputClass} {...biProps("body")} />
            </Field>
            <Field label="Intro image">
              <ImagePicker
                className="h-36"
                preview={form.image.file ? URL.createObjectURL(form.image.file) : form.image.saved || servicesImg}
                onPick={(file) => checkImage(file) && edit((next) => (next.image.file = file))}
                onReset={form.image.file || form.image.saved ? () => edit((next) => (next.image = { saved: "", file: null })) : undefined}
              />
            </Field>

            <div className="pt-3 space-y-3">
              <SectionTitle>Other products box</SectionTitle>
              <div className="grid grid-cols-1 sm:grid-cols-[2fr_1fr] gap-3">
                <Field label="Box title">
                  <input className={inputClass} {...biProps("productsTitle")} />
                </Field>
                <Field label="Button text">
                  <input className={inputClass} {...biProps("productsButton")} />
                </Field>
              </div>
              {form.products.map((_, i) => (
                <div key={i} className="rounded-xl border border-gray-200 dark:border-gray-700 p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Product {i + 1}</span>
                    <button
                      type="button"
                      onClick={() => edit((next) => next.products.splice(i, 1))}
                      className="inline-flex items-center gap-1 text-xs text-gray-500 hover:text-red-500"
                    >
                      <X className="w-3.5 h-3.5" />
                      Remove
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <input className={inputClass} placeholder="Title" {...biProps("products", i, "title")} />
                    <input
                      className={inputClass}
                      placeholder="https://..."
                      value={form.products[i].href}
                      onChange={(e) => edit((next) => (next.products[i].href = e.target.value))}
                    />
                  </div>
                  <textarea rows={2} className={inputClass} placeholder="Description" {...biProps("products", i, "description")} />
                </div>
              ))}
              {form.products.length < MAX_PRODUCTS && (
                <AddButton
                  onClick={() => edit((next) => next.products.push({ title: { ...EMPTY_TEXT }, description: { ...EMPTY_TEXT }, href: "" }))}
                >
                  Add product
                </AddButton>
              )}
            </div>
          </section>

          {/* RIGHT — service panels */}
          <section className="px-6 py-5 space-y-3 border-t lg:border-t-0 lg:border-l border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <SectionTitle>Services</SectionTitle>
              <SaveButton state={save} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {form.services.map((s, i) => (
                <div key={i} className="rounded-xl border border-gray-200 dark:border-gray-700 p-4 space-y-3">
                  <ImagePicker
                    preview={servicePreview(s)}
                    onPick={(file) => checkImage(file) && edit((next) => (next.services[i].file = file))}
                    onReset={s.file || s.image ? () => edit((next) => Object.assign(next.services[i], { file: null, image: "" })) : undefined}
                  />
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-black dark:text-white">Service {i + 1}</span>
                    {form.services.length > 1 && (
                      <button
                        type="button"
                        onClick={() => edit((next) => next.services.splice(i, 1))}
                        className="inline-flex items-center gap-1 text-xs text-gray-500 hover:text-red-500"
                      >
                        <X className="w-3.5 h-3.5" />
                        Remove
                      </button>
                    )}
                  </div>
                  <Field label="Title">
                    <input className={inputClass} {...biProps("services", i, "title")} />
                  </Field>
                  <Field label="Description">
                    <textarea rows={4} className={inputClass} {...biProps("services", i, "description")} />
                  </Field>
                </div>
              ))}

              {form.services.length < MAX_SERVICES && (
                <button
                  type="button"
                  onClick={() =>
                    edit((next) =>
                      next.services.push({ key: "", title: { ...EMPTY_TEXT }, description: { ...EMPTY_TEXT }, image: "", file: null })
                    )
                  }
                  className="min-h-[14rem] rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-[#0f8abe] flex flex-col items-center justify-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-[#0f8abe] transition-colors"
                >
                  <Plus className="w-6 h-6" />
                  Add service
                </button>
              )}
            </div>
          </section>
        </div>
      </form>
    </div>
  );
};

export default ServicesPageManager;