import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const updateFontFamily = (lng) => {
  document.documentElement.style.setProperty(
    '--font-primary',
    lng === 'km' ? 'Dangrek, sans-serif' : 'Montserrat, sans-serif'
  );
};

const resources = {
  en: {
    translation: {
      font: 'Montserrat',
      // Services Page
      // Contact
      contactPage: {
        header: {
          title: "Contact Us",
          subtitle:
            "We're here to help, anytime you need support or have a question.",
        },
        loading: {
          text: "Loading contact page...",
          errorTitle: "Oops! We couldn't load the contact page.",
          errorDescription:
            "It looks like our server might be temporarily unavailable...",
        },
        form: {
          title: "How Can We Assist You?",
          successMessage:
            "Thank you for your message! We'll get back to you soon.",
          errorMessage: "Something went wrong. Please try again later.",
          recaptchaAlert: "Please verify the reCAPTCHA first.",
          name: {
            label: "Name",
            placeholder: "Enter your full name",
          },
          email: {
            label: "Email",
            placeholder: "Enter your full email address",
          },
          subject: {
            label: "Subject",
            placeholder: "Provide your main subject",
          },
          message: {
            label: "Tell us your issue",
            placeholder: "Describe your issue or question",
          },
          submit: {
            button: "Send Message",
            sending: "Sending...",
          },
        },
        contactInfo: {
          title: "Other ways to reach us",
        },
        contactMethods: {
          address: {
            title: "Address:",
            fallback: "Address not available",
          },
          phone: {
            title: "Phone:",
            fallback: "Phone not available",
          },
          email: {
            title: "Email:",
            fallback: "Email not available",
          },
        },
        businessHours: {
          title: "Business Hours",
          weekdays: "Monday - Friday: 7:00 AM - 4:00 PM",
          saturday: "Saturday: 7:00 AM - 1:30 PM",
          sunday: "Sunday: Closed",
        },
        map: {
          title: "Company Location",
        },
      },

      // Footer
      footer: {
        company: "Company",
        logo: "Logo",
        defaultDescription:
          "There are support request and service record custom post types, allowing you to easily create and manage support requests and service records.",
        aboutUs: "About Us",
        about: "About",
        legal: "Legal",
        contact: "Contact",
        project: "Project",
        careers: "Careers",
        usefulLinks: "Useful Links",
        browseToAAAPOS: "Browse to AAAPOS",
        partners: "Partners",
        faqs: "FAQs",
        support: "Support",
        newsletter: "Newsletter",
        newsletterText:
          "Get the latest WV Support Services Cambodia news delivered to your inbox.",
        emailPlaceholder: "Enter your email",
        recaptchaVerified: "Verified! Click 'Send' again",
        recaptchaFailed: "Verification failed.",
        invalidEmail: "Please enter a valid email address.",
        verifyHuman: "Please verify that you are a human.",
        somethingWrong: "Something went wrong. Please try again.",
        thanksForSubscribing: "Thanks for Subscribing!",
        subscriptionConfirmation:
          "We'll keep you posted with the latest updates and news.",
        close: "Close",
        copyright:
          "Copyright ©2025 All rights reserved | This website is developed by AAAPOS team",
        followUs: "Follow us",
      },
      // Achievements
      achievements: {
        title: "Our Achievements",
        subtitle:
          "At WV Support Services Cambodia, we proudly help businesses thrive by delivering reliable IT solutions and support.",
        yearsLabel: "Years of Trusted IT Support",
        ticketsLabel: "Successful Support Tickets Resolved",
        clientsLabel: "Satisfied Clients Across Cambodia",
        businessesLabel: "Businesses Supported Annually",
      },
      // Gallery
      gallery: {
        title: "Project Gallery",
        subtitle:
          "Browse through our international support initiatives and success stories",
        categories: {
          pos: "POS Support",
          webstore: "Webstore Integration",
          multistore: "Multi-Store Management",
        },
        locations: {
          australiaNZPNG: "Australia, New Zealand, Papua New Guinea",
          australiaNZ: "Australia, New Zealand",
          australiaCambodia: "Australia, Cambodia",
          canadaUSA: "Canada, USA",
          japanKorea: "Japan, South Korea",
          uk: "United Kingdom",
          us: "United States",
          europe: "Germany, France, Spain",
          latinAmerica: "Brazil, Argentina",
          global: "Europe, North America",
        },
        industries: {
          retailFashion: "Retail Fashion",
          homeGoods: "Home Goods",
          homeDecor: "Home Decoration",
          sportingGoods: "Sporting Goods",
          convenience: "Convenience Stores",
          specialty: "Specialty Retail",
          electronics: "Electronics",
          healthBeauty: "Health & Beauty",
          fashion: "Fashion Retail",
          luxury: "Luxury Goods",
        },
        items: {
          item1: {
            title: "RetailChain Global POS Deployment",
            description:
              "Implemented POS systems for 30K+ stores across Asia-Pacific",
          },
          item2: {
            title: "E-Commerce Platform Integration",
            description: "Integrated webstore with existing POS systems",
          },
          item3: {
            title: "Multi-Store Management System",
            description: "Centralized management for franchise operations",
          },
          item4: {
            title: "POS System Upgrade & Migration",
            description: "Migration to new POS with zero downtime",
          },
          item5: {
            title: "Omnichannel Retail Solution",
            description: "Integrated online and offline sales channels",
          },
          item6: {
            title: "Franchise Operations Support",
            description: "24/7 support for franchise network",
          },
          item7: {
            title: "Inventory Synchronization Solution",
            description: "Real-time inventory updates across all channels",
          },
          item8: {
            title: "POS Hardware Upgrade Project",
            description: "Modernized POS terminals for 500+ locations",
          },
          item9: {
            title: "Mobile POS Implementation",
            description: "Deployed mobile POS for pop-up stores and events",
          },
          item10: {
            title: "Global E-commerce Unification",
            description: "Standardized webstore platform across 15 countries",
          },
        },
      },
      // partner
      partners: {
        title: "Our Trusted Partners",
        subtitle:
          "We collaborate with industry leaders to deliver the best solutions for your business",
      },
      //Team
      team: {
        title: "Meet Our Team",
        subtitle:
          "Our Cambodia-based experts providing global technical support",
        defaultName: "Unknown",
        defaultPosition: "Position not specified",
        defaultAltText: "Team Member",
        retryButton: "Retry",
        emptyMessage: "No team members available at the moment.",
        error: {
          default: "Failed to load team members",
          server: "Server error: {{status}} - {{statusText}}",
          network: "Network error: No response from server",
          generic: "Error: {{message}}",
          noMembers: "No team members found",
        },
      },
      //Features Section translations
      features: {
        mainTitle: "Our Main Features",
        intro:
          "WV Support discovered AAAPOS needing reliable assistance. Without proper support, systems risk being misused or altered. We help keep everything running as originally designed.",
        organization: {
          title: "Organization",
          description:
            "A well-structured system ensures smooth, efficient operation.",
        },
        marketing: {
          title: "Marketing Strategy",
          description:
            "A smart marketing strategy targets the right audience for maximum impact.",
        },
        risk: {
          title: "Risk Analysis",
          description:
            "Identifying potential issues early helps prevent bigger problems later.",
        },
        capital: {
          title: "Capital Market",
          description:
            "A well-organized system ensures smooth and efficient operations.",
        },
        success: {
          imageAlt: "Success Story",
          title: "Read Our Success Story for Inspiration",
          paragraph1:
            "WV Support cuts through digital noise—delivering trusted, seamless solutions with care and precision. From complex systems to everyday fixes, we bridge technology and trust.",
          paragraph2:
            "On her way, she found a ticket. It warned that in support, messages are often rewritten until only clarity and the true solution remain.",
        },
        contactButton: "Contact Us",
      },

      // Customer Support Experience translations
      customerSupport: {
        title: "Customer Remote Support Experience",
        subtitle: "Remote troubleshooting support",
        description:
          "Our Remote Troubleshooting Support offers fast, reliable solutions for RetailManager POS issues, multi-store setups, and webstore integrations. Based in Siem Reap, Cambodia, we provide expert support to Australian clients—resolving software errors, connectivity problems, and database issues quickly to minimize downtime and keep your business running smoothly.",
        exploreMore: "Explore more",
        imageAlt: "RetailManager Troubleshooting",
        hoverTitle: "Customer Technical Support",
        hoverSubtitle: "Expert Remote Troubleshooting and Support Services",
      },

      // RetailManager Troubleshooting translations
      retailManager: {
        imageAlt: "RetailManager Troubleshooting",
        hoverTitle: "RetailManager Expertise",
        hoverSubtitle: "25+ years of collective troubleshooting experience",
        title: "RetailManager Troubleshooting Experience",
        subtitle: "We'd love to tell you about us",
        description:
          "Experienced in diagnosing and resolving RetailManager software issues with over 25 years of collective expertise. Skilled in troubleshooting errors, database issues, and system configurations. Proficient in guiding users through transaction, connectivity, and integration problems, with strong log analysis and support escalation skills.",
        exploreMore: "Explore more",
      },
      home: "Home",
      about: "About Us",
      contact: "Contact",
      project: "Projects",
      pages: "Pages",
      support: "Support",
      servicesnav: "Services",
      whoWeAre: "Who we are?",
      languageToggle: "Switch to Khmer",
      head: "Welcome to WV Support Services Cambodia",
      subtitle:
        "Cutting-edge IT solutions in Cambodia. We deliver premium support, network infrastructure, and software expertise to keep your business at the digital forefront from our Siem Reap headquarters.",
      language: "Languages",
      LearnMore: "Explore Our Services",
      Best: "Best Services",
      Our: "Our Services",
      get: "Get In Touch",
      Servicesub:
        "WV Support Services Cambodia delivers reliable IT support for RetailManager POS, Webstore Manager, online store integrations, and Multi-Store systems. We handle networking, troubleshooting, updates, and customization to keep your business running smoothly.",
      // New translations for OurServices component
      services: {
        header: {
          subtitle: "Best Solutions",
          title: "Our Services",
          description:
            "Complete business management solutions including POS systems, webstore management, multi-store operations, and professional email hosting.",
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
          description:
            "24/7 technical assistance and troubleshooting for all our products with fast response times and expert guidance.",
        },
        integration: {
          title: "System Integration",
          description:
            "Seamless integration of all systems and third-party applications to create a unified business management ecosystem.",
        },
      },
    },
  },
  km: {
    translation: {
      font: 'Dangrek',
      // Contact
      contactPage: {
        header: {
          title: "ទំនាក់ទំនងពួកយើង",
          subtitle:
            "យើងនៅទីនេះដើម្បីជួយ គ្រប់ពេលដែលអ្នកត្រូវការជំនួយ ឬមានសំណួរ។",
        },
        loading: {
          text: "កំពុងផ្ទុកទំព័រទំនាក់ទំនង...",
          errorTitle: "អូ៎! យើងមិនអាចផ្ទុកទំព័រទំនាក់ទំនងបានទេ។",
          errorDescription:
            "វាហាក់ដូចជាម៉ាស៊ីនបម្រើរបស់យើងប្រហែលជាមិនអាចប្រើប្រាស់បានបណ្តោះអាសន្ន។",
        },
        form: {
          title: "តើយើងអាចជួយអ្នកយ៉ាងដូចម្តេច?",
          successMessage:
            "សូមអរគុណសម្រាប់សាររបស់អ្នក! យើងនឹងតបសារទៅអ្នកឆាប់ៗនេះ។",
          errorMessage: "មានបញ្ហាអ្វីមួយ។ សូមព្យាយាមម្តងទៀតនៅពេលក្រោយ។",
          recaptchaAlert: "សូមផ្ទៀងផ្ទាត់ reCAPTCHA ជាមុនសិន។",
          name: {
            label: "ឈ្មោះ",
            placeholder: "បញ្ចូលឈ្មោះពេញរបស់អ្នក",
          },
          email: {
            label: "អ៊ីមែល",
            placeholder: "បញ្ចូលអាសយដ្ឋានអ៊ីមែលពេញរបស់អ្នក",
          },
          subject: {
            label: "ប្រធានបទ",
            placeholder: "ផ្តល់ប្រធានបទចម្បងរបស់អ្នក",
          },
          message: {
            label: "ប្រាប់យើងអំពីបញ្ហារបស់អ្នក",
            placeholder: "ពិពណ៌នាអំពីបញ្ហា ឬសំណួររបស់អ្នក",
          },
          submit: {
            button: "ផ្ញើសារ",
            sending: "កំពុងផ្ញើ...",
          },
        },
        contactInfo: {
          title: "វិធីផ្សេងៗទៀតដើម្បីទាក់ទងពួកយើង",
        },
        contactMethods: {
          address: {
            title: "អាសយដ្ឋាន៖",
            fallback: "អាសយដ្ឋានមិនមាន",
          },
          phone: {
            title: "ទូរស័ព្ទ៖",
            fallback: "ទូរស័ព្ទមិនមាន",
          },
          email: {
            title: "អ៊ីមែល៖",
            fallback: "អ៊ីមែលមិនមាន",
          },
        },
        businessHours: {
          title: "ម៉ោងធ្វើការ",
          weekdays: "ថ្ងៃច័ន្ទ ដល់ ថ្ងៃសុក្រ៖ ព្រឹក ៧:០០ ដល់ ល្ងាច ៤:០០",
          saturday: "ថ្ងៃសៅរ៍៖ ព្រឹក ៧:០០ ដល់ ថ្ងៃត្រង់ ១:៣០",
          sunday: "ថ្ងៃអាទិត្យ៖ បិទ",
        },
        map: {
          title: "ទីតាំងក្រុមហ៊ុន",
        },
      },

      // Footer
      footer: {
        company: "ក្រុមហ៊ុន",
        logo: "ឡូហ្គោ",
        defaultDescription:
          "មានប្រភេទប្រកាសផ្ទាល់ខ្លួនសម្រាប់សំណើគាំទ្រ និងកំណត់ត្រាសេវាកម្ម ដែលអនុញ្ញាតឱ្យអ្នកបង្កើត និងគ្រប់គ្រងសំណើគាំទ្រ និងកំណត់ត្រាសេវាកម្មដោយងាយស្រួល។",
        aboutUs: "អំពីយើង",
        about: "អំពី",
        legal: "ផ្នែកច្បាប់",
        contact: "ទំនាក់ទំនង",
        project: "គម្រោង",
        careers: "ការងារ",
        usefulLinks: "តំណភ្ជាប់មានប្រយោជន៍",
        browseToAAAPOS: "រកមើល AAAPOS",
        partners: "ដៃគូ",
        faqs: "សំណួរដែលគេសួរញឹកញាប់",
        support: "ការគាំទ្រ",
        newsletter: "ព្រឹត្តិប័ត្រព័ត៌មាន",
        newsletterText:
          "ទទួលព័ត៌មានចុងក្រោយរបស់ WV Support Services Cambodia នៅក្នុងប្រអប់អ៊ីមែលរបស់អ្នក។",
        emailPlaceholder: "បញ្ចូលអ៊ីមែលរបស់អ្នក",
        recaptchaVerified: "បានផ្ទៀងផ្ទាត់! ចុច 'ផ្ញើ' ម្តងទៀត",
        recaptchaFailed: "ការផ្ទៀងផ្ទាត់បានបរាជ័យ។",
        invalidEmail: "សូមបញ្ចូលអាសយដ្ឋានអ៊ីមែលត្រឹមត្រូវ។",
        verifyHuman: "សូមផ្ទៀងផ្ទាត់ថាអ្នកជាមនុស្ស។",
        somethingWrong: "មានបញ្ហាអ្វីមួយ។ សូមព្យាយាមម្តងទៀត។",
        thanksForSubscribing: "សូមអរគុណសម្រាប់ការជាវ!",
        subscriptionConfirmation:
          "យើងនឹងជូនដំណឹងដល់អ្នកជាមួយនឹងព័ត៌មានចុងក្រោយ និងព័ត៌មានថ្មីៗ។",
        close: "បិទ",
        copyright:
          "រក្សាសិទ្ធិ ©2025 រក្សាសិទ្ធិទាំងអស់ | គេហទំព័រនេះត្រូវបានអភិវឌ្ឍដោយក្រុម AAAPOS",
        followUs: "តាមដានយើង",
      },
      // Achievements
      achievements: {
        title: "ស្នាដៃរបស់យើង",
        subtitle:
          "នៅ WV Support Services Cambodia យើងមានមោទនភាពក្នុងការជួយឱ្យអាជីវកម្មរីកចម្រើនតាមរយៈការផ្តល់ដំណោះស្រាយ និងការគាំទ្របច្ចេកវិទ្យាដែលអាចទុកចិត្តបាន។",
        yearsLabel: "ឆ្នាំនៃការគាំទ្រ IT ដែលអាចទុកចិត្តបាន",
        ticketsLabel: "សំណើគាំទ្រដែលដោះស្រាយដោយជោគជ័យ",
        clientsLabel: "អតិថិជនដែលពេញចិត្តនៅទូទាំងកម្ពុជា",
        businessesLabel: "អាជីវកម្មដែលទទួលបានការគាំទ្រជារៀងរាល់ឆ្នាំ",
      },

      // Gallery
      gallery: {
        title: "វិចិត្រសាលគម្រោង",
        subtitle: "រុករកគម្រោងគាំទ្រអន្តរជាតិ និងរឿងជោគជ័យរបស់យើង",
        categories: {
          pos: "ការគាំទ្រ POS",
          webstore: "ការរួមបញ្ចូលហាងអនឡាញ",
          multistore: "ការគ្រប់គ្រងហាងច្រើន",
        },
        locations: {
          australiaNZPNG: "អូស្ត្រាលី, ញូវស៊ីលែន, ប៉ាពូអាស៊ីញូវហ្គីណេ",
          australiaNZ: "អូស្ត្រាលី, ញូវស៊ីលែន",
          australiaCambodia: "អូស្ត្រាលី, កម្ពុជា",
          canadaUSA: "កាណាដា, សហរដ្ឋអាមេរិក",
          japanKorea: "ជប៉ុន, កូរ៉េខាងត្បូង",
          uk: "ចក្រភពអង់គ្លេស",
          us: "សហរដ្ឋអាមេរិក",
          europe: "អាល្លឺម៉ង់, បារាំង, អេស្ប៉ាញ",
          latinAmerica: "ប្រេស៊ីល, អាហ្សង់ទីន",
          global: "អឺរ៉ុប, អាមេរិកខាងជើង",
        },
        industries: {
          retailFashion: "លក់រាយម៉ូដ",
          homeGoods: "ទំនិញផ្ទះ",
          homeDecor: "តុបតែងផ្ទះ",
          sportingGoods: "ឧបករណ៍កីឡា",
          convenience: "ហាងផ្តល់ភាពងាយស្រួល",
          specialty: "លក់រាយពិសេស",
          electronics: "អេឡិចត្រូនិច",
          healthBeauty: "សុខភាព និងសម្រស់",
          fashion: "លក់រាយម៉ូដ",
          luxury: "ទំនិញថ្លៃ",
        },
        items: {
          item1: {
            title: "ការដាក់ឱ្យដំណើរការប្រព័ន្ធ POS សាកល",
            description:
              "អនុវត្តប្រព័ន្ធ POS សម្រាប់ហាងចំនួន ៣០ពាន់+ នៅទូទាំងតំបន់អាស៊ី-ប៉ាស៊ីហ្វិក",
          },
          item2: {
            title: "ការរួមបញ្ចូលវេទិកាពាណិជ្ជកម្មអេឡិចត្រូនិច",
            description: "បានរួមបញ្ចូលហាងអនឡាញជាមួយប្រព័ន្ធ POS ដែលមានស្រាប់",
          },
          item3: {
            title: "ប្រព័ន្ធគ្រប់គ្រងហាងច្រើន",
            description: "ការគ្រប់គ្រងកណ្តាលសម្រាប់ប្រតិបត្តិការហាងច្រើន",
          },
          item4: {
            title: "ការធ្វើឱ្យប្រសើរឡើង និងផ្លាស់ប្តូរប្រព័ន្ធ POS",
            description: "ផ្លាស់ប្តូរទៅប្រព័ន្ធ POS ថ្មីដោយមិនមានពេលអសកម្ម",
          },
          item5: {
            title: "ដំណោះស្រាយលក់រាយពហុឆានែល",
            description: "បានរួមបញ្ចូលឆានែលលក់តាមអនឡាញ និងក្រៅអនឡាញ",
          },
          item6: {
            title: "ការគាំទ្រប្រតិបត្តិការហាងច្រើន",
            description: "ការគាំទ្រ 24/7 សម្រាប់បណ្តាញហាងច្រើន",
          },
          item7: {
            title: "ដំណោះស្រាយសមកាលកម្មស្តុក",
            description: "បច្ចុប្បន្នភាពស្តុកជាពេលវេលាពិតនៅទូទាំងឆានែលទាំងអស់",
          },
          item8: {
            title: "គម្រោងធ្វើឱ្យប្រសើរឡើងផ្នែករឹង POS",
            description: "បានធ្វើឱ្យទំនើបឧបករណ៍ POS សម្រាប់ទីតាំងចំនួន ៥០០+",
          },
          item9: {
            title: "ការអនុវត្ត POS ចល័ត",
            description:
              "បានដាក់ឱ្យដំណើរការ POS ចល័តសម្រាប់ហាងបណ្តោះអាសន្ន និងព្រឹត្តិការណ៍",
          },
          item10: {
            title: "ការធ្វើឱ្យស្តង់ដារពាណិជ្ជកម្មអេឡិចត្រូនិចសាកល",
            description:
              "បានធ្វើឱ្យស្តង់ដារវេទិកាហាងអនឡាញនៅទូទាំងប្រទេសចំនួន ១៥",
          },
        },
      },

      // partner
      partners: {
        title: "ដៃគូដែលអាចទុកចិត្តបានរបស់យើង",
        subtitle:
          "យើងសហការជាមួយអ្នកដឹកនាំក្នុងឧស្សាហកម្មដើម្បីផ្តល់ដំណោះស្រាយដ៏ល្អបំផុតសម្រាប់អាជីវកម្មរបស់អ្នក",
      },

      // Team
      team: {
        title: "សូមជួបជាមួយក្រុមការងាររបស់យើង",
        subtitle:
          "អ្នកជំនាញរបស់យើងដែលមានមូលដ្ឋាននៅកម្ពុជា ផ្តល់ការគាំទ្របច្ចេកទេសជាសាកល",
        defaultName: "មិនស្គាល់",
        defaultPosition: "មុខតំណែងមិនបានបញ្ជាក់",
        defaultAltText: "សមាជិកក្រុម",
        retryButton: "ព្យាយាមម្តងទៀត",
        emptyMessage: "មិនមានសមាជិកក្រុមនៅពេលនេះទេ។",
        error: {
          default: "មិនអាចទាញយកទិន្នន័យសមាជិកក្រុមបាន",
          server: "កំហុសម៉ាស៊ីនបម្រើ: {{status}} - {{statusText}}",
          network: "កំហុសបណ្តាញ: គ្មានការឆ្លើយតបពីម៉ាស៊ីនបម្រើ",
          generic: "កំហុស: {{message}}",
          noMembers: "រកមិនឃើញសមាជិកក្រុម",
        },
      },
      // Features Section translations
      features: {
        mainTitle: "លក្ខណៈពិសេសសំខាន់របស់យើង",
        intro:
          "WV Support បានរកឃើញ AAAPOS ដែលត្រូវការជំនួយដែលអាចទុកចិត្តបាន។ ដោយគ្មានការគាំទ្រត្រឹមត្រូវ ប្រព័ន្ធមានហានិភ័យនឹងត្រូវបានប្រើប្រាស់មិនត្រឹមត្រូវ ឬប្តូរ។ យើងជួយរក្សាអោយអ្វីៗដំណើរការតាមរចនាសម្ព័ន្ធដើម។",
        organization: {
          title: "រចនាសម្ព័ន្ធ",
          description:
            "ប្រព័ន្ធដែលមានរចនាសម្ព័ន្ធល្អធានាប្រតិបត្តិការដ៏រលូន និងមានប្រសិទ្ធភាព។",
        },
        marketing: {
          title: "យុទ្ធសាស្ត្រផ្សព្វផ្សាយ",
          description:
            "យុទ្ធសាស្ត្រផ្សព្វផ្សាយឆ្លាតវាស់វែងអ្នកទស្សនាដែលត្រឹមត្រូវដើម្បីទទួលបានឥទ្ធិពលអតិបរមា។",
        },
        risk: {
          title: "ការវិភាគហានិភ័យ",
          description:
            "ការកំណត់អត្តសញ្ញាណបញ្ហាដែលអាចកើតមានដំបូងអាចជួយការពារបញ្ហាធំជាងនេះក្រោយមក។",
        },
        capital: {
          title: "ទីផ្សារមូលធន",
          description:
            "ប្រព័ន្ធដែលមានរចនាសម្ព័ន្ធល្អធានាប្រតិបត្តិការដ៏រលូន និងមានប្រសិទ្ធភាព។",
        },
        success: {
          imageAlt: "រឿងជោគជ័យ",
          title: "អានរឿងជោគជ័យរបស់យើងដើម្បីការបំផុសគំនិត",
          paragraph1:
            "WV Support កាត់ចេញពីភាពមិនច្បាស់លាស់ឌីជីថល - ផ្តល់នូវដំណោះស្រាយដែលអាចទុកចិត្តបាន និងរលូនដោយការយកចិត្តទុកដាក់ និងភាពត្រឹមត្រូវ។ ពីប្រព័ន្ធស្មុគស្មាញដល់ការជួសជុលប្រចាំថ្ងៃ យើងភ្ជាប់បច្ចេកវិទ្យា និងទំនុកចិត្ត។",
          paragraph2:
            "នាងបានឃើញសំបុត្រមួយនៅតាមផ្លូវ។ វាបានព្រមានថានៅក្នុងការគាំទ្រ សារត្រូវបានសរសេរឡើងវិញរហូតដល់មានតែភាពច្បាស់លាស់ និងដំណោះស្រាយពិតប្រាកដនៅសល់។",
        },
        contactButton: "ទាក់ទងពួកយើង",
      },
      // Customer Support Experience translations
      customerSupport: {
        title: "បទពិសោធន៍គាំទ្រអតិថិជនពីចម្ងាយ",
        subtitle: "សេវាដោះស្រាយបញ្ហាពីចម្ងាយ",
        description:
          "សេវាដោះស្រាយបញ្ហាពីចម្ងាយរបស់យើងផ្តល់នូវដំណោះស្រាយរហ័ស និងអាចទុកចិត្តបានសម្រាប់បញ្ហា RetailManager POS ការដំឡើងហាងច្រើន និងការរួមបញ្ចូលហាងអនឡាញ។ មានមូលដ្ឋាននៅសៀមរាប កម្ពុជា យើងផ្តល់ការគាំទ្រពីអ្នកជំនាញដល់អតិថិជនអូស្ត្រាលី - ដោះស្រាយកំហុសផ្នែកទន់ បញ្ហាភ្ជាប់ និងបញ្ហាមូលដ្ឋានទិន្នន័យយ៉ាងឆាប់រហ័ស ដើម្បីកាត់បន្ថយពេលវេលារងចាំ និងរក្សាអាជីវកម្មរបស់អ្នកដំណើរការដោយរលូន។",
        exploreMore: "ស្វែងយល់បន្ថែម",
        imageAlt: "ការដោះស្រាយបញ្ហា RetailManager",
        hoverTitle: "ការគាំទ្របច្ចេកទេសអតិថិជន",
        hoverSubtitle: "សេវាដោះស្រាយបញ្ហាពីចម្ងាយ និងសេវាគាំទ្រពីអ្នកជំនាញ",
      },

      // RetailManager Troubleshooting translations
      retailManager: {
        imageAlt: "ការដោះស្រាយបញ្ហា RetailManager",
        hoverTitle: "ជំនាញ RetailManager",
        hoverSubtitle: "ពិសោធន៍ដោះស្រាយបញ្ហាជាង 25 ឆ្នាំ",
        title: "បទពិសោធន៍ដោះស្រាយបញ្ហា RetailManager",
        subtitle: "យើងចង់ប្រាប់អ្នកអំពីពួកយើង",
        description:
          "មានបទពិសោធន៍ក្នុងការវាយតម្លៃ និងដោះស្រាយបញ្ហាផ្នែកទន់ RetailManager ជាមួយនឹងជំនាញជាង 25 ឆ្នាំ។ មានជំនាញក្នុងការដោះស្រាយកំហុស បញ្ហាមូលដ្ឋានទិន្នន័យ និងការកំណត់រចនាសម្ព័ន្ធប្រព័ន្ធ។ ពូកែក្នុងការណែនាំអ្នកប្រើប្រាស់ដោះស្រាយបញ្ហាទាក់ទងនឹងប្រតិបត្តិការ ការភ្ជាប់ និងការរួមបញ្ចូលប្រព័ន្ធ ជាមួយនឹងជំនាញវិភាគកំណត់ហេតុ និងការលើកកំរិតជំនួយ។",
        exploreMore: "ស្វែងយល់បន្ថែម",
      },

      get: "ទំនាក់ទំនង",
      Servicesub:
        "WV Support Services Cambodia ផ្តល់សេវាគាំទ្របច្ចេកវិទ្យាដោយជឿជាក់ សម្រាប់ប្រព័ន្ធ RetailManager POS, Webstore Manager, ការរួមបញ្ចូលហាងអនឡាញ និងប្រព័ន្ធ Multi-Store។ យើងដោះស្រាយបណ្តាញ ការជួសជុលបញ្ហា ការធ្វើបច្ចុប្បន្នភាព និងការផ្ទាល់ខ្លួនរបស់ប្រព័ន្ធ ដើម្បីធ្វើឱ្យអាជីវកម្មរបស់អ្នកដំណើរការបានយ៉ាងរលូន។",
      Our: "សេវាកម្មពួកយើង",
      Best: "សេវាកម្មល្អៗ",
      contact: "ទំនាក់ទំនង",
      LearnMore: "ស្វែងយល់ពីសេវាកម្ម",
      Languages: "ភាសារ",
      home: "ទំព័រដើម",
      about: "អំពីយើង",
      project: "គម្រោង",
      pages: "ទំព័រ",
      support: "ការគាំទ្រ",
      servicesnav: "សេវាកម្ម",
      whoWeAre: "យើងជានរណា?",
      languageToggle: "ប្តូរជាអង់គ្លេស",
      head: "ស្វាគម៍មកកាន់ WV Support Services Cambodia",
      subtitle:
        "ដំណោះស្រាយបច្ចេកវិទ្យាថ្មីៗនៅកម្ពុជា យើងផ្តល់សេវាគាំទ្រថ្នាក់ពិសេស ដំណាក់កាលបណ្ដាញ និងជំនាញផ្នែកទន់ ដើម្បីរក្សាឱ្យអាជីវកម្មរបស់អ្នកនៅជាចម្បងនៃយុគឌីជីថល ពីការិយាល័យធំរបស់យើងនៅសៀមរាប។",
      // New translations for OurServices component
      services: {
        header: {
          subtitle: "ដំណោះស្រាយល្អបំផុត",
          title: "សេវាកម្មរបស់យើង",
          description:
            "ដំណោះស្រាយគ្រប់គ្រងអាជីវកម្មពេញលេញ រួមមានប្រព័ន្ធ POS ការគ្រប់គ្រងហាងអនឡាញ ប្រតិបត្តិការហាងច្រើន និងសេវាផ្ទុកអ៊ីមែលអាជីព។",
        },
        pos: {
          title: "ប្រព័ន្ធចំណុចលក់ (POS)",
          description:
            "ដំណោះស្រាយគ្រប់គ្រងអាជីវកម្មពិសេសរួមមានការតាមដានស្តុក របាយការណ៍លក់ និងលក្ខណៈពិសេសគ្រប់គ្រងអតិថិជន។",
        },
        webstore: {
          title: "កម្មវិធីគ្រប់គ្រងហាងអនឡាញ",
          description:
            "វេទិកាពាណិជ្ជកម្មអេឡិចត្រូនិចពេញលេញដើម្បីគ្រប់គ្រងហាងអនឡាញ ផលិតផល ការបញ្ជាទិញ និងទំនាក់ទំនងអតិថិជនរបស់អ្នកយ៉ាងស៊ីសង្វាក់។",
        },
        multistore: {
          title: "ការគ្រប់គ្រងហាងច្រើន",
          description:
            "ប្រព័ន្ធគ្រប់គ្រងកណ្តាលសម្រាប់ទីតាំងលក់រាយច្រើនជាមួយនឹងរបាយការណ៍ និងការគ្រប់គ្រងស្តុករួម។",
        },
        hosting: {
          title: "សេវាផ្ទុក",
          description:
            "ដំណោះស្រាយផ្ទុកអ៊ីមែលអាជីពជាមួយដែនផ្ទាល់ខ្លួន លក្ខណៈពិសេសសុវត្ថិភាព និងពេលដំណើរការដែលអាចទុកចិត្តបានសម្រាប់អាជីវកម្មរបស់អ្នក។",
        },
        support: {
          title: "ការគាំទ្របច្ចេកទេស",
          description:
            "ជំនួយបច្ចេកទេស 24/7 និងការដោះស្រាយបញ្ហាសម្រាប់ផលិតផលទាំងអស់របស់យើងជាមួយនឹងពេលវេលាឆ្លើយតបរហ័ស និងការណែនាំពីអ្នកជំនាញ។",
        },
        integration: {
          title: "ការរួមបញ្ចូលប្រព័ន្ធ",
          description:
            "ការរួមបញ្ចូលយ៉ាងស៊ីសង្វាក់នៃប្រព័ន្ធទាំងអស់ និងកម្មវិធីភាគីទីបីដើម្បីបង្កើតប្រព័ន្ធគ្រប់គ្រងអាជីវកម្មរួមមួយ។",
        },
      },
    },
  },
};

function setHtmlLang(lng) {
  if (typeof document !== "undefined" && document.documentElement) {
    // Use setTimeout to defer update and avoid race conditions
    setTimeout(() => {
      document.documentElement.lang = lng;
    }, 0);
  }
}

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: "en",
    fallbackLng: "en",
    interpolation: {
      escapeValue: false,
    },
  });

  // Set initial font
updateFontFamily(i18n.language);

// Listen to language changes and force update lang attr
i18n.on('languageChanged', updateFontFamily);

export default i18n;
