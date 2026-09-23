import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// Font switching: swaps the primary font between Montserrat (EN) and Battambang (KM)
const updateFontFamily = (lng) => {
  if (typeof document === "undefined") return; // SSR safety check

  const body = document.body;
  const html = document.documentElement;

  body.classList.remove("lang-en", "lang-km");
  html.classList.remove("lang-en", "lang-km");

  const langClass = `lang-${lng}`;
  body.classList.add(langClass);
  html.classList.add(langClass);

  if (lng === "km") {
    document.documentElement.style.setProperty("--current-lang-font", "var(--font-khmer)");
    document.documentElement.style.setProperty("--font-primary", "'Battambang', serif");
  } else {
    document.documentElement.style.setProperty("--current-lang-font", "var(--font-primary)");
    document.documentElement.style.setProperty("--font-primary", "'Montserrat', sans-serif");
  }

  setHtmlLang(lng);
};

function setHtmlLang(lng) {
  if (typeof document !== "undefined" && document.documentElement) {
    setTimeout(() => {
      document.documentElement.lang = lng;
    }, 0);
  }
}

// Only the keys still referenced in the app: the home page's Services
// component (services.header.title, services.<key>.title/description)
// and the home page's About bento section (retailManager.subtitle).
// All other pages now use hardcoded bilingual text directly in-component.
const resources = {
  en: {
    translation: {
      retailManager: {
        subtitle: "We'd love to tell you about us",
      },
      services: {
        header: {
          title: "Our Services",
        },
        pos: {
          title: "Point of Sale (POS) System",
          description:
            "Comprehensive retail management solution with inventory tracking, sales reporting, and customer management features.",
        },
        webstore: {
          title: "Webstore Manager",
          description:
            "Complete e-commerce platform to manage your online store, products, orders, and customer relationships seamlessly.",
        },
        multistore: {
          title: "Multi-Store Management",
          description:
            "Centralized management system for multiple retail locations with unified reporting and inventory control.",
        },
        hosting: {
          title: "Hosting Services",
          description:
            "Professional email hosting solutions with custom domains, security features, and reliable uptime for your business.",
        },
        support: {
          title: "Technical Support",
        },
      },
    },
  },
  km: {
    translation: {
      retailManager: {
        subtitle: "យើងចង់ប្រាប់អ្នកអំពីពួកយើង",
      },
      services: {
        header: {
          title: "សេវាកម្មរបស់យើង",
        },
        pos: {
          title: "ប្រព័ន្ធគ្រប់គ្រងការលក់ (POS)",
          description:
            "ដំណោះស្រាយគ្រប់គ្រងអាជីវកម្មពិសេសរួមមានការតាមដានស្តុក របាយការណ៍លក់ និងលក្ខណៈពិសេសគ្រប់គ្រងព័ត៌មានរបស់អតិថិជន។",
        },
        webstore: {
          title: "កម្មវិធីគ្រប់គ្រងហាងអនឡាញ",
          description:
            "វេទិកាពាណិជ្ជកម្មអេឡិចត្រូនិចពេញលេញដើម្បីគ្រប់គ្រងហាងអនឡាញ ផលិតផល ការបញ្ជាទិញ និងទំនាក់ទំនងអតិថិជនរបស់អ្នកយ៉ាងស៊ីសង្វាក់។",
        },
        multistore: {
          title: "ប្រព័ន្ធគ្រប់គ្រងហាងច្រើន",
          description:
            "ប្រព័ន្ធគ្រប់គ្រងកណ្តាលសម្រាប់ទីតាំងលក់រាយច្រើនជាមួយនឹងរបាយការណ៍ និងការគ្រប់គ្រងស្តុករួម។",
        },
        hosting: {
          title: "សេវាបង្ហោះគេហទំព័រ",
          description:
            "ដំណោះស្រាយផ្ទុកគេហទំព័រអាជីពជាមួយដែនផ្ទាល់ខ្លួន លក្ខណៈពិសេសសុវត្ថិភាព និងពេលដំណើរការដែលអាចទុកចិត្តបានសម្រាប់អាជីវកម្មរបស់អ្នក។",
        },
        support: {
          title: "សេវាគាំទ្របច្ចេកទេស",
        },
      },
    },
  },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: "en",
    fallbackLng: "en",
    interpolation: { escapeValue: false },
    react: { useSuspense: false },
    returnEmptyString: false,
    returnNull: false,
    returnObjects: false,
  })
  .catch((error) => {
    console.error("i18n initialization failed:", error);
  });

updateFontFamily(i18n.language || "en");

i18n.on("languageChanged", (lng) => {
  updateFontFamily(lng || "en");
  if (typeof localStorage !== "undefined") {
    localStorage.setItem("language", lng);
  }
});

if (typeof localStorage !== "undefined") {
  const savedLang = localStorage.getItem("language");
  if (savedLang === "en" || savedLang === "km") {
    i18n.changeLanguage(savedLang);
  }
}

export default i18n;