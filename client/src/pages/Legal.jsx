import React from "react";
import { useTranslation } from "react-i18next";

const Legal = () => {
  const { i18n } = useTranslation();
  const isKm = i18n.language === "km";

  const sections = [
    {
      title: isKm ? "សេចក្តីស្វាគមន៍" : "Welcome",
      body: isKm
        ? "សូមស្វាគមន៍មកកាន់គេហទំព័ររបស់ WV Support Services Cambodia។ ដោយប្រើប្រាស់គេហទំព័រនេះ អ្នកយល់ព្រមតាមលក្ខខណ្ឌដែលបានរៀបរាប់ក្នុងទំព័រនេះ។ សូមអានលក្ខខណ្ឌទាំងនេះដោយប្រុងប្រយ័ត្នមុននឹងបន្តប្រើប្រាស់សេវាកម្មរបស់យើង។"
        : "Welcome to WV Support Services Cambodia. By using this website, you agree to be bound by the terms outlined on this page. Please read them carefully before continuing to use our services.",
    },
    {
      title: isKm ? "ការប្រើប្រាស់សេវាកម្ម" : "Use of Services",
      body: isKm
        ? "យើងផ្តល់សេវាកម្មគាំទ្របច្ចេកទេសពីចម្ងាយសម្រាប់ RetailManager ជូនអតិថិជននៅអូស្ត្រាលី និយសេឡង់ និងតំបន់អាស៊ី-ប៉ាស៊ីហ្វិក។ អ្នកយល់ព្រមប្រើប្រាស់សេវាកម្មទាំងនេះសម្រាប់គោលបំណងស្របច្បាប់តែប៉ុណ្ណោះ ហើយមិនធ្វើសកម្មភាពណាមួយដែលអាចប៉ះពាល់ដល់ប្រព័ន្ធ ឬអតិថិជនផ្សេងទៀតឡើយ។"
        : "We provide remote technical support services for RetailManager to clients across Australia, New Zealand, and the Asia-Pacific region. You agree to use these services only for lawful purposes and not to engage in any activity that could disrupt our systems or affect other clients.",
    },
    {
      title: isKm ? "កម្មសិទ្ធិបញ្ញា" : "Intellectual Property",
      body: isKm
        ? "មាតិកា និន្នការ និមិត្តសញ្ញា និងសម្ភារៈផ្សេងទៀតនៅលើគេហទំព័រនេះជាកម្មសិទ្ធិរបស់ WV Support Services Cambodia ឬដៃគូរបស់ខ្លួន ដូចជា AAAPOS RetailManager ជាដើម។ ការចម្លង ឬប្រើប្រាស់ឡើងវិញដោយគ្មានការអនុញ្ញាតជាលាយលក្ខណ៍អក្សរគឺមិនត្រូវបានអនុញ្ញាតឡើយ។"
        : "The content, branding, and materials on this website belong to WV Support Services Cambodia or its partners, including AAAPOS RetailManager. Copying or reusing this material without written permission is not permitted.",
    },
    {
      title: isKm ? "កម្រិតនៃការទទួលខុសត្រូវ" : "Limitation of Liability",
      body: isKm
        ? "WV Support Services Cambodia ខិតខំផ្តល់សេវាកម្មគាំទ្រយ៉ាងអាចទុកចិត្តបាន ប៉ុន្តែយើងមិនធានាថាសេវាកម្មនឹងគ្មានការរំខាន ឬកំហុសទាំងស្រុងឡើយ។ យើងមិនទទួលខុសត្រូវចំពោះការខាតបង់ណាមួយដែលកើតឡើងពីការប្រើប្រាស់ ឬការមិនអាចប្រើប្រាស់សេវាកម្មរបស់យើងបានឡើយ។"
        : "WV Support Services Cambodia works hard to provide reliable support, but we do not guarantee that our services will always be uninterrupted or error-free. We are not liable for any loss arising from your use of, or inability to use, our services.",
    },
    {
      title: isKm ? "ការផ្លាស់ប្តូរលក្ខខណ្ឌ" : "Changes to These Terms",
      body: isKm
        ? "យើងអាចធ្វើបច្ចុប្បន្នភាពលក្ខខណ្ឌទាំងនេះជាកាលៈទេសៈ។ ការបន្តប្រើប្រាស់គេហទំព័រ ឬសេវាកម្មរបស់យើងបន្ទាប់ពីមានការផ្លាស់ប្តូរ មានន័យថាអ្នកយល់ព្រមទទួលយកលក្ខខណ្ឌដែលបានធ្វើបច្ចុប្បន្នភាព។"
        : "We may update these terms from time to time. Continued use of our website or services after any changes means you accept the updated terms.",
    },
    {
      title: isKm ? "ទាក់ទងមកយើងខ្ញុំ" : "Contact Us",
      body: isKm
        ? "ប្រសិនបើអ្នកមានសំណួរអំពីលក្ខខណ្ឌទាំងនេះ សូមទាក់ទងមកយើងខ្ញុំតាមរយៈ wvservicescambodia@gmail.com ឬលេខទូរស័ព្ទ +855 974 839 135។"
        : "If you have any questions about these terms, please contact us at wvservicescambodia@gmail.com or +855 974 839 135.",
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
              {isKm ? "លក្ខខណ្ឌ" : "Legal"}
            </span>
            <h1
              className="font-extrabold leading-[1.15] mb-10"
              style={{ fontSize: "clamp(28px, 4vw, 46px)", color: "#000000" }}
            >
              {isKm ? "លក្ខខណ្ឌ និងលក្ខខណ្ឌប្រើប្រាស់" : "Terms & Conditions"}
            </h1>

            <div className="flex flex-col gap-10">
              {sections.map((s, i) => (
                <div key={i}>
                  <h2 className="text-xl font-bold mb-3" style={{ color: "#000000" }}>
                    {s.title}
                  </h2>
                  <p className="text-[15px] leading-[1.8]" style={{ color: "#000000" }}>
                    {s.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Legal;