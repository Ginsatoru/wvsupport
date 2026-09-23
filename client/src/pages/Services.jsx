import React, { useRef, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import servicesImg from "../Components/Images/services.webp";

// Reused images from the home page's Services section
import posImage from "../Components/Images/pos1.webp";
import webstoreImage from "../Components/Images/webstore1.webp";
import multistoreImage from "../Components/Images/ms.webp";
import emailImage from "../Components/Images/email.webp";
import supportImage from "../Components/Images/tech.webp";

/* ── Word-slice text, same mechanic as Hero / Tech / Work / AboutUs ── */
const SliceText = ({ text, inView, baseDelay = 0 }) => (
  <>
    {text.split(" ").map((word, i) => (
      <span key={i} className="sv-word-wrap">
        <span
          className="sv-word"
          style={{ transitionDelay: `${baseDelay + i * 0.055}s` }}
        >
          {word}
          {i < text.split(" ").length - 1 ? "\u00A0" : ""}
        </span>
      </span>
    ))}
  </>
);

const Services = () => {
  const { i18n } = useTranslation();
  const isKm = i18n.language === "km";
  const sectionRef = useRef(null);
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setEntered(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const eyebrow = isKm ? "សេវាកម្មរបស់យើង" : "Our Services";
  const headline1 = isKm ? "អ្វីគ្រប់យ៉ាងសម្រាប់ការលក់រាយ" : "Everything your retail";
  const headline2 = isKm ? "ការគាំទ្ររបស់អ្នក" : "business needs.";
  const bodyText = isKm
    ? "ពីចំណុចលក់រហូតដល់របាយការណ៍ យើងផ្តល់ដំណោះស្រាយ RetailManager ពេញលេញសម្រាប់អាជីវកម្មរបស់អ្នក។"
    : "From point of sale to reporting, we cover the full RetailManager toolkit your business relies on.";

  const services = [
    {
      image: posImage,
      title: isKm ? "ចំណុចលក់ RetailManager" : "RetailManager POS",
      desc: isKm
        ? "ដំណើរការការលក់ក្នុងរយៈពេលប៉ុន្មានវិនាទី រួមទាំង lay-by គណនី ការដកស្មៀន និងវិធីទូទាត់ច្រើនប្រភេទ ខណៈពេលដែល RetailManager តាមដានតម្លៃ ការបញ្ចុះតម្លៃ និងចលនាស្តុកដោយស្វ័យប្រវត្តិ។ របាយការណ៍ក្នុងប្រព័ន្ធបង្ហាញអ្វីដែលកំពុងលក់ដាច់ និងចំណេញ ដើម្បីជួយសម្រេចចិត្តដោយផ្អែកលើទិន្នន័យពិត។"
        : "Process sales in seconds, including lay-bys, account sales, quotes, and gift vouchers, while RetailManager quietly tracks every price, discount, and stock movement behind the scenes. Built-in reports show what's selling, your margins, and where stock needs attention, so decisions are based on real numbers, not guesswork.",
    },
    {
      image: webstoreImage,
      title: isKm ? "ការតភ្ជាប់ហាងអនឡាញ" : "Webstore Integration",
      desc: isKm
        ? "ភ្ជាប់ RetailManager ជាមួយ Shopify, WooCommerce, eBay ឬ BigCommerce តាមរយៈ AAAPOS Webstore Manager ហើយអនុញ្ញាតឱ្យស្តុក តម្លៃ និងការបញ្ជាទិញធ្វើសមកាលកម្មដោយស្វ័យប្រវត្តិរវាងហាងអនឡាញ និងហាងជាក់ស្តែង។ លែងចាំបាច់ធ្វើបច្ចុប្បន្នភាពផលិតផលដដែលពីរដងទៀតទេ។"
        : "Connect RetailManager to Shopify, WooCommerce, eBay, or BigCommerce through AAAPOS Webstore Manager, and let stock levels, pricing, and order downloads sync automatically between your online store and the shop floor. No more updating the same product in two places.",
    },
    {
      image: multistoreImage,
      title: isKm ? "ការគ្រប់គ្រងច្រើនហាង" : "Multi-Store Management",
      desc: isKm
        ? "ដំណើរការការលក់ ស្តុក និងតម្លៃនៅគ្រប់ម៉ាស៊ីនលក់ និងគ្រប់ទីតាំងពីប្រព័ន្ធតែមួយ។ ការកំណត់សុវត្ថិភាពច្រើនកម្រិតរក្សាសិទ្ធិចូលប្រើឱ្យសមស្របតាមតួនាទីបុគ្គលិក ហើយម៉ាស៊ីនលក់បន្ថែមនីមួយៗត្រូវបានរួមបញ្ចូលក្នុងតម្លៃចុះឈ្មោះតែមួយ។"
        : "Run sales, stock, and pricing across every register and every location from one system. Multi-level security keeps staff access appropriate to their role, and every additional register is included in the one subscription, with no per-terminal surprises as you grow.",
    },
    {
      image: emailImage,
      title: isKm ? "សេវាកម្ម Hosting" : "Web Hosting Service",
      desc: isKm
        ? "រក្សាហាងអនឡាញរបស់អ្នកឱ្យលឿន សុវត្ថិភាព និងអាចចូលប្រើបានគ្រប់ពេល ដើម្បីឱ្យអតិថិជនអាចរកមើល និងទិញទំនិញនៅពេលណាក៏បាន ដោយមិនមានការរំខានចំពោះគេហទំព័រដែលភ្ជាប់ជាមួយស្តុក RetailManager របស់អ្នក។"
        : "Keep your webstore fast, secure, and always reachable, so customers can browse and buy any time without interruptions to the site that's connected to your RetailManager stock.",
    },
    {
      image: supportImage,
      title: isKm ? "ការគាំទ្រជាប់លាប់ និងឧបករណ៍អតិថិជន" : "Ongoing Support & Customer Tools",
      desc: isKm
        ? "ទាក់ទងសេវាកម្មគាំទ្រពិតប្រាកដ 7 ថ្ងៃក្នុងមួយសប្តាហ៍, ចន្ទ័ដល់សុក្រ 7:00-19:00 និងចុងសប្តាហ៍ 9:00-17:00, តាមទូរស័ព្ទ អ៊ីមែល ឬ TeamViewer ពីចម្ងាយ។ ប្រព័ន្ធ CRM ក្នុង RetailManager ក៏ជួយអ្នកកំណត់គោលដៅអតិថិជនត្រឹមត្រូវជាមួយការផ្សព្វផ្សាយ និងកាតសមាជិកភាព ដើម្បីឱ្យការគាំទ្រ និងកំណើនអាជីវកម្មដំណើរការជាមួយគ្នា។"
        : "Reach real support 7 days a week, Monday to Friday 7am-7pm and weekends 9am-5pm, by phone, email, or remote TeamViewer session. RetailManager's built-in CRM also helps you target the right customers with promotions, special offers, and loyalty barcodes, so support and growth work together.",
    },
  ];

  const relatedProducts = [
    {
      title: "RM Mobile",
      desc: isKm
        ? "គ្រប់គ្រងស្តុក និងការលក់ពីទូរស័ព្ទ ជាដៃគូនឹង RetailManager។"
        : "Manage stock and sales on the go with the mobile companion for RetailManager.",
      href: "https://www.aaapos.com/rm-mobile/",
    },
    {
      title: "Webstore Manager",
      desc: isKm
        ? "ធ្វើសមកាលកម្មហាងអនឡាញរបស់អ្នកជាមួយ RetailManager ដោយស្វ័យប្រវត្តិ។"
        : "Sync your online store with RetailManager automatically.",
      href: "https://www.aaapos.com/aaapos-webstore-manager/",
    },
    {
      title: "RM Multi-Store",
      desc: isKm
        ? "គ្រប់គ្រងទីតាំងហាងច្រើនកន្លែងពីប្រព័ន្ធកណ្តាលតែមួយ។"
        : "Manage multiple store locations from a single, centralized system.",
      href: "https://www.aaapos.com/rm-multistore/",
    },
  ];

  return (
    <>
      <style>{`
        .sv-word-wrap { display: inline-block; overflow: hidden; vertical-align: bottom; }
        .sv-word {
          display: inline-block;
          transform: translateY(110%);
          opacity: 0;
          transition: transform 0.55s cubic-bezier(0.77, 0, 0.175, 1),
                      opacity 0.15s ease;
        }
        .sv-entered .sv-word { transform: translateY(0); opacity: 1; }

        .sv-slide-up {
          transform: translateY(22px);
          opacity: 0;
          transition: transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94),
                      opacity 0.6s ease;
        }
        .sv-entered .sv-slide-up { transform: translateY(0); opacity: 1; }

        .sv-card-pop {
          transform: translateY(20px);
          opacity: 0;
          transition: transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1),
                      opacity 0.4s ease;
        }
        .sv-entered .sv-card-pop { transform: translateY(0); opacity: 1; }

        .sv-container {
          width: 100%;
          padding: 0 16px;
          margin: 0 auto;
        }
        @media (min-width: 640px)  { .sv-container { padding: 0 24px; } }
        @media (min-width: 1024px) { .sv-container { width: 88%; padding: 0; } }
        @media (min-width: 1280px) { .sv-container { width: 83%; } }
        @media (min-width: 1536px) { .sv-container { max-width: 1400px; } }
        @media (min-width: 1700px) { .sv-container { max-width: 1500px; } }
      `}</style>

      <div
        ref={sectionRef}
        className={`bg-white${entered ? " sv-entered" : ""}`}
      >
        {/* ── Intro ── */}
        <section className="pt-10 pb-4 md:pt-12 md:pb-6">
          <div className="sv-container">
            <div className="flex flex-col-reverse lg:flex-row items-center gap-8 lg:gap-12">
              <div className="flex-1 max-w-2xl">
                <div className="overflow-hidden mb-4">
                  <span
                    className="sv-slide-up inline-block text-[11px] font-bold uppercase tracking-[0.13em]"
                    style={{ color: "#0f8abe", transitionDelay: "0.05s" }}
                  >
                    {eyebrow}
                  </span>
                </div>
                <h1
                  className="font-extrabold leading-[1.15] mb-5"
                  style={{ fontSize: "clamp(28px, 4vw, 46px)", color: "#000000" }}
                >
                  <div className="overflow-hidden">
                    <SliceText text={headline1} inView={entered} baseDelay={0.1} />
                  </div>
                  <div className="overflow-hidden mt-1">
                    <SliceText text={headline2} inView={entered} baseDelay={0.25} />
                  </div>
                </h1>
                <p
                  className="sv-slide-up text-[15px] md:text-base leading-[1.8]"
                  style={{ color: "#000000", transitionDelay: "0.5s" }}
                >
                  {bodyText}
                </p>
              </div>

              <div className="sv-slide-up flex-1 w-full mx-auto lg:mx-0" style={{ transitionDelay: "0.3s" }}>
                <img
                  src={servicesImg}
                  alt=""
                  draggable={false}
                  className="w-full h-auto max-h-[320px] object-contain select-none mx-auto"
                />
              </div>
            </div>
          </div>
        </section>

        {/* ── Services (alternating image/text panels) ── */}
        <section className="py-2 md:py-4">
          <div className="sv-container flex flex-col gap-8 md:gap-12">
            {services.map((s, i) => (
              <div
                key={i}
                className="sv-card-pop grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center"
                style={{ transitionDelay: `${0.1 + i * 0.08}s` }}
              >
                <div className={`relative ${i % 2 === 1 ? "md:order-2" : ""}`}>
                  <img
                    src={s.image}
                    alt={s.title}
                    draggable={false}
                    className="relative w-full h-auto max-h-[520px] object-contain select-none mx-auto"
                  />
                </div>
                <div className={i % 2 === 1 ? "md:order-1" : ""}>
                  <h3
                    className="text-3xl md:text-4xl font-bold mb-5"
                    style={{ color: "#000000" }}
                  >
                    {s.title}
                  </h3>
                  <p className="text-base md:text-lg leading-[1.85]" style={{ color: "#000000" }}>
                    {s.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* ── Other AAAPOS Products ── */}
      <section className="pb-12 md:pb-16">
        <div className="sv-container">
          <div
            className="rounded-3xl py-10 px-6 md:py-12 md:px-12"
            style={{ background: "#0f8abe" }}
          >
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-8 md:mb-10">
              {isKm ? "ផលិតផលផ្សេងទៀតពី AAAPOS ដែលអ្នកអាចចាប់អារម្មណ៍" : "Other AAAPOS products you may like"}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {relatedProducts.map((p, i) => (
                <div key={i}>
                  <h3 className="text-lg font-bold text-white mb-2">{p.title}</h3>
                  <p className="text-sm text-white/80 leading-relaxed mb-5">{p.desc}</p>
                  <a
                    href={p.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block px-5 py-2.5 rounded-full text-sm font-semibold text-white"
                    style={{ background: "rgba(255,255,255,0.18)" }}
                  >
                    {isKm ? "ស្វែងយល់បន្ថែម" : "Learn More"}
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Services;