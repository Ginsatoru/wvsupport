import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { ChevronDown } from "lucide-react";

const FAQ = () => {
  const { i18n } = useTranslation();
  const isKm = i18n.language === "km";
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleQuestion = (index) => {
    setActiveIndex(index === activeIndex ? null : index);
  };

  const faqData = [
    {
      question: isKm ? "តើ RetailManager ជាអ្វី?" : "What is RetailManager?",
      answer: isKm
        ? "AAAPOS RetailManager (ដែលពីមុនហៅថា MYOB RetailManager) ជាកម្មវិធីចំណុចលក់ដែលទុកចិត្តបានដោយអ្នកលក់រាយអស់រយៈពេលជាង 25 ឆ្នាំ, ត្រូវបានប្រើប្រាស់ដោយអាជីវកម្មនៅទូទាំងអូស្ត្រាលី និយសេឡង់ អាស៊ី និងកោះប៉ាស៊ីហ្វិក។"
        : "AAAPOS RetailManager, formerly known as MYOB RetailManager, has been trusted by retailers for more than 25 years and is used by businesses across Australia, New Zealand, Asia, and the Pacific Islands.",
    },
    {
      question: isKm ? "តើមានផែនការតម្លៃអ្វីខ្លះ?" : "What pricing options are available?",
      answer: isKm
        ? "មានជម្រើសពីរ៖ ការជាវប្រចាំខែក្នុងតម្លៃ $75/ខែ (បង់ជាមុន $850 គ្របដណ្តប់ការដំឡើង និងខែដំបូង, រួមទាំងអាជ្ញាប័ណ្ណម៉ាស៊ីនច្រើនដោយគ្មានថ្លៃបន្ថែម), ឬអាជ្ញាប័ណ្ណជារៀងរហូតក្នុងតម្លៃ $1,995 ម្តង (រួមទាំងការគាំទ្រ និងបច្ចុប្បន្នភាព 12 ខែ, ម៉ាស៊ីនបន្ថែម $595 ក្នុងមួយ)។"
        : "There are two options: a monthly subscription at $75/month ($850 upfront covering setup and the first month, with multiple register licenses included at no extra cost), or a one-time perpetual license at $1,995 (including 12 months of support and upgrades, with additional registers at $595 each).",
    },
    {
      question: isKm ? "តើមានការគាំទ្រអ្វីខ្លះ?" : "What kind of support is included?",
      answer: isKm
        ? "ការគាំទ្រអាចរកបាន 7 ថ្ងៃក្នុងមួយសប្តាហ៍ តាមទូរស័ព្ទ អ៊ីមែល ឬការជួយពីចម្ងាយតាម TeamViewer, ចន្ទ័ដល់សុក្រ 7:00-19:00 និងចុងសប្តាហ៍ 9:00-17:00 (ម៉ោងអូស្ត្រាលី)។"
        : "Support is available 7 days a week via phone, email, or remote assistance using TeamViewer, Monday to Friday 7:00am-7:00pm and weekends 9:00am-5:00pm (Australian Eastern Standard Time).",
    },
    {
      question: isKm ? "តើខ្ញុំអាចលុបចោលបានពេលណាក៏បាន?" : "Can I cancel at any time?",
      answer: isKm
        ? "បាទ/ចាស, ផែនការជាវប្រចាំខែគ្មានកិច្ចសន្យារយៈពេលវែងឡើយ។ អ្នកអាចលុបចោលបានគ្រប់ពេល ដោយគ្មានលក្ខខណ្ឌចងភ្ជាប់រយៈពេលវែង។"
        : "Yes, the subscription plan has no long-term contracts. You can cancel at any time with no long-term commitment required.",
    },
    {
      question: isKm ? "តើ RetailManager ភ្ជាប់ជាមួយកម្មវិធីអ្វីខ្លះទៀត?" : "What does RetailManager integrate with?",
      answer: isKm
        ? "RetailManager ភ្ជាប់ជាមួយ MYOB និង XERO សម្រាប់គណនេយ្យ, Shopify, WooCommerce, eBay, BigCommerce សម្រាប់ហាងអនឡាញ, ព្រមទាំង EFTPOS ជាមួយ Tyro, Linkly, Westpac, Commonwealth Bank, ANZ, NAB និងធនាគារផ្សេងទៀត។"
        : "RetailManager integrates with MYOB and XERO for accounting, Shopify, WooCommerce, eBay, and BigCommerce for e-commerce, and EFTPOS providers including Tyro, Linkly, Westpac, Commonwealth Bank, ANZ, and NAB.",
    },
  ];

  return (
    <div className="bg-white">
      <div className="w-full px-4 sm:px-6 lg:px-0 py-16 md:py-20">
        <div className="mx-auto w-full lg:w-[88%] xl:w-[83%] 2xl:max-w-[1400px] [@media(min-width:1700px)]:max-w-[1500px]">
          <div className="max-w-3xl">
            <span
              className="inline-block text-[11px] font-bold uppercase tracking-[0.13em] mb-4"
              style={{ color: "#0f8abe" }}
            >
              {isKm ? "សំណួរញឹកញាប់" : "FAQ"}
            </span>
            <h1
              className="font-extrabold leading-[1.15] mb-4"
              style={{ fontSize: "clamp(28px, 4vw, 46px)", color: "#000000" }}
            >
              {isKm ? "សំណួរដែលសួរញឹកញាប់" : "Frequently Asked Questions"}
            </h1>
            <p className="text-[15px] leading-[1.8] mb-10" style={{ color: "#000000" }}>
              {isKm
                ? "នេះជាចម្លើយចំពោះសំណួរទូទៅមួយចំនួនអំពីសេវាកម្មរបស់យើង។ រកមិនឃើញអ្វីដែលអ្នកកំពុងស្វែងរក? ទាក់ទងមកយើងខ្ញុំដោយផ្ទាល់។"
                : "Answers to a few common questions about our services. Can't find what you're looking for? Reach out to us directly."}
            </p>
          </div>

          <div className="flex flex-col gap-3 max-w-3xl">
            {faqData.map((item, index) => {
              const isActive = index === activeIndex;
              return (
                <div
                  key={index}
                  className="rounded-2xl overflow-hidden"
                  style={{ background: "#f8fafc" }}
                >
                  <button
                    onClick={() => toggleQuestion(index)}
                    className="w-full flex items-center justify-between gap-4 text-left px-6 py-5"
                  >
                    <span className="text-base font-bold" style={{ color: "#000000" }}>
                      {item.question}
                    </span>
                    <ChevronDown
                      size={20}
                      style={{
                        color: "#000000",
                        flexShrink: 0,
                        transform: isActive ? "rotate(180deg)" : "rotate(0deg)",
                        transition: "transform 0.25s ease",
                      }}
                    />
                  </button>
                  <div
                    style={{
                      maxHeight: isActive ? "300px" : "0px",
                      overflow: "hidden",
                      transition: "max-height 0.3s ease",
                    }}
                  >
                    <p
                      className="px-6 pb-5 text-[15px] leading-[1.8]"
                      style={{ color: "#000000" }}
                    >
                      {item.answer}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQ;