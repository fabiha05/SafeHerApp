import React, { createContext, useContext, useState } from "react";

const LanguageContext = createContext();


const translations = {
  en: {
    // MainTabs
    home: "Home",
    journal: "Journal",
    resources: "Resources",
    profile: "Profile",

    // Settings Screen
    registered_user: "Registered User",
    privacy_security: "Privacy & Security",
    anonymous_mode: "Anonymous Mode",
    privacy_mode: "Privacy Mode",
    app_lock: "App Lock",
    notifications: "Notifications",
    push_notifications: "Push Notifications",
    accessibility: "Accessibility",
    language: "Language",
    dark_mode: "Dark Mode",
    emergency: "Emergency",
    emergency_contacts: "Emergency Contacts",
    no_contacts: "No Contacts",
    support: "Support",
    help_faq: "Help / FAQ",
    data_management: "Data Management",
    export_data: "Export Data",
    about_us: "About Us",
    sign_out: "Sign Out",

    // Emergency / Chat / Report Screens
    permissionDenied: "Permission Denied",
    locationPermissionRequired: "Location permission is required.",
    locationFetched: "Location Fetched!",
    latitude: "Latitude",
    longitude: "Longitude",
    error: "Error",
    unableToFetchLocation: "Unable to fetch location.",
    holdForEmergency: "Hold for emergency",
    tapHoldInfo: "Tap and hold for 3 seconds to activate emergency mode",
    manageContacts: "Manage Emergency Contacts",
    quickActions: "Quick Actions",
    safetyPlan: "Safety Plan",
    reviewPlan: "Review your safety plan",
    chatBot: "Chat Bot",
    talkAI: "Talk with AI assistant",
    report: "Report",
    secureReport: "Secure incident reporting",
    addLocation: "Add Location",
    connectLocation: "Connect your location",
    emergencyHotlines: "Emergency Hotlines",
    policeEmergency: "Police Emergency",
    ambulance: "Emergency Ambulance",
    womenHelpline: "Women Protection Helpline",
    available247: "24/7 Services",

    emergency: "Emergency",
    emergencySubtitle: "Immediate help contacts",
    shelters: "Shelters",
    sheltersSubtitle: "Find safe places nearby",
    legalAid: "Legal Aid",
    legalAidSubtitle: "Get legal advice and support",
    helplines: "Helplines",
    helplinesSubtitle: "Talk to someone now",
    therapy: "Therapy",
    therapySubtitle: "Find a therapist",
    knowRights: "Know Your Rights",
    knowRightsSubtitle: "Learn about your rights",

    add_report: "Add New Report",
    title: "Title (Optional)",
    description: "Description",
    add_image: "Add Image",
    gallery: "Gallery",
    camera: "Camera",
    report_anonymously: "Report Anonymously",
    save_report: "Save Report",
  },
  ur: {
    home: "ہوم",
    journal: "جرنل",
    resources: "وسائل",
    profile: "پروفائل",

    registered_user: "رجسٹرڈ یوزر",
    privacy_security: "پرائیویسی اور سیکورٹی",
    anonymous_mode: "انانیمس موڈ",
    privacy_mode: "پرائیویسی موڈ",
    app_lock: "ایپ لاک",
    notifications: "نوٹیفیکیشنز",
    push_notifications: "پش نوٹیفیکیشنز",
    accessibility: "رسائی",
    language: "زبان",
    dark_mode: "ڈارک موڈ",
    emergency: "ایمرجنسی",
    emergency_contacts: "ایمرجنسی رابطے",
    no_contacts: "کوئی رابطہ نہیں",
    support: "سپورٹ",
    help_faq: "مدد / سوالات",
    data_management: "ڈیٹا مینجمنٹ",
    export_data: "ڈیٹا برآمد کریں",
    about_us: "ہمارے بارے میں",
    sign_out: "سائن آؤٹ",

    permissionDenied: "اجازت مسترد",
    locationPermissionRequired: "آپ کی لوکیشن کی اجازت ضروری ہے۔",
    locationFetched: "لوکیشن حاصل کر لی گئی!",
    latitude: "عرض بلد",
    longitude: "طول بلد",
    error: "خرابی",
    unableToFetchLocation: "لوکیشن حاصل نہیں کی جا سکی۔",
    holdForEmergency: "ایمرجنسی کے لیے دبا کر رکھیں",
    tapHoldInfo: "ایمرجنسی موڈ فعال کرنے کے لیے 3 سیکنڈ تک دبائیں",
    manageContacts: "ایمرجنسی رابطے منظم کریں",
    quickActions: "فوری اقدامات",
    safetyPlan: "سیفٹی پلان",
    reviewPlan: "اپنا سیفٹی پلان دیکھیں",
    chatBot: "چیٹ بوٹ",
    talkAI: "AI اسسٹنٹ سے بات کریں",
    report: "رپورٹ",
    secureReport: "محفوظ رپورٹنگ",
    addLocation: "لوکیشن شامل کریں",
    connectLocation: "اپنی لوکیشن جوڑیں",
    emergencyHotlines: "ایمرجنسی ہاٹ لائنز",
    policeEmergency: "پولیس ایمرجنسی",
    ambulance: "ایمرجنسی ایمبولینس",
    womenHelpline: "خواتین ہیلپ لائن",
    available247: "24/7 خدمات",
    emergency: "ایمرجنسی",
    emergencySubtitle: "فوری امدادی رابطے",
    shelters: "شیلٹرز",
    sheltersSubtitle: "قریبی محفوظ جگہیں تلاش کریں",
    legalAid: "قانونی امداد",
    legalAidSubtitle: "قانونی مشورہ اور مدد حاصل کریں",
    helplines: "ہیلپ لائنز",
    helplinesSubtitle: "اب کسی سے بات کریں",
    therapy: "تھراپی",
    therapySubtitle: "تھراپسٹ تلاش کریں",
    knowRights: "اپنے حقوق جانیں",
    knowRightsSubtitle: "اپنے حقوق کے بارے میں جانیں",

    add_report: "نیا رپورٹ شامل کریں",
    title: "عنوان (اختیاری)",
    description: "تفصیل",
    add_image: "تصویر شامل کریں",
    gallery: "گیلری",
    camera: "کیمرہ",
    report_anonymously: "گمنام رپورٹ",
    save_report: "رپورٹ محفوظ کریں",
  },
};


export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState("en");

  const changeLanguage = (lang) => {
    setLanguage(lang);
  };

  const t = (key, params) => {
    let text = translations[language][key] || key;
    if (params) {
      Object.keys(params).forEach(
        (p) => (text = text.replace(`{${p}}`, params[p]))
      );
    }
    return text;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, changeLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}

