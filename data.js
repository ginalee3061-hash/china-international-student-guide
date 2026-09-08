/*
  TEMPORARY V1 DATA
  -----------------
  This file mirrors the structure of your Google Sheet.
  Later, replace this with generated JSON files from your Sheets.
*/

export const categories = [
  {
    category_id: "CAT-001",
    category_name: "start-here",
    display_name: "Start Here",
    description: "The essentials to get settled in China.",
    status: "active",
    order: 1
  },
  {
    category_id: "CAT-002",
    category_name: "campus",
    display_name: "Campus",
    description: "Campus maps, facilities, services and student life.",
    status: "active",
    order: 2
  },
  {
    category_id: "CAT-003",
    category_name: "dorm",
    display_name: "Dorm",
    description: "Laundry, electricity, water, rules and room services.",
    status: "active",
    order: 3
  },
  {
    category_id: "CAT-004",
    category_name: "apps-services",
    display_name: "Apps & Services",
    description: "Apps you will use for everyday life in China.",
    status: "active",
    order: 4
  },
  {
    category_id: "CAT-005",
    category_name: "transportation",
    display_name: "Transportation",
    description: "Metro, buses, ride-hailing and getting around.",
    status: "active",
    order: 5
  },
  {
    category_id: "CAT-006",
    category_name: "money-payment",
    display_name: "Money & Payment",
    description: "Mobile payments, bank cards and everyday spending.",
    status: "active",
    order: 6
  },
  {
    category_id: "CAT-007",
    category_name: "internet",
    display_name: "Internet",
    description: "Campus Wi-Fi, mobile data and getting online.",
    status: "active",
    order: 7
  }
];

export const items = [
  {
    item_id: "APP-001",
    category_id: "CAT-004",
    name: "Alipay",
    chinese_name: "支付宝",
    item_type: "app",
    short_description: "Mobile payment and everyday services.",
    who_needs_it: "Everyone",
    platform: "iOS, Android",
    importance: "essential",
    featured: "yes",
    status: "active"
  },
  {
    item_id: "APP-002",
    category_id: "CAT-004",
    name: "WeChat",
    chinese_name: "微信",
    item_type: "app",
    short_description: "Messaging, payments and campus communication.",
    who_needs_it: "Everyone",
    platform: "iOS, Android",
    importance: "essential",
    featured: "yes",
    status: "active"
  },
  {
    item_id: "APP-003",
    category_id: "CAT-004",
    name: "DiDi",
    chinese_name: "滴滴",
    item_type: "app",
    short_description: "Ride-hailing and city transportation.",
    who_needs_it: "Everyone",
    platform: "iOS, Android",
    importance: "useful",
    featured: "no",
    status: "active"
  },
  {
    item_id: "TRA-001",
    category_id: "CAT-005",
    name: "Metro",
    chinese_name: "地铁",
    item_type: "transport",
    short_description: "How to navigate and pay for the metro.",
    who_needs_it: "Everyone",
    platform: "all",
    importance: "essential",
    featured: "yes",
    status: "active"
  },
  {
    item_id: "FAC-001",
    category_id: "CAT-003",
    name: "Laundry",
    chinese_name: "洗衣房",
    item_type: "facility",
    short_description: "Dormitory laundry room and machines.",
    who_needs_it: "Dorm residents",
    platform: "all",
    importance: "useful",
    featured: "yes",
    status: "active"
  },
  {
    item_id: "FAC-002",
    category_id: "CAT-007",
    name: "Campus Wi-Fi",
    chinese_name: "校园 Wi-Fi",
    item_type: "service",
    short_description: "Connect to university internet.",
    who_needs_it: "Students",
    platform: "all",
    importance: "essential",
    featured: "yes",
    status: "active"
  }
];

export const guides = [
  {
    guide_id: "GUIDE-001",
    item_id: "APP-001",
    title: "How to register Alipay",
    guide_type: "setup",
    user_question: "How do I create my Alipay account?",
    short_description: "Set up Alipay with a phone number and identity information.",
    platform: "iOS, Android",
    difficulty: "Beginner",
    time_required: "5–10 min",
    featured: true,
    status: "published"
  },
  {
    guide_id: "GUIDE-002",
    item_id: "APP-001",
    title: "How to add a foreign bank card",
    guide_type: "payment",
    user_question: "How do I connect my foreign bank card to Alipay?",
    short_description: "Add an eligible bank card for everyday payments.",
    platform: "iOS, Android",
    difficulty: "Beginner",
    time_required: "5 min",
    featured: false,
    status: "published"
  },
  {
    guide_id: "GUIDE-003",
    item_id: "TRA-001",
    title: "How to take the Metro with Alipay",
    guide_type: "transport",
    user_question: "How can I use Alipay to ride the metro?",
    short_description: "A step-by-step metro guide using Alipay.",
    platform: "iOS, Android",
    difficulty: "Beginner",
    time_required: "3–5 min",
    featured: true,
    status: "published"
  },
  {
    guide_id: "GUIDE-004",
    item_id: "APP-002",
    title: "How to use WeChat",
    guide_type: "setup",
    user_question: "What should I set up first in WeChat?",
    short_description: "Coming soon.",
    platform: "iOS, Android",
    difficulty: "Beginner",
    time_required: "",
    featured: false,
    status: "collecting"
  }
];

export const steps = [
  {
    step_id: "GUIDE-001-S01",
    guide_id: "GUIDE-001",
    step_number: 1,
    step_title: "Open Alipay",
    instruction: "Open the Alipay app.",
    tip: "",
    warning: "",
    image_id: "IMG-001",
    image_path: "",
    alt_text: "Alipay home screen",
    status: "published"
  },
  {
    step_id: "GUIDE-001-S02",
    guide_id: "GUIDE-001",
    step_number: 2,
    step_title: "Start registration",
    instruction: "Tap the registration button.",
    tip: "",
    warning: "",
    image_id: "IMG-002",
    image_path: "",
    alt_text: "Alipay registration screen",
    status: "published"
  },
  {
    step_id: "GUIDE-001-S03",
    guide_id: "GUIDE-001",
    step_number: 3,
    step_title: "Enter your phone number",
    instruction: "Enter a phone number that can receive SMS messages.",
    tip: "Use the number you can reliably access while living in China.",
    warning: "",
    image_id: "IMG-003",
    image_path: "",
    alt_text: "Phone number entry screen",
    status: "published"
  },
  {
    step_id: "GUIDE-001-S04",
    guide_id: "GUIDE-001",
    step_number: 4,
    step_title: "Verify your number",
    instruction: "Enter the verification code sent by SMS.",
    tip: "",
    warning: "",
    image_id: "IMG-004",
    image_path: "",
    alt_text: "SMS verification screen",
    status: "published"
  },
  {
    step_id: "GUIDE-001-S05",
    guide_id: "GUIDE-001",
    step_number: 5,
    step_title: "Enter your identity card number",
    instruction: "Tap the non-Chinese mainland ID option if applicable, then continue with your identity details.",
    tip: "",
    warning: "",
    image_id: "IMG-005",
    image_path: "",
    alt_text: "Identity information screen",
    status: "published"
  },
  {
    step_id: "GUIDE-001-S06",
    guide_id: "GUIDE-001",
    step_number: 6,
    step_title: "Enter your passport number",
    instruction: "Enter your passport information as requested.",
    tip: "",
    warning: "",
    image_id: "IMG-006",
    image_path: "",
    alt_text: "Passport information screen",
    status: "published"
  },
  {
    step_id: "GUIDE-001-S07",
    guide_id: "GUIDE-001",
    step_number: 7,
    step_title: "Go to settings",
    instruction: "Open your account settings.",
    tip: "",
    warning: "",
    image_id: "IMG-007",
    image_path: "",
    alt_text: "Alipay settings",
    status: "published"
  },
  {
    step_id: "GUIDE-001-S08",
    guide_id: "GUIDE-001",
    step_number: 8,
    step_title: "Go to Account and Security",
    instruction: "Open Account and Security.",
    tip: "",
    warning: "",
    image_id: "IMG-008",
    image_path: "",
    alt_text: "Account and Security settings",
    status: "published"
  },
  {
    step_id: "GUIDE-001-S09",
    guide_id: "GUIDE-001",
    step_number: 9,
    step_title: "Set your email and identity information",
    instruction: "Complete the requested email and identity information.",
    tip: "",
    warning: "",
    image_id: "IMG-009",
    image_path: "",
    alt_text: "Email and identity settings",
    status: "published"
  },

  {
    step_id: "GUIDE-002-S01",
    guide_id: "GUIDE-002",
    step_number: 1,
    step_title: "Open Bank Cards",
    instruction: "Open Alipay and go to the Bank Cards section.",
    tip: "",
    warning: "",
    image_id: "IMG-010",
    image_path: "",
    alt_text: "Alipay Bank Cards screen",
    status: "published"
  },
  {
    step_id: "GUIDE-002-S02",
    guide_id: "GUIDE-002",
    step_number: 2,
    step_title: "Add your card",
    instruction: "Choose the option to add a bank card and enter the requested details.",
    tip: "",
    warning: "",
    image_id: "IMG-011",
    image_path: "",
    alt_text: "Add bank card screen",
    status: "published"
  },

  {
    step_id: "GUIDE-003-S01",
    guide_id: "GUIDE-003",
    step_number: 1,
    step_title: "Open Alipay",
    instruction: "Open Alipay before entering the metro station.",
    tip: "",
    warning: "",
    image_id: "IMG-020",
    image_path: "",
    alt_text: "Alipay home screen for metro",
    status: "published"
  },
  {
    step_id: "GUIDE-003-S02",
    guide_id: "GUIDE-003",
    step_number: 2,
    step_title: "Open the transport card",
    instruction: "Find the metro or transport card function in Alipay.",
    tip: "",
    warning: "",
    image_id: "IMG-021",
    image_path: "",
    alt_text: "Alipay transport card",
    status: "published"
  },
  {
    step_id: "GUIDE-003-S03",
    guide_id: "GUIDE-003",
    step_number: 3,
    step_title: "Scan at the gate",
    instruction: "Use the QR code at the metro gate as instructed by the app.",
    tip: "",
    warning: "The exact screen and metro options can vary by city and may change over time.",
    image_id: "IMG-022",
    image_path: "",
    alt_text: "Metro gate QR code screen",
    status: "published"
  }
];

export const related = [
  {
    relation_id: "REL-001",
    from_id: "GUIDE-003",
    to_id: "GUIDE-001",
    relation_type: "related",
    label: "Setup Alipay first",
    order: 1
  },
  {
    relation_id: "REL-002",
    from_id: "GUIDE-002",
    to_id: "GUIDE-001",
    relation_type: "prerequisite",
    label: "Set up Alipay first",
    order: 1
  }
];

export const faq = [
  {
    faq_id: "FAQ-001",
    category_id: "CAT-004",
    item_id: "APP-001",
    question: "Do I need Alipay as an international student?",
    answer: "It is one of the important everyday apps to learn because it can be used for payments and many local services.",
    related_guide_id: "GUIDE-001",
    status: "published"
  }
];
