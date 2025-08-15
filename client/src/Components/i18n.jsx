import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const updateFontFamily = (lng) => {
  document.documentElement.style.setProperty(
    "--font-primary",
    lng === "km" ? "Dangrek, sans-serif" : "Montserrat, sans-serif"
  );
};

const resources = {
  en: {
    translation: {
      font: "Montserrat",
      // Careers Page translations
      careersPage: {
        hero: {
          title: "Join Our Growing Team",
          subtitle:
            "Be part of something amazing. We're building the future of business solutions in Cambodia.",
        },
        whyWorkWithUs: {
          title: "Why Work With Us?",
          description:
            "At WV Support Services Cambodia, we believe in creativity, collaboration, and growth. We're passionate about building a team that feels like family while achieving remarkable things together.",
          values: {
            innovation: {
              title: "Innovation",
              description: "Cutting-edge projects",
            },
            collaboration: {
              title: "Collaboration",
              description: "Team-oriented culture",
            },
            security: {
              title: "Security",
              description: "Stable environment",
            },
            growth: {
              title: "Growth",
              description: "Career development",
            },
          },
        },
        contact: {
          address: "Phum Thmey, Sangkat Svay Dankum, Siem Reap Cambodia",
        },
        openings: {
          title: "Current Openings",
        },
        positions: {
          customerSupport: {
            title: "Customer Support Specialist",
            type: "Full-time",
            location: "Siem Reap, Cambodia",
            description: {
              paragraph1:
                "WV Support Services is a software support company serving customers throughout Australia, New Zealand, and the Asia/Pacific Region. As a Customer Support Specialist, you'll be the frontline of our customer experience. You'll handle inquiries via phone, email, and chat, providing solutions that delight our clients.",
              paragraph2:
                "This role requires troubleshooting technical issues, guiding customers through our products, and documenting solutions for our knowledge base. You'll work closely with our product team to communicate customer needs and feedback.",
              paragraph3:
                "We're looking for someone with a minimum of 1 year customer service experience, excellent problem-solving skills, and patience in handling diverse customer personalities. Computer knowledge is required. Bilingual candidates are highly preferred.",
              paragraph4:
                "You should be able to speak, read, and write English fluently and have excellent communication skills combined with a nice, friendly personality. The ability to work in a team environment is essential.",
              paragraph5:
                "Working hours are Monday to Friday, 6am to 3pm (with a 1-hour lunch break), plus 6am to 1pm on two Saturdays per month. The working week is 43 hours.",
            },
            requirements: {
              experience: "Minimum 1 year customer service experience",
              computerKnowledge: "Computer knowledge is required",
              englishFluency: "Fluent in English (speaking, reading, writing)",
              communication:
                "Excellent verbal and written communication skills",
              teamwork:
                "Friendly personality and ability to work in a team environment",
              troubleshooting: "Technical troubleshooting skills",
              shiftWork: "Ability to work rotating shifts, including Saturdays",
            },
            benefits: {
              salary: "Competitive salary",
              bonuses: "Performance bonuses",
              insurance: "Comprehensive health insurance included",
              leave: "Annual leave and public holidays as per Cambodian laws",
              career: "Opportunity to learn and advance your career",
              technology: "Work with the latest technology",
              flexibility: "Flexible work arrangements",
            },
            contact: {
              address: "Phum Thmey, Sangkat Svay Dankum, Siem Reap, Cambodia",
            },
          },
          backendDeveloper: {
            title: "Backend Developer",
            type: "Full-time",
            location: "Remote (Cambodia-based)",
            description: {
              paragraph1:
                "Join our engineering team to design, develop, and maintain the backend services that power our applications. You'll work with modern technologies including Node.js, Express, MongoDB, and AWS services.",
              paragraph2:
                "Responsibilities include implementing new features, optimizing performance, writing unit tests, and participating in code reviews. You'll collaborate with frontend developers to create seamless integrations.",
              paragraph3:
                "Ideal candidates have 3+ years of backend development experience, strong knowledge of RESTful API design, and experience with database optimization. Open source contributions are a plus.",
            },
            requirements: {
              nodejs: "3+ years Node.js experience",
              database: "Proficient with MongoDB/PostgreSQL",
              aws: "Experience with AWS services",
              cicd: "Understanding of CI/CD pipelines",
            },
            benefits: {
              compensation: "Above-market compensation",
              stocks: "Stock options package",
              training: "Conference/training budget",
              remote: "Remote work options",
            },
          },
          uiuxDesigner: {
            title: "UI/UX Designer",
            type: "Contract",
            location: "Siem Reap, Cambodia",
            description: {
              paragraph1:
                "As our UI/UX Designer, you'll lead the design of our digital products from concept to implementation. You'll conduct user research, create wireframes and prototypes, and collaborate with developers to bring designs to life.",
              paragraph2:
                "You'll establish and maintain our design system, ensuring consistency across all platforms. We value designers who can balance aesthetic appeal with functional usability.",
              paragraph3:
                "The perfect candidate has 3+ years of product design experience, proficiency in Figma/Sketch, and a portfolio demonstrating user-centered design solutions. Experience with front-end development is a bonus.",
            },
            requirements: {
              experience: "3+ years UI/UX design experience",
              tools: "Expertise in Figma/Sketch",
              portfolio: "Strong portfolio of work",
              designSystems: "Understanding of design systems",
            },
            benefits: {
              freedom: "Creative freedom on projects",
              hardware: "Latest hardware/software",
              schedule: "Flexible schedule",
              retreat: "Annual design retreat",
            },
          },
          marketingSpecialist: {
            title: "Marketing Specialist",
            type: "Full-time",
            location: "Siem Reap, Cambodia",
            description: {
              paragraph1:
                "Our Marketing Specialist will develop and execute campaigns across digital and traditional channels. You'll create content, manage social media, analyze performance metrics, and help shape our brand voice.",
              paragraph2:
                "This role involves coordinating with external agencies, planning events, and developing strategies to increase brand awareness and customer acquisition.",
              paragraph3:
                "We're looking for someone with 2+ years in digital marketing, strong writing skills, and experience with analytics tools. Video editing and graphic design skills are advantageous.",
            },
            requirements: {
              experience: "2+ years marketing experience",
              analytics: "Proficiency in digital analytics",
              copywriting: "Excellent copywriting skills",
              socialMedia: "Social media management",
            },
            benefits: {
              bonuses: "Performance-based bonuses",
              budget: "Creative campaign budgets",
              networking: "Networking opportunities",
              travel: "Travel for industry events",
            },
          },
        },
        buttons: {
          viewDetails: "View Details",
          close: "Close",
          applyNow: "Apply Now",
          sendResume: "Send Us Your Resume",
          understood: "Understood",
        },
        modal: {
          positionOverview: "Position Overview",
          requirements: "Requirements",
          benefits: "Benefits",
        },
        footer: {
          noMatch: "Don't see the perfect match for your skills?",
        },
        unavailableModal: {
          title: "Position Unavailable",
          message:
            "We're sorry, but this job position is currently unavailable. Please check back later or explore our other open positions.",
        },
      },
      // New FAQ Page translations
      faqPage: {
        hero: {
          title: "Frequently Asked Questions",
          description:
            "Here are some of the most commonly asked questions. If you don't see the answer to your question, feel free to contact us!",
        },
        questions: {
          whatIsService: {
            question: "What is your service?",
            answer:
              "We provide a full range of IT solutions, including web development, mobile applications, and consulting services.",
          },
          contactSupport: {
            question: "How can I contact support?",
            answer:
              "You can reach out to our support team by email or by clicking the 'Contact Support' button on our website.",
          },
          discounts: {
            question: "Do you offer any discounts?",
            answer:
              "We offer discounts for long-term partnerships and bulk purchases. Please contact us for more details.",
          },
          refundPolicy: {
            question: "What is your refund policy?",
            answer:
              "We offer a 30-day money-back guarantee for all of our services. If you are not satisfied, you can get a full refund.",
          },
          freeTrial: {
            question: "Can I get a free trial?",
            answer:
              "Yes! We offer a 7-day free trial for most of our services so that you can test them out before committing.",
          },
        },
      },
      // Partner Page
      partnerPage: {
        hero: {
          title: "Our Trusted Partners",
          subtitle:
            "We collaborate with leading organizations to deliver top-notch solutions and innovations.",
        },
        partnerLogos: {
          altText: "{{name}} logo",
        },
        cta: {
          title: "Let's Build the Future Together",
          subtitle:
            "Interested in partnering with us? We'd love to hear from you.",
          buttonText: "Contact Our Team",
        },
      },
      // Legal Page
      legalPage: {
        title: "Terms & Conditions",
        welcome: {
          title: "Welcome",
          description:
            "Thank you for choosing WV Support Services Cambodia. By accessing our website, you agree to be bound by these terms and conditions.",
        },
        useOfServices: {
          title: "Use of Our Services",
          description:
            "You agree to use our website responsibly. Any misuse or unauthorized use is strictly prohibited.",
        },
        intellectualProperty: {
          title: "Intellectual Property",
          description:
            "All content, including logos, images, and written material, is owned by WV Support Services Cambodia and protected under copyright laws.",
        },
        limitationOfLiability: {
          title: "Limitation of Liability",
          description:
            "We are not liable for any damages that may occur from using our website or services.",
        },
        changes: {
          title: "Changes",
          description:
            "We may update these terms at any time. Continued use after changes means you accept the new terms.",
        },
        contactUs: {
          title: "Contact Us",
          description: "Have questions? Reach out to us at support@aaapos.com.",
        },
      },
      // Who We Are
      whoWeArePage: {
        hero: {
          title: "Who We Are?",
          subtitle:
            "We're the spark of ideas, the force of transformation, and the heart of innovation.",
        },
        vision: {
          title: "Our Vision",
          description:
            "To be a force of creativity and innovation, transforming industries and lives through digital experiences that are simple, human, and impactful.",
        },
        mission: {
          title: "Our Mission",
          description:
            "We craft meaningful solutions that connect people, solve problems, and inspire growth — one project at a time. Every product we build is rooted in purpose and driven by user-focused design.",
        },
        coreValues: {
          title: "Our Core Values",
          curiosity: {
            title: "Curiosity",
            description: "We ask questions and explore new paths fearlessly.",
          },
          integrity: {
            title: "Integrity",
            description: "We do what's right, not what's easy.",
          },
          collaboration: {
            title: "Collaboration",
            description:
              "We believe in the power of shared ideas and open hearts.",
          },
          excellence: {
            title: "Excellence",
            description: "We sweat the small stuff — details matter.",
          },
          empathy: {
            title: "Empathy",
            description: "We build with people, for people.",
          },
        },
        culture: {
          title: "Our Culture",
          description:
            "We're remote but connected. Professional but fun. Focused but flexible. Our culture is built on trust, creativity, and an unshakable belief that the best work comes from teams who feel like family.",
        },
        cta: {
          title: "Let's Build Something Meaningful",
          description:
            "Whether you're a dreamer, a doer, or a partner, we'd love to connect. Join us as we create a future fueled by creativity, technology, and heart.",
          buttonText: "Get In Touch",
        },
      },

      // Support
      supportPage: {
        hero: {
          title: "Premium Support Services",
          subtitle:
            "Expert technical assistance tailored to your RetailManager ecosystem, ensuring seamless operations and maximum uptime.",
        },
        services: {
          sectionTitle: "Our Comprehensive Support",
          remoteTroubleshooting: {
            title: "Remote Troubleshooting",
            description:
              "Immediate assistance for your RetailManager system with secure remote access and real-time diagnostics.",
            altText: "Remote support",
            features: {
              responseTime: "Under 15 minute response for critical issues",
              encryption: "Military-grade encrypted connections",
              availability: "24/7 availability for emergencies",
            },
          },
          systemOptimization: {
            title: "System Optimization",
            description:
              "Proactive maintenance and performance tuning to keep your RetailManager running at peak efficiency.",
            altText: "System optimization",
            features: {
              database: "Database optimization",
              integration: "Integration health checks",
              reporting: "Custom reporting setup",
            },
          },
          dedicatedTeam: {
            title: "Dedicated Team",
            description:
              "Our Siem Reap-based specialists combine technical expertise with deep RetailManager knowledge.",
            altText: "Team support",
            features: {
              australiaFacing: "Australia-facing support",
              bilingual: "Bilingual technicians",
              cultural: "Cultural understanding",
            },
          },
        },
        stats: {
          sectionTitle: "Our Performance Metrics",
          availability: {
            value: "24/7",
            description: "Availability for critical issues",
          },
          resolution: {
            value: "98%",
            description: "First-contact resolution rate",
          },
          responseTime: {
            value: "15min",
            description: "Average response time",
          },
          systemsSupported: {
            value: "500+",
            description: "Systems supported annually",
          },
        },
        process: {
          sectionTitle: "Our Support Process",
          initialContact: {
            title: "Initial Contact",
            description:
              "Reach us via phone, email, or our support portal. Our system automatically prioritizes your request based on urgency and impact to your business operations.",
          },
          diagnosticAnalysis: {
            title: "Diagnostic Analysis",
            description:
              "We perform comprehensive remote diagnostics using advanced tools to quickly identify the root cause, whether it's software, hardware, or integration related.",
          },
          solutionImplementation: {
            title: "Solution Implementation",
            description:
              "After your approval, we implement the solution while maintaining full communication throughout the process, with options for after-hours support when needed.",
          },
          verificationFollowup: {
            title: "Verification & Follow-up",
            description:
              "We confirm the resolution with you and schedule any necessary follow-up to ensure continued stability, including optional training for your staff.",
          },
        },
      },
      // Projects
      projectsPage: {
        hero: {
          title: "Our Projects",
          subtitle:
            "Over 25 years of retail management excellence - delivering RetailManager POS solutions across Australia, New Zealand, and the Pacific Islands",
        },

        section: {
          title: "Featured Project Implementations",
          description:
            "Discover how AAAPOS RetailManager has transformed businesses with comprehensive POS solutions, e-commerce integrations, and expert support",
        },

        filters: {
          all: "All",
          posImplementation: "POS Implementation",
          ecommerceIntegration: "E-commerce Integration",
          businessMigration: "Business Migration",
          supportTraining: "Support & Training",
        },

        categories: {
          posimplementation: "POS Implementation",
          ecommerceintegration: "E-commerce Integration",
          businessmigration: "Business Migration",
          supporttraining: "Support & Training",
        },

        projects: {
          retailManagerMultiStore: {
            title: "RetailManager Multi-Store Deployment",
            description:
              "Successfully deployed AAAPOS RetailManager across 25+ retail locations with centralized inventory management and real-time reporting.",
            location: "Melbourne, Sydney, Brisbane",
            industry: "Fashion Retail Chain",
          },

          shopifyWooCommerce: {
            title: "Shopify & WooCommerce Integration",
            description:
              "Integrated RetailManager POS with multiple e-commerce platforms using AAAPOS Webstore Manager for seamless inventory synchronization.",
            location: "Auckland, Wellington",
            industry: "Home & Garden",
          },

          myobMigration: {
            title: "MYOB RetailManager Migration",
            description:
              "Migrated legacy MYOB RetailManager systems to latest AAAPOS RetailManager with zero data loss and minimal downtime.",
            location: "Gold Coast, Sunshine Coast",
            industry: "Electronics & Technology",
          },

          eftposIntegration: {
            title: "EFTPOS Integration Project",
            description:
              "Implemented comprehensive EFTPOS integration with major Australian banks including CBA, ANZ, Westpac, and NAB for streamlined payment processing.",
            location: "Perth, Adelaide",
            industry: "Specialty Retail",
          },

          ebayBigCommerce: {
            title: "eBay & BigCommerce Integration",
            description:
              "Connected RetailManager POS with eBay and BigCommerce platforms for unified multi-channel retail management and automated order processing.",
            location: "Darwin, Alice Springs",
            industry: "Sporting Goods",
          },

          support247: {
            title: "24/7 Support Implementation",
            description:
              "Established comprehensive 7-day support system with phone, email, and TeamViewer remote assistance for Pacific Island retailers.",
            location: "Fiji, Papua New Guinea, Vanuatu",
            industry: "Tourism & Hospitality",
          },

          agriculturalRetail: {
            title: "Agricultural Retail System",
            description:
              "Specialized RetailManager deployment for agricultural retailers with integration to Nutrien Ag CRT for streamlined rural trading operations.",
            location: "Regional Queensland, NSW",
            industry: "Agricultural Supplies",
          },

          xeroIntegration: {
            title: "XERO Accounting Integration",
            description:
              "Seamless integration between RetailManager POS and XERO accounting software for automated financial reporting and GST management.",
            location: "Canberra, Hobart",
            industry: "Health & Beauty",
          },
        },

        learnMore: "Learn more ➔",
      },
      // About us
      aboutPage: {
        hero: {
          title: "About",
          company: "WV Support",
          subtitle:
            "Bridging Cambodian talent with global opportunities through exceptional IT support",
        },

        mission: {
          label: "OUR MISSION",
          title: {
            part1: "Empowering Cambodian",
            part2: "Tech Talent",
          },
          description:
            "WV Support Services Cambodia specializes in providing world-class IT support services to Australian businesses while creating meaningful opportunities for Cambodian professionals.",
          benefits: {
            competitive: "Competitive benefits and growth opportunities",
            technology: "Cutting-edge technology environment",
            platform: "Global platform for Cambodian innovation",
            satisfaction: "Unmatched customer satisfaction",
          },
          conclusion:
            "We're building a future where Cambodian tech professionals compete on the global stage.",
          location: "Siem Reap, Cambodia",
          imageTitle: "Our Professional Environment",
          imageAlt: "Our team",
        },

        timeline: {
          label: "OUR JOURNEY",
          title: {
            part1: "Building",
            part2: "Trust",
            part3: "Since 2021",
          },
          items: {
            founded: {
              year: "2021",
              title: "Founded in Siem Reap",
              content:
                "WV Support Services Cambodia was established with a vision to connect Cambodian talent with global opportunities.",
            },
            expanding: {
              year: "2024",
              title: "Expanding Our Reach",
              content:
                "Now serving over 10,000 customers with a dedicated team of IT professionals.",
            },
            future: {
              year: "Future",
              title: "Continuing Innovation",
              content:
                "We're committed to growing our impact and expanding our services across the region.",
            },
          },
        },

        vision: {
          label: "OUR VISION",
          title: {
            part1: "Shaping the",
            part2: "Future",
            part3: "of IT Support",
          },
          subtitle:
            "We envision a world where Cambodian tech talent is recognized globally for its excellence and innovation.",
          items: {
            empowerment: {
              title: "Empowerment",
              description:
                "Creating career paths for Cambodian professionals in the tech industry",
            },
            excellence: {
              title: "Excellence",
              description:
                "Delivering premium IT support services with Cambodian expertise",
            },
            globalReach: {
              title: "Global Reach",
              description:
                "Connecting local talent with international opportunities",
            },
            growth: {
              title: "Growth",
              description:
                "Fostering continuous learning and professional development",
            },
            impact: {
              title: "Impact",
              description:
                "Making a measurable difference in Cambodia's tech ecosystem",
            },
            innovation: {
              title: "Innovation",
              description: "Pioneering new approaches to IT support services",
            },
          },
        },

        cta: {
          title: "Join Our Growing Team",
          description:
            "We're always looking for talented professionals to join our mission of showcasing Cambodian tech excellence.",
          buttonText: "Explore Career Opportunities",
        },
      },
      // Services Page
      servicesPage: {
        hero: {
          title: "Our Services",
          subtitle:
            "Comprehensive tools to streamline your retail operations and boost your business performance.",
        },
        services: {
          retailManagerPos: {
            title: "RetailManager POS",
            description:
              "Comprehensive point-of-sale solutions for retail businesses.",
            details:
              "Custom setup, barcode scanning, receipt printing, and payment processing.",
          },
          webstoreIntegration: {
            title: "WebStore Integration",
            description:
              "Seamless integration between your physical and online stores.",
            details:
              "Real-time inventory sync, order management, and customer data integration.",
          },
          multiStoreManagement: {
            title: "Multi-Store Management",
            description:
              "Centralized control for businesses with multiple locations.",
            details:
              "Unified reporting, inventory transfers, and consolidated purchasing.",
          },
          webHostingService: {
            title: "Web Hosting Service",
            description:
              "Reliable and scalable hosting solutions for your websites.",
            details:
              "High uptime, fast loading speeds, domain support, and easy management tools.",
          },
          reportingAnalytics: {
            title: "Reporting & Analytics",
            description: "Powerful insights into your business performance.",
            details:
              "Custom reports, sales trends, profit analysis, and KPI dashboards.",
          },
          customerManagement: {
            title: "Customer Management",
            description: "Build loyalty and understand your customer base.",
            details:
              "Customer profiles, purchase history, loyalty programs, and marketing tools.",
          },
        },
        technologies: {
          title: "Our Retail Technology Stack",
          subtitle:
            "We specialize in these powerful retail management technologies and platforms",
          retailManager: "RetailManager",
          webStoreManager: "WebStore Manager",
          rmMultiStore: "Multi-Store",
          webHosting: "Web Hosting",
          windowsPlatform: "Windows Platform",
          sqlDatabase: "SQL Database",
          posHardware: "POS Hardware",
          reportingTools: "Reporting Tools",
          teamViewer: "TeamViewer",
          oneDrive: "OneDrive",
          microsoftAccess: "Microsoft Access",
          outlookClassic: "Outlook Classic",
        },
        process: {
          title: "Our Implementation Process",
          subtitle:
            "We follow a structured approach to ensure successful RetailManager deployment",
          needsAssessment: {
            title: "Needs Assessment",
            description:
              "We analyze your business requirements, current processes, and pain points to recommend the right solution.",
          },
          dataMigration: {
            title: "Business Data Migration",
            description:
              "We securely transfer your existing product, customer, and transaction data to the new system.",
          },
          systemConfiguration: {
            title: "System Configuration",
            description:
              "We customize RetailManager to match your business workflows, tax rules, and reporting needs.",
          },
          trainingSupport: {
            title: "Training & Support",
            description:
              "Comprehensive staff training and ongoing support to ensure you get the most from your system.",
          },
        },
        whyChooseUs: {
          title: "Why Retailers Choose Us",
          subtitle:
            "We combine deep retail expertise with technical knowledge to deliver solutions that drive real business results.",
          retailSpecialists: {
            title: "Retail Specialists",
            description:
              "Our team understands retail operations from the ground up, ensuring solutions that actually work in real retail environments.",
          },
          provenTrackRecord: {
            title: "Proven Track Record",
            description:
              "We've helped hundreds of retailers streamline operations, reduce costs, and increase sales through our solutions.",
          },
          ongoingSupport: {
            title: "Ongoing Support",
            description:
              "We don't just implement systems - we provide continuous support, updates, and optimizations as your business grows.",
          },
        },
        cta: {
          title: "Ready to Transform Your Retail Business?",
          subtitle:
            "Let's discuss how RetailManager can streamline your operations and boost your profits. Our team is ready to help.",
          button: "Get Started Today",
        },
      },
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
        alreadySubscribed: "Already subscribed to our newsletter.",
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
      font: "Dangrek",
      // Careers Page translations
      careersPage: {
        hero: {
          title: "ចូលរួមជាមួយក្រុមការងាររបស់យើង",
          subtitle:
            "ចូលរួមជាផ្នែកនៃអ្វីដ៏អស្ចារ្យ។ យើងកំពុងបង្កើតអនាគតនៃដំណោះស្រាយអាជីវកម្មនៅកម្ពុជា។",
        },
        whyWorkWithUs: {
          title: "ហេតុអ្វីបានជាធ្វើការជាមួយយើង?",
          description:
            "នៅ WV Support Services Cambodia យើងជឿលើភាពច្នៃប្រឌិត ការសហការ និងការលូតលាស់។ យើងមានចំណង់ចំណូលចិត្តក្នុងការបង្កើតក្រុមការងារដែលមានអារម្មណ៍ដូចគ្រួសារ ខណៈពេលដែលសម្រេចបាននូវរឿងអស្ចារ្យជាមួយគ្នា។",
          values: {
            innovation: {
              title: "ភាពច្នៃប្រឌិត",
              description: "គម្រោងទំនើប",
            },
            collaboration: {
              title: "ការសហការ",
              description: "វប្បធម៌បញ្ជាក់ទីម",
            },
            security: {
              title: "សុវត្ថិភាព",
              description: "បរិស្ថានស្ថិរភាព",
            },
            growth: {
              title: "ការលូតលាស់",
              description: "ការអភិវឌ្ឍន៍អាជីព",
            },
          },
        },
        contact: {
          address: "ភូមិថ្មី សង្កាត់ស្វាយដង្កុំ សៀមរាប កម្ពុជា",
        },
        openings: {
          title: "មុខតំណែងបើកចំហ",
        },
        positions: {
          customerSupport: {
            title: "អ្នកជំនាញគាំទ្រអតិថិជន",
            type: "ពេញម៉ោង",
            location: "សៀមរាប កម្ពុជា",
            description: {
              paragraph1:
                "WV Support Services គឺជាក្រុមហ៊ុនគាំទ្រកម្មវិធីដែលផ្តល់សេវាដល់អតិថិជននៅទូទាំងអូស្ត្រាលី នូវែលសេឡង់ និងតំបន់អាស៊ី/ប៉ាស៊ីហ្វិក។ ក្នុងនាមជាអ្នកជំនាញគាំទ្រអតិថិជន អ្នកនឹងក្លាយជាខ្សែបន្ទាត់ផ្នែកមុខនៃបទពិសោធន៍អតិថិជនរបស់យើង។ អ្នកនឹងដោះស្រាយសំណួរតាមរយៈទូរស័ព្ទ អ៊ីមែល និងការជជែក ដោយផ្តល់នូវដំណោះស្រាយដែលធ្វើឱ្យអតិថិជនរបស់យើងពេញចិត្ត។",
              paragraph2:
                "តួនាទីនេះតម្រូវឱ្យដោះស្រាយបញ្ហាបច្ចេកទេស ណែនាំអតិថិជនតាមរយៈផលិតផលរបស់យើង និងកត់ត្រាដំណោះស្រាយសម្រាប់មូលដ្ឋានចំណេះដឹងរបស់យើង។ អ្នកនឹងធ្វើការយ៉ាងជិតស្និទ្ធជាមួយក្រុមផលិតផលរបស់យើងដើម្បីទំនាក់ទំនងនូវតម្រូវការ និងមតិកែលម្អពីអតិថិជន។",
              paragraph3:
                "យើងកំពុងស្វែងរកមនុស្សម្នាក់ដែលមានបទពិសោធន៍សេវាកម្មអតិថិជនយ៉ាងតិច 1 ឆ្នាំ ជំនាញដោះស្រាយបញ្ហាល្អ និងការអត់ធ្មត់ក្នុងការដោះស្រាយជាមួយបុគ្គលិកលក្ខណៈអតិថិជនចម្រុះ។ ចំណេះដឹងកុំព្យូទ័រគឺចាំបាច់។ បេក្ខជនដែលអាចនិយាយពីរភាសាត្រូវបានចាត់ទុកជាអាទិភាពខ្ពស់។",
              paragraph4:
                "អ្នកគួរតែអាចនិយាយ អាន និងសរសេរភាសាអង់គ្លេសបានយ៉ាងស្ទាត់ជំនាញ និងមានជំនាញទំនាក់ទំនងល្អបំផុត រួមជាមួយនឹងបុគ្គលិកលក្ខណៈស្និទ្ធស្នាល និងល្អ។ សមត្ថភាពធ្វើការក្នុងបរិស្ថានជាក្រុមគឺចាំបាច់។",
              paragraph5:
                "ម៉ោងធ្វើការគឺថ្ងៃច័ន្ទដល់ថ្ងៃសុក្រ ពី 6 ព្រឹកដល់ 3 រសៀល (មានម៉ោងសម្រាក 1 ម៉ោង) បូកនឹងពី 6 ព្រឹកដល់ 1 រសៀលនៅថ្ងៃសៅរ៍ពីរនៅក្នុងមួយខែ។ សប្តាហ៍ការងារគឺ 43 ម៉ោង។",
            },
            requirements: {
              experience: "បទពិសោធន៍សេវាកម្មអតិថិជនយ៉ាងតិច 1 ឆ្នាំ",
              computerKnowledge: "ចំណេះដឹងកុំព្យូទ័រគឺចាំបាច់",
              englishFluency: "ស្ទាត់ជំនាញភាសាអង់គ្លេស (និយាយ អាន សរសេរ)",
              communication: "ជំនាញទំនាក់ទំនងការនិយាយ និងការសរសេរឆ្នើម",
              teamwork:
                "បុគ្គលិកលក្ខណៈស្និទ្ធស្នាល និងសមត្ថភាពធ្វើការក្នុងបរិស្ថានជាក្រុម",
              troubleshooting: "ជំនាញដោះស្រាយបញ្ហាបច្ចេកទេស",
              shiftWork: "សមត្ថភាពធ្វើការតាមវេនដូរ រួមទាំងថ្ងៃសៅរ៍",
            },
            benefits: {
              salary: "ប្រាក់ខែប្រកួតប្រជែង",
              bonuses: "រង្វាន់ការអនុវត្តន៍",
              insurance: "ការធានារ៉ាប់រងសុខភាពពេញលេញ",
              leave:
                "ការឈប់សម្រាកប្រចាំឆ្នាំ និងថ្ងៃបុណ្យសាធារណៈតាមច្បាប់កម្ពុជា",
              career: "ឱកាសរៀនសូត្រ និងលើកកម្ពស់អាជីព",
              technology: "ធ្វើការជាមួយបច្ចេកវិទ្យាទំនើបបំផុត",
              flexibility: "ការរៀបចំការងារដែលមានភាពបត់បែន",
            },
            contact: {
              address: "ភូមិថ្មី សង្កាត់ស្វាយដង្កុំ សៀមរាប កម្ពុជា",
            },
          },
          backendDeveloper: {
            title: "អ្នកអភិវឌ្ឍន៍ Backend",
            type: "ពេញម៉ោង",
            location: "ការងារពីចម្ងាយ (មូលដ្ឋាននៅកម្ពុជា)",
            description: {
              paragraph1:
                "ចូលរួមជាមួយក្រុមវិស្វករកម្មរបស់យើងដើម្បីរចនា អភិវឌ្ឍ និងថែទាំសេវាកម្ម backend ដែលដំណើរការកម្មវិធីរបស់យើង។ អ្នកនឹងធ្វើការជាមួយបច្ចេកវិទ្យាទំនើបរួមទាំង Node.js, Express, MongoDB និងសេវាកម្ម AWS។",
              paragraph2:
                "ភាពទទួលខុសត្រូវរួមមានការអនុវត្តមុខងារថ្មី ការបង្កើនប្រសិទ្ធភាព ការសរសេរការសាកល្បងបង្គ្រប់ និងការចូលរួមក្នុងការពិនិត្យកូដ។ អ្នកនឹងសហការជាមួយអ្នកអភិवឌ្ឍន៍ frontend ដើម្បីបង្កើតការរួមបញ្ចូលគ្មានថ្នេរ។",
              paragraph3:
                "បេក្ខជនដ៏ល្អមានបទពិសោធន៍ការអភិវឌ្ឍន៍ backend ជាង 3 ឆ្នាំ ចំណេះដឹងខ្លាំងអំពីការរចនា RESTful API និងបទពិសោធន៍ជាមួយការបង្កើនប្រសិទ្ធភាពមូលដ្ឋានទិន្នន័យ។ ការរួមចំណែកបើកចំហគឺជាចំណុចបូក។",
            },
            requirements: {
              nodejs: "បទពិសោធន៍ Node.js ជាង 3 ឆ្នាំ",
              database: "ជំនាញជាមួយ MongoDB/PostgreSQL",
              aws: "បទពិសោធន៍ជាមួយសេវាកម្ម AWS",
              cicd: "ការយល់ដឹងអំពី CI/CD pipelines",
            },
            benefits: {
              compensation: "ប្រាក់ឈ្នួលលើសពីទីផ្សារ",
              stocks: "កញ្ចប់ជម្រើសភាគហុ៊ន",
              training: "ថវិការការប្រជុំ/ការបណ្តុះបណ្តាល",
              remote: "ជម្រើសការងារពីចម្ងាយ",
            },
          },
          uiuxDesigner: {
            title: "អ្នករចនា UI/UX",
            type: "កិច្ចសន្យា",
            location: "សៀមរាប កម្ពុជា",
            description: {
              paragraph1:
                "ក្នុងនាមជាអ្នករចនា UI/UX របស់យើង អ្នកនឹងដឹកនាំការរចនាផលិតផលឌីជីថលរបស់យើងពីគំនិតដល់ការអនុវត្ត។ អ្នកនឹងធ្វើការស្រាវជ្រាវអ្នកប្រើប្រាស់ បង្កើត wireframes និង prototypes និងសហការជាមួយអ្នកអភិវឌ្ឍន៍ដើម្បីនាំការរចនាមកជាការពិត។",
              paragraph2:
                "អ្នកនឹងបង្កើត និងថែទាំប្រព័ន្ធការរចនារបស់យើង ធានាភាពស៊ីសង្វាក់គ្នានៅទូទាំងវេទិកាទាំងអស់។ យើងគោរពអ្នករចនាដែលអាចតុល្យភាពទាក់ទាញមើលឃើញជាមួយការប្រើប្រាស់មុខងារ។",
              paragraph3:
                "បេក្ខជនដ៏ល្អបំផុតមានបទពិសោធន៍ការរចនាផលិតផលជាង 3 ឆ្នាំ ជំនាញក្នុង Figma/Sketch និង portfolio ដែលបង្ហាញពីដំណោះស្រាយការរចនាដែលផ្តោតលើអ្នកប្រើប្រាស់។ បទពិសោធន៍ជាមួយការអភិវឌ្ឍន៍ front-end គឺជារង្វាន់បូក។",
            },
            requirements: {
              experience: "បទពិសោធន៍ការរចនា UI/UX ជាង 3 ឆ្នាំ",
              tools: "ជំនាញក្នុង Figma/Sketch",
              portfolio: "Portfolio ការងារដ៏រឹងមាំ",
              designSystems: "ការយល់ដឹងអំពីប្រព័ន្ធការរចនា",
            },
            benefits: {
              freedom: "សេរីភាពច្នៃប្រឌិតលើគម្រោង",
              hardware: "ហាតវែរ/កម្មវិធីថ្មីៗ",
              schedule: "កាលវិភាគដែលមានភាពបត់បែន",
              retreat: "ការជួបជុំការរចនាប្រចាំឆ្នាំ",
            },
          },
          marketingSpecialist: {
            title: "អ្នកជំនាញទីផ្សារកម្ម",
            type: "ពេញម៉ោង",
            location: "សៀមរាប កម្ពុជា",
            description: {
              paragraph1:
                "អ្នកជំនាញទីផ្សារកម្មរបស់យើងនឹងអភិវឌ្ឍ និងអនុវត្តយុទ្ធសាស្រ្តនៅទូទាំងឆានែលឌីជីថល និងប្រពៃណី។ អ្នកនឹងបង្កើតមាតិកា គ្រប់គ្រងប្រព័ន្ធផ្សព្វផ្សាយសង្គម វិភាគម៉ែត្រិកការអនុវត្ត និងជួយរៀបចំសម្លេងម៉ាករបស់យើង។",
              paragraph2:
                "តួនាទីនេះពាក់ព័ន្ធនឹងការសម្របសម្រួលជាមួយភ្នាក់ងារខាងក្រៅ ការរៀបចំព្រឹត្តិការណ៍ និងការអភិវឌ្ឍយុទ្ធសាស្រ្តដើម្បីបង្កើនការយល់ដឹងអំពីម៉ាក និងការទទួលបានអតិថិជន។",
              paragraph3:
                "យើងកំពុងស្វែងរកមនុស្សម្នាក់ដែលមានបទពិសោធន៍ក្នុងទីផ្សារកម្មឌីជីថលជាង 2 ឆ្នាំ ជំនាញសរសេរខ្លាំង និងបទពិសោធន៍ជាមួយឧបករណ៍វិភាគ។ ជំនាញកាត់ត Video និងការរចនាក្រាហ្វិកគឺជាប្រយោជន៍។",
            },
            requirements: {
              experience: "បទពិសោធន៍ទីផ្សារកម្មជាង 2 ឆ្នាំ",
              analytics: "ជំនាញក្នុងការវិភាគឌីជីថល",
              copywriting: "ជំនាញសរសេរឆ្នើម",
              socialMedia: "ការគ្រប់គ្រងប្រព័ន្ធផ្សព្វផ្សាយសង្គម",
            },
            benefits: {
              bonuses: "រង្វាន់ផ្អែកលើការអនុវត្តន៍",
              budget: "ថវិកាយុទ្ធសាស្រ្តច្នៃប្រឌិត",
              networking: "ឱកាសបណ្តាញ",
              travel: "ការធ្វើដំណើរសម្រាប់ព្រឹត្តិការណ៍ឧស្សាហកម្ម",
            },
          },
        },
        buttons: {
          viewDetails: "មើលព័ត៌មានលម្អិត",
          close: "បិទ",
          applyNow: "ដាក់ពាក្យសុំឥឡូវ",
          sendResume: "ផ្ញើប្រវត្តិរូបមកកាន់យើង",
          understood: "យល់ហើយ",
        },
        modal: {
          positionOverview: "ទិដ្ឋភាពទូទៅនៃតំណែង",
          requirements: "តម្រូវការ",
          benefits: "អត្ថប្រយោជន៍",
        },
        footer: {
          noMatch: "មិនឃើញការផ្គូផ្គងល្អសម្រាប់ជំនាញរបស់អ្នកទេ?",
        },
        unavailableModal: {
          title: "តំណែងមិនអាចប្រើបាន",
          message:
            "យើងសូមអភ័យទោស ប៉ុន្តែតំណែងការងារនេះបច្ចុប្បន្នមិនអាចប្រើបាន។ សូមពិនិត្យមើលម្តងទៀតនៅពេលក្រោយ ឬស្វែងយល់តំណែងបើកចំហផ្សេងទៀតរបស់យើង។",
        },
      },
      // New FAQ Page translations
      faqPage: {
        hero: {
          title: "សំណួរដែលសួរញឹកញាប់",
          description:
            "នេះជាសំណួរដែលសួរញឹកញាប់បំផុត។ ប្រសិនបើអ្នកមិនឃើញចម្លើយចំពោះសំណួររបស់អ្នកទេ សូមទាក់ទងមកកាន់យើង!",
        },
        questions: {
          whatIsService: {
            question: "សេវាកម្មរបស់អ្នកគឺជាអ្វី?",
            answer:
              "យើងផ្តល់នូវដំណោះស្រាយបច្ចេកវិទ្យាព័ត៌មានពេញលេញ រួមមានការអភិវឌ្ឍន៍គេហទំព័រ កម្មវិធីទូរស័ព្ទ និងសេវាកម្មប្រឹក្សា។",
          },
          contactSupport: {
            question: "តើខ្ញុំអាចទាក់ទងជំនួយការយ៉ាងដូចម្តេច?",
            answer:
              "អ្នកអាចទាក់ទងមកកាន់ក្រុមជំនួយរបស់យើងតាមអ៊ីមែល ឬដោយចុចប៊ូតុង 'ទាក់ទងជំនួយ' នៅលើគេហទំព័ររបស់យើង។",
          },
          discounts: {
            question: "តើអ្នកផ្តល់ការបញ្ចុះតម្លៃអ្វីខ្លះទេ?",
            answer:
              "យើងផ្តល់ការបញ្ចុះតម្លៃសម្រាប់ភាពជាដៃគូរយៈពេលវែង និងការទិញជាបាច់។ សូមទាក់ទងមកកាន់យើងសម្រាប់ព័ត៌មានលម្អិត។",
          },
          refundPolicy: {
            question: "តើគោលការណ៍ជំនួសប្រាក់របស់អ្នកជាយ៉ាងដូចម្តេច?",
            answer:
              "យើងផ្តល់ការធានាប្រាក់វិញ 30 ថ្ងៃសម្រាប់សេវាកម្មទាំងអស់របស់យើង។ ប្រសិនបើអ្នកមិនពេញចិត្តទេ អ្នកអាចទទួលបានប្រាក់វិញពេញលេញ។",
          },
          freeTrial: {
            question: "តើខ្ញុំអាចទទួលបានការសាកល្បងដោយឥតគិតថ្លៃបានទេ?",
            answer:
              "បាទ! យើងផ្តល់ការសាកល្បង 7 ថ្ងៃដោយឥតគិតថ្លៃសម្រាប់សេវាកម្មភាគច្រើនរបស់យើង ដើម្បីឱ្យអ្នកអាចសាកល្បងមុនពេលធ្វើការសម្រេចចិត្ត។",
          },
        },
      },
      // Partner Page
      partnerPage: {
        hero: {
          title: "ដៃគូដែលយើងទុកចិត្ត",
          subtitle:
            "យើងសហការជាមួយអង្គការនាំមុខដើម្បីផ្តល់នូវដំណោះស្រាយនិងការច្នៃប្រឌិតកំពូល។",
        },
        partnerLogos: {
          altText: "រូបសញ្ញា {{name}}",
        },
        cta: {
          title: "ចូរបង្កើតអនាគតជាមួយគ្នា",
          subtitle:
            "ចាប់អារម្មណ៍ក្នុងការធ្វើជាដៃគូជាមួយយើង? យើងចង់ស្តាប់ពីអ្នក។",
          buttonText: "ទាក់ទងក្រុមរបស់យើង",
        },
      },
      // Legal Page
      legalPage: {
        title: "លក្ខខណ្ឌ និងកិច្ចព្រមព្រៀង",
        welcome: {
          title: "ស្វាគមន៍",
          description:
            "សូមអរគុណដែលបានជ្រើសរើសសេវាកម្មជំនួយ WV Support Services Cambodia។ ដោយការចូលប្រើប្រាស់គេហទំព័ររបស់យើង អ្នកយល់ព្រមត្រូវបានចងភ្ជាប់ដោយលក្ខខណ្ឌ និងកិច្ចព្រមព្រៀងទាំងនេះ។",
        },
        useOfServices: {
          title: "ការប្រើប្រាស់សេវាកម្មរបស់យើង",
          description:
            "អ្នកយល់ព្រមប្រើប្រាស់គេហទំព័ររបស់យើងដោយទំនួលខុសត្រូវ។ ការប្រើប្រាស់មិនត្រឹមត្រូវឬមិនមានការអនុញ្ញាតត្រូវបានហាមប្រាម។",
        },
        intellectualProperty: {
          title: "កម្មសិទ្ធិបញ្ញា",
          description:
            "មាតិកាទាំងអស់ រួមទាំងរូបសញ្ញា រូបភាព និងសម្ភារៈសរសេរ ជាកម្មសិទ្ធិរបស់ WV Support Services Cambodia និងត្រូវបានការពារក្រោមច្បាប់រក្សាសិទ្ធិ។",
        },
        limitationOfLiability: {
          title: "កំណត់នៃការទទួលខុសត្រូវ",
          description:
            "យើងមិនទទួលខុសត្រូវចំពោះការខូចខាតណាមួយដែលអាចកើតឡើងពីការប្រើប្រាស់គេហទំព័រឬសេវាកម្មរបស់យើងទេ។",
        },
        changes: {
          title: "ការផ្លាស់ប្តូរ",
          description:
            "យើងអាចធ្វើបច្ចុប្បន្នភាពលក្ខខណ្ឌទាំងនេះនៅពេលណាមួយ។ ការប្រើប្រាស់បន្តបន្ទាប់ពីការផ្លាស់ប្តូរមានន័យថាអ្នកទទួលយកលក្ខខណ្ឌថ្មី។",
        },
        contactUs: {
          title: "ទាក់ទងយើង",
          description: "មានសំណួរ? ទាក់ទងមកយើងតាម support@aaapos.com។",
        },
      },
      // Who We Are
      whoWeArePage: {
        hero: {
          title: "យើងជានរណា?",
          subtitle:
            "យើងគឺជាផ្ទុយនៃគំនិត កម្លាំងនៃការផ្លាស់ប្តូរ និងបេះដូងនៃការច្នៃប្រឌិត។",
        },
        vision: {
          title: "ចក្ខុវិស័យរបស់យើង",
          description:
            "ក្លាយជាកម្លាំងនៃការច្នៃប្រឌិតនិងនវានុវត្តន៍ ដោយផ្លាស់ប្តូរឧស្សាហកម្មនិងជីវិតតាមរយៈបទពិសោធន៍ឌីជីថលដែលសាមញ្ញ មានមនុស្សធម៌ និងមានផលប៉ះពាល់។",
        },
        mission: {
          title: "បេសកកម្មរបស់យើង",
          description:
            "យើងបង្កើតដំណោះស្រាយមានអត្ថន័យដែលតភ្ជាប់មនុស្ស ដោះស្រាយបញ្ហា និងបំផុសការលូតលាស់ — ម្តងមួយគម្រោង។ ផលិតផលរាល់មួយដែលយើងបង្កើតមានមូលដ្ឋាននៅលើគោលបំណងនិងជំរុញដោយការរចនាដែលផ្តោតលើអ្នកប្រើប្រាស់។",
        },
        coreValues: {
          title: "តម្លៃស្នូលរបស់យើង",
          curiosity: {
            title: "ការចង់ដឹងចង់ឃើញ",
            description: "យើងសួរសំណួរនិងស្វែងរកផ្លូវថ្មីដោយគ្មានការភ័យខ្លាច។",
          },
          integrity: {
            title: "សុចរិតភាព",
            description: "យើងធ្វើអ្វីដែលត្រឹមត្រូវ មិនមែនអ្វីដែលងាយស្រួលទេ។",
          },
          collaboration: {
            title: "សហការ",
            description: "យើងជឿជាក់លើកម្លាំងនៃគំនិតចែករំលែកនិងបេះដូងបើកចំហ។",
          },
          excellence: {
            title: "ឧត្តមភាព",
            description:
              "យើងយកចិត្តទុកដាក់នឹងរឿងតូចៗ — សេចក្តីលម្អិតមានសារៈសំខាន់។",
          },
          empathy: {
            title: "ការយល់ចិត្ត",
            description: "យើងបង្កើតជាមួយមនុស្ស សម្រាប់មនុស្ស។",
          },
        },
        culture: {
          title: "វប្បធម៌របស់យើង",
          description:
            "យើងធ្វើការពីចម្ងាយប៉ុន្តែមានការតភ្ជាប់។ មានវិជ្ជាជីវៈប៉ុន្តែសប្បាយរីករាយ។ ផ្តោតអារម្មណ៍ប៉ុន្តែបត់បែន។ វប្បធម៌របស់យើងត្រូវបានបង្កើតលើការជឿទុកចិត្ត ការច្នៃប្រឌិត និងជំនឿដ៏មុតមាំថាការងារល្អបំផុតមកពីក្រុមដែលមានអារម្មណ៍ដូចជាគ្រួសារ។",
        },
        cta: {
          title: "ចូរបង្កើតអ្វីមួយដែលមានអត្ថន័យ",
          description:
            "មិនថាអ្នកជាអ្នកសុបិន អ្នកធ្វើ ឬដៃគូ យើងចង់តភ្ជាប់ជាមួយអ្នក។ ចូលរួមជាមួយយើងនៅពេលដែលយើងបង្កើតអនាគតដែលផ្តល់ថាមពលដោយការច្នៃប្រឌិត បច្ចេកវិទ្យា និងបេះដូង។",
          buttonText: "ទាក់ទងមកយើង",
        },
      },
      // Support
      supportPage: {
        hero: {
          title: "សេវាកម្មជំនួយបច្ចេកទេសពិសេស",
          subtitle:
            "ការជំនួយបច្ចេកទេសពិសេសសម្រាប់ប្រព័ន្ធ RetailManager របស់អ្នក ដើម្បីធានាការដំណើរការដ៏រលូននិងការផ្តល់សេវាកម្មជាបន្តបន្ទាប់",
        },
        services: {
          sectionTitle: "សេវាកម្មជំនួយពេញលេញរបស់យើង",
          remoteTroubleshooting: {
            title: "ការដោះស្រាយបញ្ហាពីចម្ងាយ",
            description:
              "ការជំនួយភ្លាមៗសម្រាប់ប្រព័ន្ធ RetailManager របស់អ្នក ជាមួយនឹងការភ្ជាប់ពីចម្ងាយដ៏សុវត្ថិភាពនិងការវិភាគក្នុងពេលកំពុងដំណើរការ",
            altText: "ការជំនួយពីចម្ងាយ",
            features: {
              responseTime:
                "ការឆ្លើយតបក្នុងរយៈពេលតិចជាង ១៥នាទី សម្រាប់បញ្ហាបន្ទាន់",
              encryption: "ការតភ្ជាប់ដ៏សុវត្ថិភាពកម្រិតយោធា",
              availability: "មានដល់ ២៤/៧ សម្រាប់ករណីបន្ទាន់",
            },
          },
          systemOptimization: {
            title: "ការធ្វើឱ្យប្រព័ន្ធប្រសើរ",
            description:
              "ការថែទាំជាមុននិងការកែលម្អដំណើរការ ដើម្បីរក្សា RetailManager របស់អ្នកឱ្យដំណើរការបានល្អបំផុត",
            altText: "ការធ្វើឱ្យប្រព័ន្ធប្រសើរ",
            features: {
              database: "ការធ្វើឱ្យមូលដ្ឋានទិន្នន័យប្រសើរ",
              integration: "ការពិនិត្យសុខភាពការភ្ជាប់",
              reporting: "ការរៀបចំរបាយការណ៍តាមតម្រូវការ",
            },
          },
          dedicatedTeam: {
            title: "ក្រុមការងារពិសេស",
            description:
              "អ្នកជំនាញដែលមានមូលដ្ឋាននៅសៀមរាប របស់យើង ផ្សំបញ្ចូលនូវជំនាញបច្ចេកទេសជាមួយនឹងចំណេះដឹងជ្រៅអំពី RetailManager",
            altText: "ការជំនួយក្រុម",
            features: {
              australiaFacing: "ការជំនួយដែលតម្រង់ទៅកាន់អូស្ត្រាលី",
              bilingual: "អ្នកបច្ចេកទេសពហុភាសា",
              cultural: "ការយល់ដឹងខាងវប្បធម៌",
            },
          },
        },
        stats: {
          sectionTitle: "ចំណុចវាស់វែងលទ្ធផលរបស់យើង",
          availability: {
            value: "២៤/៧",
            description: "មានដល់សម្រាប់បញ្ហាបន្ទាន់",
          },
          resolution: {
            value: "៩៨%",
            description: "អត្រាការដោះស្រាយក្នុងការទាក់ទងលើកដំបូង",
          },
          responseTime: {
            value: "១៥នាទី",
            description: "ពេលវេលាឆ្លើយតបជាមធ្យម",
          },
          systemsSupported: {
            value: "៥០០+",
            description: "ប្រព័ន្ធដែលបានជំនួយប្រចាំឆ្នាំ",
          },
        },
        process: {
          sectionTitle: "ដំណើរការជំនួយរបស់យើង",
          initialContact: {
            title: "ការទាក់ទងដំបូង",
            description:
              "ទាក់ទងយើងតាមរយៈទូរស័ព្ទ អ៊ីមែល ឬក្រុមការងារជំនួយរបស់យើង។ ប្រព័ន្ធរបស់យើងដាក់អាទិភាពស្វ័យប្រវត្តិនូវសំណើរបស់អ្នក ដោយផ្អែកលើកម្រិតបន្ទាន់និងផលប៉ះពាល់ដល់ការដំណើរការអាជីវកម្មរបស់អ្នក",
          },
          diagnosticAnalysis: {
            title: "ការវិភាគរោគវិនិច្ឆ័យ",
            description:
              "យើងធ្វើការវិនិច្ឆ័យពីចម្ងាយដ៏ទូលំទូលាយ ដោយប្រើឧបករណ៍ទំនើប ដើម្បីកំណត់យ៉ាងឆាប់រហ័សនូវមូលហេតុឫស មិនថាជាកម្មវិធី ផ្នែករឹង ឬការភ្ជាប់ពាក់ព័ន្ធនឹង",
          },
          solutionImplementation: {
            title: "ការអនុវត្តដំណោះស្រាយ",
            description:
              "បន្ទាប់ពីការអនុម័តរបស់អ្នក យើងអនុវត្តដំណោះស្រាយ ដោយរក្សាការប្រាស្រ័យទាក់ទងពេញលេញ ពេញមួយដំណើរការ ជាមួយនឹងជម្រើសការជំនួយក្រៅម៉ោងការងារ នៅពេលដែលត្រូវការ",
          },
          verificationFollowup: {
            title: "ការផ្ទៀងផ្ទាត់ និងតាមដាន",
            description:
              "យើងបញ្ជាក់ការដោះស្រាយជាមួយអ្នក ហើយកំណត់ពេលវេលាតាមដានដែលចាំបាច់ទេ ដើម្បីធានាការស្ថិរភាពបន្ត រួមទាំងការបណ្តុះបណ្តាលជាជម្រើសសម្រាប់បុគ្គលិករបស់អ្នក",
          },
        },
      },
      // Projects
      projectsPage: {
        hero: {
          title: "គម្រោងរបស់យើង",
          subtitle:
            "ជាង ២៥ ឆ្នាំនៃភាពល្អឥតខ្ចោះក្នុងការគ្រប់គ្រងការលក់រាយ - ផ្តល់ដំណោះស្រាយ RetailManager POS នៅទូទាំងអូស្ត្រាលី នូវែលសេឡង់ និងកោះប៉ាស៊ីហ្វិក",
        },

        section: {
          title: "ការអនុវត្តគម្រោងសំខាន់ៗ",
          description:
            "ស្វែងយល់ពីរបៀបដែល AAAPOS RetailManager បានផ្លាស់ប្តូរអាជីវកម្មជាមួយនឹងដំណោះស្រាយ POS ពេញលេញ ការរួមបញ្ចូលពាណិជ្ជកម្មអេឡិចត្រូនិច និងការគាំទ្រជំនាញ",
        },

        filters: {
          all: "ទាំងអស់",
          posImplementation: "ការអនុវត្ត POS",
          ecommerceIntegration: "ការរួមបញ្ចូលពាណិជ្ជកម្មអេឡិចត្រូនិច",
          businessMigration: "ការផ្ទេរអាជីវកម្ម",
          supportTraining: "ការគាំទ្រ និងបណ្តុះបណ្តាល",
        },

        categories: {
          posimplementation: "ការអនុវត្ត POS",
          ecommerceintegration: "ការរួមបញ្ចូលពាណិជ្ជកម្មអេឡិចត្រូនិច",
          businessmigration: "ការផ្ទេរអាជីវកម្ម",
          supporttraining: "ការគាំទ្រ និងបណ្តុះបណ្តាល",
        },

        projects: {
          retailManagerMultiStore: {
            title: "ការដាក់ពង់ RetailManager ច្រើនហាង",
            description:
              "បានដាក់ពង់ AAAPOS RetailManager ដោយជោគជ័យនៅកន្លែងលក់រាយជាង ២៥ ទីតាំងជាមួយនឹងការគ្រប់គ្រងសារពើភ័ណ្ឌកណ្តាល និងរបាយការណ៍តាមពេលវេលាពិត។",
            location: "មែលបួន, ស៊ីដនី, ប្រ៊ីសបេន",
            industry: "ខ្សែសង្វាក់លក់រាយម៉ូដ",
          },

          shopifyWooCommerce: {
            title: "ការរួមបញ្ចូល Shopify និង WooCommerce",
            description:
              "បានរួមបញ្ចូល RetailManager POS ជាមួយវេទិកាពាណិជ្ជកម្មអេឡិចត្រូនិចច្រើនដោយប្រើ AAAPOS Webstore Manager សម្រាប់ការធ្វើសមកាលកម្មសារពើភ័ណ្ឌដោយគ្មានបញ្ហា។",
            location: "អូកឡែន, វេលលិងតុន",
            industry: "ផ្ទះ និងសួនច្បារ",
          },

          myobMigration: {
            title: "ការផ្ទេរ MYOB RetailManager",
            description:
              "បានផ្ទេរប្រព័ន្ធ MYOB RetailManager ចាស់ទៅ AAAPOS RetailManager ថ្មីបំផុតដោយមិនបាត់បង់ទិន្នន័យ និងការឈប់ដំណើរការតិចតួចបំផុត។",
            location: "Gold Coast, Sunshine Coast",
            industry: "អេឡិចត្រូនិច និងបច្ចេកវិទ្យា",
          },

          eftposIntegration: {
            title: "គម្រោងរួមបញ្ចូល EFTPOS",
            description:
              "បានអនុវត្តការរួមបញ្ចូល EFTPOS ពេញលេញជាមួយធនាគារធំៗរបស់អូស្ត្រាលីរួមទាំង CBA, ANZ, Westpac, និង NAB សម្រាប់ដំណើរការបង់ប្រាក់ដ៏រលូន។",
            location: "ភឺត, អាដេឡែដ",
            industry: "ការលក់រាយពិសេស",
          },

          ebayBigCommerce: {
            title: "ការរួមបញ្ចូល eBay និង BigCommerce",
            description:
              "បានភ្ជាប់ RetailManager POS ជាមួយវេទិកា eBay និង BigCommerce សម្រាប់ការគ្រប់គ្រងការលក់រាយពហុឆានែលរួមបញ្ចូលគ្នា និងដំណើរការបញ្ជាទិញស្វ័យប្រវត្តិ។",
            location: "ដាវីន, អាលីស ស្ព្រីង",
            industry: "សម្ភារៈកីឡា",
          },

          support247: {
            title: "ការអនុវត្តការគាំទ្រ ២៤/៧",
            description:
              "បានបង្កើតប្រព័ន្ធគាំទ្រ ៧ ថ្ងៃពេញលេញជាមួយនឹងទូរស័ព្ទ អ៊ីមែល និងការជួយដោយ TeamViewer ពីចម្ងាយសម្រាប់អ្នកលក់រាយកោះប៉ាស៊ីហ្វិក។",
            location: "ហ្វីជី, ប៉ាពូអានូវែលហ្គីណេ, វ៉ានូអាទូ",
            industry: "ទេសចរណ៍ និងសេវាកម្ម",
          },

          agriculturalRetail: {
            title: "ប្រព័ន្ធលក់រាយកសិកម្ម",
            description:
              "ការដាក់ពង់ RetailManager ជំនាញពិសេសសម្រាប់អ្នកលក់រាយកសិកម្មជាមួយការរួមបញ្ចូលទៅ Nutrien Ag CRT សម្រាប់ប្រតិបត្តិការពាណិជ្ជកម្មជនបទដ៏រលូន។",
            location: "តំបន់ Queensland, NSW",
            industry: "សម្ភារៈកសិកម្ម",
          },

          xeroIntegration: {
            title: "ការរួមបញ្ចូលគណនេយ្យ XERO",
            description:
              "ការរួមបញ្ចូលដោយគ្មានបញ្ហារវាង RetailManager POS និងកម្មវិធីគណនេយ្យ XERO សម្រាប់របាយការណ៍ហិរញ្ញវត្ថុស្វ័យប្រវត្តិ និងការគ្រប់គ្រង GST។",
            location: "កាន់បេរ៉ា, ហូបាត",
            industry: "សុខភាព និងសម្រស់",
          },
        },

        learnMore: "ស្វែងយល់បន្ថែម ➔",
      },
      // About us
      aboutPage: {
        hero: {
          title: "អំពី",
          company: "WV Support",
          subtitle:
            "ភ្ជាប់ទេពកោសល្យកម្ពុជាជាមួយឱកាសសកលលោកតាមរយៈសេវាកម្មគាំទ្រព័ត៌មានវិទ្យាដ៏ល្អឥតខ្ចោះ",
        },

        mission: {
          label: "បេសកកម្មរបស់យើង",
          title: {
            part1: "ពង្រឹងសមត្ថភាព",
            part2: "វិស័យបច្ចេកវិទ្យាកម្ពុជា",
          },
          description:
            "WV Support Services Cambodia ជឿជាក់លើការផ្តល់សេវាកម្មគាំទ្រព័ត៌មានវិទ្យាកម្រិតសកលលោកដល់អាជីវកម្មអូស្ត្រាលី ពេលជាមួយគ្នានេះ បង្កើតឱកាសសំខាន់ៗសម្រាប់អ្នកជំនាញកម្ពុជា។",
          benefits: {
            competitive: "អត្ថប្រយោជន៍ប្រកួតប្រជែង និងឱកាសរីកចម្រើន",
            technology: "បរិយាកាសបច្ចេកវិទ្យាទំនើប",
            platform: "វេទិកាសកលលោកសម្រាប់ការច្នៃប្រឌិតរបស់កម្ពុជា",
            satisfaction: "ការពេញចិត្តរបស់អតិថិជនដែលមិនអាចទៀបផ្ទឹងបាន",
          },
          conclusion:
            "យើងកំពុងសាងសង់អនាគតដែលអ្នកជំនាញបច្ចេកវិទ្យាកម្ពុជាអាចប្រកួតប្រជែងនៅលើឆាកសកលលោក។",
          location: "សៀមរាប, កម្ពុជា",
          imageTitle: "បរិយាកាសវិជ្ជាជីវៈរបស់យើង",
          imageAlt: "ក្រុមការងាររបស់យើង",
        },

        timeline: {
          label: "ដំណើរការរបស់យើង",
          title: {
            part1: "ការកសាង",
            part2: "ទំនុកចិត្ត",
            part3: "តាំងពីឆ្នាំ ២០២១",
          },
          items: {
            founded: {
              year: "២០២១",
              title: "បង្កើតឡើងនៅសៀមរាប",
              content:
                "WV Support Services Cambodia ត្រូវបានបង្កើតឡើងជាមួយនឹងចក្ខុវិស័យក្នុងការភ្ជាប់ទេពកោសល្យកម្ពុជាជាមួយឱកាសសកលលោក។",
            },
            expanding: {
              year: "២០២៤",
              title: "ការពង្រីកចំណាយរបស់យើង",
              content:
                "បច្ចុប្បន្នកំពុងផ្តល់សេវាកម្មដល់អតិថិជនជាង ១០,០០០ នាក់ជាមួយនឹងក្រុមអ្នកជំនាញព័ត៌មានវិទ្យាដ៏ឧទ្ទិស។",
            },
            future: {
              year: "អនាគត",
              title: "បន្តការច្នៃប្រឌិត",
              content:
                "យើងប្តេជ្ញាចិត្តក្នុងការធ្វើអោយមានកម្រិតកិច្ចប្រឹងប្រែងកាន់តែខ្ពស់ និងពង្រីកសេវាកម្មរបស់យើងទូទាំងតំបន់។",
            },
          },
        },

        vision: {
          label: "ចក្ខុវិស័យរបស់យើង",
          title: {
            part1: "រចនា",
            part2: "អនាគត",
            part3: "នៃការគាំទ្រព័ត៌មានវិទ្យា",
          },
          subtitle:
            "យើងមើលឃើញពិភពលោកមួយដែលទេពកោសល្យបច្ចេកវិទ្យាកម្ពុជាត្រូវបានទទួលស្គាល់សកលលោកសម្រាប់ភាពល្អឥតខ្ចោះ និងការច្នៃប្រឌិត។",
          items: {
            empowerment: {
              title: "ការពង្រឹង",
              description:
                "បង្កើតផ្លូវអាជីពសម្រាប់អ្នកជំនាញកម្ពុជាក្នុងឧស្សាហកម្មបច្ចេកវិទ្យា",
            },
            excellence: {
              title: "ភាពល្អឥតខ្ចោះ",
              description:
                "ផ្តល់សេវាកម្មគាំទ្រព័ត៌មានវិទ្យាកម្រិតខ្ពស់ជាមួយនឹងជំនាញកម្ពុជា",
            },
            globalReach: {
              title: "ចំណុះសកលលោក",
              description: "ភ្ជាប់ទេពកោសល្យក្នុងស្រុកជាមួយនឹងឱកាសអន្តរជាតិ",
            },
            growth: {
              title: "ការរីកចម្រើន",
              description: "លើកកម្ពស់ការសិក្សាបន្ត និងការអភិវឌ្ឍន៍វិជ្ជាជីវៈ",
            },
            impact: {
              title: "ផលប៉ះពាល់",
              description:
                "បង្កើតការផ្លាស់ប្តូរដែលអាចវាស់វែងបាននៅក្នុងប្រព័ន្ធអេកូបច្ចេកវិទ្យារបស់កម្ពុជា",
            },
            innovation: {
              title: "ការច្នៃប្រឌិត",
              description:
                "ត្រួសត្រាយវិធីសាស្រ្តថ្មីៗក្នុងសេវាកម្មគាំទ្រព័ត៌មានវិទ្យា",
            },
          },
        },

        cta: {
          title: "ចូលរួមជាមួយក្រុមដែលកំពុងរីកចម្រើនរបស់យើង",
          description:
            "យើងតែងតែស្វែងរកអ្នកជំនាញដ៏ពូកែចូលរួមជាមួយបេសកកម្មរបស់យើងក្នុងការបង្ហាញភាពល្អឥតខ្ចោះនៃបច្ចេកវិទ្យាកម្ពុជា។",
          buttonText: "ស្វែងយល់អំពីឱកាសអាជីព",
        },
      },
      // Services Page
      servicesPage: {
        hero: {
          title: "សេវាកម្មរបស់យើង",
          subtitle: "ដំណោះស្រាយពេញលេញសម្រាប់អាជីវកម្មលក់រាយរបស់អ្នក",
        },
        services: {
          retailManagerPos: {
            title: "ប្រព័ន្ធគ្រប់គ្រងការលក់ RetailManager",
            description: "ដំណោះស្រាយគ្រប់គ្រងហាងលក់រាយដ៏មានប្រសិទ្ធភាព",
            details: "រួមមានការគ្រប់គ្រងសារពើភ័ណ្ឌ ការលក់ និងរបាយការណ៍",
          },
          webstoreIntegration: {
            title: "ការរួមបញ្ចូល​​ WebStore",
            description: "ភ្ជាប់ហាងអនឡាញរបស់អ្នកជាមួយប្រព័ន្ធគ្រប់គ្រង",
            details:
              "ធ្វើសមកាលកម្មទិន្នន័យដោយស្វ័យប្រវត្តិរវាងហាងអនឡាញនិងហាងរូបវន្ត",
          },
          multiStoreManagement: {
            title: "ការគ្រប់គ្រងហាងច្រើន​ Multi-Store",
            description: "គ្រប់គ្រងសាខាហាងច្រើនពីទីតាំងកណ្តាលមួយ",
            details: "មើល តាមដាន និងគ្រប់គ្រងសាខាហាងច្រើនដោយងាយស្រួល",
          },
          webHostingService: {
            title: "សេវាកម្មផ្ទុកគេហទំព័រ",
            description:
              "ដំណោះស្រាយផ្ទុកគេហទំព័រដែលមានស្ថេរភាព និងមានសុវត្ថិភាព",
            details: "ម៉ាស៊ីនមេដែលមានល្បឿនលឿន និងភាពជឿជាក់ខ្ពស់",
          },
          reportingAnalytics: {
            title: "របាយការណ៍ និងការវិភាគ",
            description: "របាយការណ៍ដែលអាចផ្លាស់ប្តូរបាន និងឧបករណ៍វិភាគ",
            details: "របាយការណ៍ដែលបង្ហាញជាពេលវេលាពិត និងការព្យាករលក់",
          },
          customerManagement: {
            title: "ការគ្រប់គ្រងអតិថិជន",
            description: "ប្រព័ន្ធគ្រប់គ្រងទំនាក់ទំនងអតិថិជន (CRM)",
            details:
              "តាមដានព័ត៌មានអតិថិជន ប្រវត្តិការលក់ និងយុទ្ធនាការផ្សព្វផ្សាយ",
          },
        },
        technologies: {
          title: "បច្ចេកវិទ្យាដែលយើងប្រើ",
          subtitle: "យើងប្រើបច្ចេកវិទ្យាដែលមានគុណភាពខ្ពស់បំផុតក្នុងឧស្សាហកម្ម",
          retailManager: "RetailManager",
          webStoreManager: "WebStore Manager",
          rmMultiStore: "RM Multi-Store",
          webHosting: "សេវាផ្ទុកគេហទំព័រ",
          windowsPlatform: "វេទិកា Windows",
          sqlDatabase: "មូលដ្ឋានទិន្នន័យ SQL",
          posHardware: "ឧបករណ៍ POS",
          reportingTools: "ឧបករណ៍របាយការណ៍",
          teamViewer: "TeamViewer",
          oneDrive: "OneDrive",
          microsoftAccess: "Microsoft Access",
          outlookClassic: "Outlook Classic",
        },
        process: {
          title: "ដំណើរការងាររបស់យើង",
          subtitle: "យើងធ្វើការជាមួយអតិថិជនដើម្បីធានាបាននូវដំណោះស្រាយល្អបំផុត",
          needsAssessment: {
            title: "ការវាយតម្លៃតម្រូវការ",
            description:
              "យើងវាយតម្លៃតម្រូវការអាជីវកម្មរបស់អ្នកដើម្បីយល់ពីដំណោះស្រាយល្អបំផុត",
          },
          dataMigration: {
            title: "ការផ្ទេរទិន្នន័យ",
            description:
              "យើងជួយផ្ទេរទិន្នន័យពីប្រព័ន្ធចាស់ទៅប្រព័ន្ធថ្មីដោយមានសុវត្ថិភាព",
          },
          systemConfiguration: {
            title: "ការកំណត់រចនាសម្ព័ន្ធប្រព័ន្ធ",
            description:
              "យើងកំណត់រចនាសម្ព័ន្ធប្រព័ន្ធដោយផ្អែកលើតម្រូវការជាក់លាក់របស់អ្នក",
          },
          trainingSupport: {
            title: "ការបណ្តុះបណ្តាល និងគាំទ្រ",
            description:
              "យើងផ្តល់ការបណ្តុះបណ្តាល និងគាំទ្របន្តដល់ស្ថាប័នរបស់អ្នក",
          },
        },
        whyChooseUs: {
          title: "ហេតុអ្វីគួរជ្រើសរើសយើង",
          subtitle: "យើងមានបទពិសោធន៍ជាង 10ឆ្នាំក្នុងវិស័យលក់រាយ",
          retailSpecialists: {
            title: "អ្នកជំនាញវិស័យលក់រាយ",
            description:
              "យើងផ្តោតលើវិស័យលក់រាយ ហើយយល់ដឹងអំពីបញ្ហានិងតម្រូវការរបស់អ្នក",
          },
          provenTrackRecord: {
            title: "ប្រវត្តិនៃភាពជោគជ័យ",
            description:
              "យើងមានប្រវត្តិនៃការផ្តល់ដំណោះស្រាយដែលមានប្រសិទ្ធភាពដល់អតិថិជនជាច្រើន",
          },
          ongoingSupport: {
            title: "ការគាំទ្របន្ត",
            description: "យើងផ្តល់សេវាគាំទ្របន្ត និងការថែទាំប្រព័ន្ធដល់អតិថិជន",
          },
        },
        cta: {
          title: "ចាប់ផ្តើមជាមួយយើងថ្ងៃនេះ",
          subtitle:
            "ទាក់ទងមកយើងឥឡូវនេះដើម្បីពិភាក្សាអំពីតម្រូវការអាជីវកម្មរបស់អ្នក",
          button: "ទាក់ទងយើង",
        },
      },
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

i18n.use(initReactI18next).init({
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
i18n.on("languageChanged", updateFontFamily);

export default i18n;
