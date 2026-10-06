import { useEffect } from "react";

// Per-page title, description and canonical URL for search engines and link previews.
// Paths are matched case-insensitively ("/Services" = "/services"); the canonical is always lowercase.
const SITE = "https://www.wvsupportservices.com";
const BRAND = "WV Support Services Cambodia";

const PAGES = {
  "/": {
    title: `${BRAND} | RetailManager & IT Support for Australian Businesses`,
    description:
      "Remote RetailManager and IT support from Siem Reap, Cambodia. Point of sale, webstore, MultiStore, hosting and technical support for retailers in Australia, New Zealand and Asia-Pacific.",
  },
  "/aboutus": {
    title: `About Us | ${BRAND}`,
    description:
      "Meet WV Support Services Cambodia, a Siem Reap-based team delivering remote RetailManager and IT support to retailers across Australia, New Zealand and Asia-Pacific.",
  },
  "/services": {
    title: `Services | ${BRAND}`,
    description:
      "RetailManager point of sale, Webstore Manager, MultiStore, RM Mobile, website and email hosting, and technical support for retail businesses.",
  },
  "/contact": {
    title: `Contact Us | ${BRAND}`,
    description:
      "Contact WV Support Services Cambodia by phone, email or our contact form. Remote RetailManager and IT support, 7 days a week.",
  },
  "/faq": {
    title: `FAQ | ${BRAND}`,
    description:
      "Answers to common questions about RetailManager, pricing, support hours, cancellation and integrations with MYOB, Xero, Shopify and EFTPOS providers.",
  },
  "/careers": {
    title: `Careers | ${BRAND}`,
    description:
      "Join the WV Support team in Siem Reap, Cambodia. Remote-first technical support roles working with RetailManager and retailers across Australia.",
  },
  "/legal": {
    title: `Terms & Conditions | ${BRAND}`,
    description: "Terms and conditions for using the WV Support Services Cambodia website and services.",
  },
};

const NOT_FOUND = {
  title: `Page Not Found | ${BRAND}`,
  description: "The page you are looking for could not be found.",
};

const ADMIN = {
  title: "Admin Dashboard | WV Support",
  description: "WV Support admin dashboard.",
};

// Find or create a <meta>/<link> in <head> and set one attribute on it
const setHeadTag = (tag, matchAttr, matchValue, attr, value) => {
  let el = document.head.querySelector(`${tag}[${matchAttr}="${matchValue}"]`);
  if (!el) {
    el = document.createElement(tag);
    el.setAttribute(matchAttr, matchValue);
    document.head.appendChild(el);
  }
  el.setAttribute(attr, value);
};

export const usePageMeta = (pathname) => {
  useEffect(() => {
    const path = pathname.toLowerCase().replace(/\/+$/, "") || "/";
    const isAdmin = path.startsWith("/admin") || path === "/login";
    const page = PAGES[path];
    const meta = page || (isAdmin ? ADMIN : NOT_FOUND);
    const url = `${SITE}${path === "/" ? "" : path}`;

    document.title = meta.title;
    setHeadTag("meta", "name", "description", "content", meta.description);
    setHeadTag("link", "rel", "canonical", "href", page ? url : SITE);
    // Unknown pages and the admin area should not appear in search results
    setHeadTag("meta", "name", "robots", "content", page && !isAdmin ? "index, follow, max-image-preview:large" : "noindex, nofollow");

    // Link previews (Facebook, LinkedIn, X…)
    setHeadTag("meta", "property", "og:title", "content", meta.title);
    setHeadTag("meta", "property", "og:description", "content", meta.description);
    setHeadTag("meta", "property", "og:url", "content", url);
    setHeadTag("meta", "name", "twitter:title", "content", meta.title);
    setHeadTag("meta", "name", "twitter:description", "content", meta.description);
  }, [pathname]);
};