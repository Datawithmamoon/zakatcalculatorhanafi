export type Lang = "en" | "ur";

export interface Edu {
  included?: string;
  excluded?: string;
  mistakes?: string;
  ruling?: string;
  evidence?: string;
}

export interface StepCopy {
  title: string;
  intro: string;
  edu: Edu;
  fields: Record<string, string>;
}

export interface Dict {
  dir: "ltr" | "rtl";
  appName: string;
  tagline: string;
  start: string;
  next: string;
  back: string;
  reset: string;
  yes: string;
  no: string;
  step: string;
  of: string;
  currency: string;
  optional: string;
  skip: string;
  calculate: string;
  labels: Record<LabelKey, string>;
  steps: Record<StepKey, StepCopy>;
  results: Record<ResultKey, string>;

  disclaimer: string;
  savedNote: string;
}

const en: Dict = {
  dir: "ltr",
  appName: "Hanafi Zakat Calculator",
  tagline: "Calculate your Zakat precisely according to Hanafi jurisprudence.",
  start: "Start calculation",
  next: "Next",
  back: "Back",
  reset: "Reset",
  yes: "Yes",
  no: "No",
  step: "Step",
  of: "of",
  currency: "PKR",
  optional: "Optional",
  skip: "Not applicable — skip",
  calculate: "See my Zakat",
  labels: {
    included: "What is included?",
    excluded: "What is excluded?",
    mistakes: "Common mistakes",
    ruling: "Hanafi ruling",
    evidence: "Evidence",
    weight: "Weight",
    unit: "Unit",
    gram: "Gram",
    tola: "Tola",
    purity: "Purity",
    pricePerGram: "Price per gram (pure)",
    autofill: "Use reference price",
    value: "Value",
    learn: "Learn more",
    total: "Total",
    nisabBasis: "Nisab basis",
    silverNisab: "Silver Nisab (612.36 g)",
    goldNisab: "Gold Nisab (87.48 g)",
    manual: "Manual",
    silver: "Silver",
    gold: "Gold",
    theme: "Theme",
    language: "اردو",
  },
  steps: {
    hawl: {
      title: "Hawl — one lunar year",
      intro:
        "Have you owned wealth equal to or above the Nisab for one complete lunar (Hijri) year?",
      edu: {
        ruling:
          "Zakat becomes obligatory only after a full lunar year passes over Nisab-level wealth. Fluctuations during the year do not matter — only the start and end of the year.",
        mistakes:
          "Using the solar (Gregorian) year instead of the lunar year, or restarting the year each time wealth changes.",
        evidence:
          "\u201cNo Zakat is due on wealth until a year passes over it.\u201d (Sunan Abu Dawud)",
      },
      fields: {},
    },
    gold: {
      title: "Gold",
      intro: "Enter all gold you own — jewellery, coins, bars.",
      edu: {
        included:
          "All gold, whether worn, stored, gifted or kept as investment. Karat purity is applied automatically.",
        excluded: "Gold-plated items and artificial jewellery containing no real gold.",
        mistakes:
          "Assuming everyday-use jewellery is exempt. In the Hanafi school, women's gold jewellery IS zakatable.",
        ruling:
          "Gold and silver are zakatable regardless of use or intention (Hanafi). Value is taken at current market price on the Zakat due date.",
        evidence:
          "\u201cThose who hoard gold and silver and do not spend it in the way of Allah...\u201d (Qur'an 9:34)",
      },
      fields: {},
    },
    silver: {
      title: "Silver",
      intro: "Enter all silver you own — jewellery, utensils, coins, bars.",
      edu: {
        included: "All silver items including utensils and ornaments.",
        excluded: "A man's single silver ring (within Shariah limit) is still zakatable by value.",
        mistakes: "Ignoring small silver items — their combined value often crosses Nisab.",
        ruling: "Silver is zakatable at market value; purity is applied like gold.",
      },
      fields: {},
    },
    cash: {
      title: "Cash & bank",
      intro: "Every form of liquid money you hold.",
      edu: {
        included:
          "Cash at home and in wallet, current and savings accounts, mobile wallets, prize bonds (at face value), and foreign currency converted to your currency.",
        excluded: "Interest amounts must be given away separately in charity, not counted as Zakat.",
        mistakes: "Forgetting mobile wallets, prize bonds or foreign currency held abroad.",
        ruling: "All cash is fully zakatable at 2.5%.",
      },
      fields: {
        home: "Cash at home",
        wallet: "Cash in wallet",
        bank: "Cash in bank",
        current: "Current accounts",
        savings: "Savings accounts",
        prizeBonds: "Prize bonds (face value)",
        easypaisa: "EasyPaisa",
        jazzcash: "JazzCash",
        foreign: "Foreign currency (converted)",
      },
    },
    business: {
      title: "Business assets",
      intro: "Wealth held for trade.",
      edu: {
        included:
          "Trading stock, inventory, raw materials that become part of the product, goods for sale, business cash and business receivables — valued at current selling price.",
        excluded:
          "Machinery, equipment, delivery vehicles, shop fittings and the premises themselves — these are tools of trade, not merchandise.",
        mistakes: "Valuing stock at cost price instead of current market value.",
        ruling: "Urud al-tijarah (goods of trade) are zakatable at their market value on the due date.",
      },
      fields: {
        stock: "Trading stock",
        inventory: "Inventory / raw materials",
        goods: "Goods for sale",
        cash: "Business cash",
        receivables: "Business receivables",
      },
    },
    investments: {
      title: "Investments",
      intro: "Only Shariah-relevant zakatable portions are counted.",
      edu: {
        included:
          "Shares held for trading (full market value), Islamic funds, mutual funds, crypto assets, and gold/silver ETFs backed by real metal.",
        excluded:
          "For long-term shares held for dividends only, Zakat is due on the zakatable assets of the company (cash, stock, receivables) rather than the whole share price — enter that portion.",
        mistakes: "Skipping crypto, or counting pension funds you cannot yet access.",
        ruling:
          "Shares bought with the intention to resell are trade goods and fully zakatable at market value.",
      },
      fields: {
        shares: "Shares (market value)",
        mutualFunds: "Mutual funds",
        islamic: "Islamic investments / Sukuk",
        crypto: "Crypto assets",
        goldEtf: "Gold ETF",
        silverEtf: "Silver ETF",
      },
    },
    receivables: {
      title: "Money owed to you",
      intro: "Classify each loan by how likely you are to recover it.",
      edu: {
        included: "Loans to trustworthy people and confirmed salaries or payments due to you.",
        excluded:
          "Debts denied by the borrower or with no realistic hope of recovery are excluded until actually received.",
        mistakes: "Counting bad debt as an asset, or ignoring recoverable loans altogether.",
        ruling:
          "Hanafi jurists classify debt as strong (dayn qawi — zakatable yearly), weak/uncertain (pay when received), and unrecoverable (no Zakat). Only strong debt is added here.",
      },
      fields: {
        likely: "Highly likely to recover",
        uncertain: "Uncertain (pay when received)",
        bad: "Bad debt (excluded)",
      },
    },
    agriculture: {
      title: "Agricultural produce (Ushr)",
      intro: "Agricultural Zakat is a separate obligation and is NOT merged with wealth Zakat.",
      edu: {
        ruling:
          "In the Hanafi school Ushr is due on produce of the land: 10% for naturally irrigated land (rain/springs) and 5% where irrigation is artificial and costly. It is due at harvest, with no Nisab or Hawl condition per Imam Abu Hanifa.",
        mistakes: "Adding crop value to cash wealth and paying only 2.5% on it.",
        evidence: "\u201cOn that watered by rain, a tenth.\u201d (Sahih al-Bukhari)",
      },
      fields: {},
    },
    livestock: {
      title: "Livestock (Sa'imah)",
      intro: "Grazing livestock has its own scale and is calculated separately.",
      edu: {
        ruling:
          "Zakat on freely grazing (sa'imah) camels, cattle, goats and sheep is paid in animals per fixed tables — e.g. 40–120 goats: one goat. Stall-fed animals kept for work or personal use carry no Zakat; animals bought for resale are trade goods instead.",
        mistakes: "Paying 2.5% of livestock value instead of using the prescribed scale.",
      },
      fields: {},
    },
    excluded: {
      title: "Assets NOT included",
      intro: "Hajat-e-Asliyah — basic needs and personal-use items carry no Zakat.",
      edu: {
        ruling:
          "Zakat is due on growing wealth (mal namiy). Items in personal use or used as tools of production are excluded because they are not held for growth or trade.",
        mistakes:
          "Adding the value of your house, car or business machinery to your zakatable wealth.",
      },
      fields: {
        home: "Residential home",
        furniture: "Furniture",
        car: "Personal car",
        clothes: "Personal clothes",
        electronics: "Personal electronics",
        books: "Books",
        tools: "Tools of profession",
        machinery: "Business machinery",
        factory: "Factory equipment",
      },
    },
    liabilities: {
      title: "Liabilities",
      intro: "Only debts deductible under Hanafi fiqh.",
      edu: {
        included:
          "Debts payable now: outstanding loans, immediate bills, business payables, taxes legally due, and the instalments due within the coming year.",
        excluded:
          "The full outstanding balance of a long-term mortgage or car loan — deduct only the amount due in the coming year.",
        mistakes: "Deducting an entire 20-year housing loan and concluding no Zakat is owed.",
        ruling:
          "A debt that prevents wealth from being fully owned is deducted; deferred long-term debt is deducted only to the extent it falls due.",
      },
      fields: {
        loans: "Outstanding debts / loans",
        bills: "Immediate bills",
        businessLiabilities: "Business liabilities",
        taxes: "Taxes legally due",
      },
    },
  },
  results: {
    title: "Your Zakat summary",
    gold: "Gold value",
    silver: "Silver value",
    cash: "Cash & bank",
    business: "Business assets",
    investments: "Investments",
    receivables: "Receivables",
    totalAssets: "Total zakatable assets",
    liabilities: "Deductible liabilities",
    netWealth: "Net zakatable wealth",
    nisab: "Current Nisab",
    zakatDue: "Zakat payable",
    rate: "2.5% (1/40) of net wealth",
    notDue: "Zakat is not obligatory",
    notDueWhy: "Your net zakatable wealth is below the Nisab threshold.",
    noHawl: "Zakat is not yet due — one lunar year has not passed.",
    due: "Zakat is obligatory on you",
    print: "Print",
    pdf: "Download PDF",
    share: "Share",
    again: "Start over",
    edit: "Edit answers",
  },
  disclaimer:
    "This calculator follows Hanafi jurisprudence. For complex situations, please consult a qualified Mufti.",
  savedNote: "Your answers are saved on this device automatically.",
};

const ur: Dict = {
  dir: "rtl",
  appName: "حنفی زکوٰۃ کیلکولیٹر",
  tagline: "فقہ حنفی کے مطابق اپنی زکوٰۃ درست طریقے سے معلوم کریں۔",
  start: "حساب شروع کریں",
  next: "آگے",
  back: "پیچھے",
  reset: "دوبارہ شروع",
  yes: "جی ہاں",
  no: "نہیں",
  step: "مرحلہ",
  of: "از",
  currency: "روپے",
  optional: "اختیاری",
  skip: "لاگو نہیں — آگے بڑھیں",
  calculate: "میری زکوٰۃ دیکھیں",
  labels: {
    included: "کیا شامل ہے؟",
    excluded: "کیا شامل نہیں؟",
    mistakes: "عام غلطیاں",
    ruling: "حنفی حکم",
    evidence: "دلیل",
    weight: "وزن",
    unit: "پیمانہ",
    gram: "گرام",
    tola: "تولہ",
    purity: "کھرا پن",
    pricePerGram: "فی گرام قیمت (خالص)",
    autofill: "حوالہ قیمت لگائیں",
    value: "مالیت",
    learn: "مزید جانیں",
    total: "کل",
    nisabBasis: "نصاب کی بنیاد",
    silverNisab: "چاندی کا نصاب (612.36 گرام)",
    goldNisab: "سونے کا نصاب (87.48 گرام)",
    manual: "خود درج کریں",
    silver: "چاندی",
    gold: "سونا",
    theme: "تھیم",
    language: "English",
  },
  steps: {
    hawl: {
      title: "حولان حول — ایک قمری سال",
      intro: "کیا آپ کے پاس نصاب کے برابر یا زائد مال پر پورا ایک قمری (ہجری) سال گزر چکا ہے؟",
      edu: {
        ruling:
          "زکوٰۃ اسی وقت واجب ہوتی ہے جب نصاب کے مال پر پورا قمری سال گزر جائے۔ سال کے دوران کمی بیشی کا اعتبار نہیں، صرف سال کے شروع اور آخر کا اعتبار ہے۔",
        mistakes: "عیسوی سال کو بنیاد بنانا، یا مال بدلنے پر ہر بار سال دوبارہ شمار کرنا۔",
        evidence: "”کسی مال میں زکوٰۃ نہیں جب تک اس پر سال نہ گزر جائے۔“ (سنن ابو داؤد)",
      },
      fields: {},
    },
    gold: {
      title: "سونا",
      intro: "اپنا تمام سونا درج کریں — زیورات، سکے، بسکٹ۔",
      edu: {
        included: "ہر قسم کا سونا: زیرِ استعمال، محفوظ، تحفے میں ملا یا سرمایہ کاری کا۔",
        excluded: "گلٹ اور مصنوعی زیورات جن میں اصل سونا نہ ہو۔",
        mistakes: "یہ سمجھنا کہ روزمرہ استعمال کے زیورات پر زکوٰۃ نہیں — حنفی مسلک میں ان پر زکوٰۃ ہے۔",
        ruling: "سونا چاندی بہر صورت زکوٰۃ کے مال ہیں، موجودہ بازاری قیمت کا اعتبار ہوگا۔",
        evidence: "”جو لوگ سونا اور چاندی جمع کرتے ہیں اور اللہ کی راہ میں خرچ نہیں کرتے...“ (التوبہ ۳۴)",
      },
      fields: {},
    },
    silver: {
      title: "چاندی",
      intro: "اپنی تمام چاندی درج کریں — زیورات، برتن، سکے۔",
      edu: {
        included: "ہر قسم کی چاندی بشمول برتن اور زیورات۔",
        excluded: "مصنوعی یا چاندی کے پانی والی اشیاء۔",
        mistakes: "چھوٹی چھوٹی چاندی کی اشیاء نظر انداز کرنا، حالانکہ مجموعہ اکثر نصاب تک پہنچ جاتا ہے۔",
        ruling: "چاندی پر بازاری قیمت کے حساب سے زکوٰۃ ہے۔",
      },
      fields: {},
    },
    cash: {
      title: "نقدی و بینک",
      intro: "ہر قسم کی نقد رقم درج کریں۔",
      edu: {
        included:
          "گھر اور جیب کی نقدی، کرنٹ و سیونگ اکاؤنٹ، موبائل والٹ، پرائز بانڈ (مالیت پر) اور غیر ملکی کرنسی۔",
        excluded: "سود کی رقم الگ سے بلا نیتِ ثواب صدقہ کی جائے، وہ زکوٰۃ میں شمار نہیں۔",
        mistakes: "موبائل والٹ، پرائز بانڈ یا بیرونِ ملک رقم بھول جانا۔",
        ruling: "تمام نقدی پر ڈھائی فیصد زکوٰۃ واجب ہے۔",
      },
      fields: {
        home: "گھر کی نقدی",
        wallet: "جیب کی نقدی",
        bank: "بینک میں رقم",
        current: "کرنٹ اکاؤنٹ",
        savings: "سیونگ اکاؤنٹ",
        prizeBonds: "پرائز بانڈ",
        easypaisa: "ایزی پیسہ",
        jazzcash: "جاز کیش",
        foreign: "غیر ملکی کرنسی (تبدیل شدہ)",
      },
    },
    business: {
      title: "کاروباری اثاثے",
      intro: "تجارت کے لیے رکھا گیا مال۔",
      edu: {
        included: "مالِ تجارت، اسٹاک، خام مال، فروخت کے لیے اشیاء، کاروباری نقدی اور وصول طلب رقوم۔",
        excluded: "مشینری، اوزار، گاڑیاں، دکان کا فرنیچر اور عمارت — یہ آلاتِ تجارت ہیں، مالِ تجارت نہیں۔",
        mistakes: "اسٹاک کی قیمت لاگت پر لگانا بجائے موجودہ بازاری قیمت کے۔",
        ruling: "عروضِ تجارت پر بازاری قیمت کے مطابق زکوٰۃ واجب ہے۔",
      },
      fields: {
        stock: "مالِ تجارت",
        inventory: "اسٹاک / خام مال",
        goods: "فروخت کے لیے اشیاء",
        cash: "کاروباری نقدی",
        receivables: "کاروباری واجبات الوصول",
      },
    },
    investments: {
      title: "سرمایہ کاری",
      intro: "صرف وہ سرمایہ کاری جس پر شرعاً زکوٰۃ ہے۔",
      edu: {
        included: "تجارت کی نیت سے خریدے گئے حصص، اسلامی فنڈز، میوچل فنڈ، کرپٹو، اور سونے چاندی کے ETF۔",
        excluded:
          "صرف منافع کے لیے طویل مدتی حصص میں کمپنی کے قابلِ زکوٰۃ اثاثوں کے تناسب سے زکوٰۃ ہے، پوری قیمت پر نہیں۔",
        mistakes: "کرپٹو کو نظر انداز کرنا، یا ناقابلِ رسائی پنشن فنڈ شامل کرنا۔",
        ruling: "بیچنے کی نیت سے خریدے گئے حصص مالِ تجارت ہیں، پوری بازاری قیمت پر زکوٰۃ ہے۔",
      },
      fields: {
        shares: "حصص (بازاری قیمت)",
        mutualFunds: "میوچل فنڈز",
        islamic: "اسلامی سرمایہ کاری / صکوک",
        crypto: "کرپٹو اثاثے",
        goldEtf: "گولڈ ETF",
        silverEtf: "سلور ETF",
      },
    },
    receivables: {
      title: "لوگوں کے ذمے آپ کی رقم",
      intro: "قرض کو وصولی کے امکان کے مطابق تقسیم کریں۔",
      edu: {
        included: "قابلِ اعتماد لوگوں کو دیا گیا قرض اور یقینی واجب الادا رقوم۔",
        excluded: "منکر یا ناقابلِ وصول قرض، جب تک وصول نہ ہو زکوٰۃ نہیں۔",
        mistakes: "ڈوبے ہوئے قرض کو اثاثہ شمار کرنا، یا قابلِ وصول قرض چھوڑ دینا۔",
        ruling:
          "فقہ حنفی میں دَین قوی پر ہر سال زکوٰۃ ہے، دَین ضعیف پر وصولی کے بعد، اور ناقابلِ وصول پر زکوٰۃ نہیں۔",
      },
      fields: {
        likely: "وصولی کا قوی امکان",
        uncertain: "غیر یقینی (وصولی پر ادا کریں)",
        bad: "ڈوبا ہوا قرض (شامل نہیں)",
      },
    },
    agriculture: {
      title: "زرعی پیداوار (عشر)",
      intro: "زرعی زکوٰۃ الگ حکم رکھتی ہے اور مالی زکوٰۃ میں شامل نہیں کی جاتی۔",
      edu: {
        ruling:
          "بارانی زمین کی پیداوار پر دسواں حصہ (عشر) اور مصنوعی آبپاشی پر بیسواں حصہ (نصف عشر) واجب ہے۔ امام ابو حنیفہؒ کے نزدیک اس میں نصاب و حول کی شرط نہیں، پیداوار پر ہی واجب ہوتا ہے۔",
        mistakes: "فصل کی قیمت کو نقدی میں جمع کر کے صرف ڈھائی فیصد ادا کرنا۔",
        evidence: "”جسے بارش سیراب کرے اس میں دسواں حصہ ہے۔“ (صحیح بخاری)",
      },
      fields: {},
    },
    livestock: {
      title: "مویشی (سائمہ)",
      intro: "چرنے والے مویشیوں کا نصاب اور شرح الگ ہے۔",
      edu: {
        ruling:
          "سائمہ اونٹ، گائے، بکری پر مقررہ جدول کے مطابق جانوروں کی صورت میں زکوٰۃ ہے، مثلاً ۴۰ سے ۱۲۰ بکریوں پر ایک بکری۔ چارہ کھلا کر یا کام کے لیے رکھے جانور پر زکوٰۃ نہیں؛ تجارت کے لیے خریدے جانور مالِ تجارت ہیں۔",
        mistakes: "مویشیوں کی قیمت کا ڈھائی فیصد ادا کرنا بجائے مقررہ جدول کے۔",
      },
      fields: {},
    },
    excluded: {
      title: "جن اثاثوں پر زکوٰۃ نہیں",
      intro: "حاجاتِ اصلیہ — ذاتی ضرورت کی اشیاء پر زکوٰۃ نہیں۔",
      edu: {
        ruling: "زکوٰۃ مالِ نامی (بڑھنے والے مال) پر ہے۔ ذاتی استعمال اور آلاتِ پیداوار اس سے مستثنیٰ ہیں۔",
        mistakes: "رہائشی مکان، ذاتی گاڑی یا کاروباری مشینری کو قابلِ زکوٰۃ مال میں شامل کرنا۔",
      },
      fields: {
        home: "رہائشی مکان",
        furniture: "فرنیچر",
        car: "ذاتی گاڑی",
        clothes: "ذاتی کپڑے",
        electronics: "ذاتی برقی آلات",
        books: "کتابیں",
        tools: "پیشہ ورانہ اوزار",
        machinery: "کاروباری مشینری",
        factory: "فیکٹری کا سامان",
      },
    },
    liabilities: {
      title: "واجب الادا قرضے",
      intro: "صرف وہ قرض جو فقہ حنفی میں منہا کیے جا سکتے ہیں۔",
      edu: {
        included: "فوری واجب الادا قرض، بل، کاروباری ادائیگیاں، واجب ٹیکس اور آئندہ سال کی اقساط۔",
        excluded: "طویل المدت قرض کی پوری رقم — صرف آئندہ سال کی اقساط منہا کریں۔",
        mistakes: "بیس سالہ ہاؤس لون کی پوری رقم منہا کر کے زکوٰۃ ساقط سمجھ لینا۔",
        ruling: "وہ قرض جو ملکیت کو ناقص کر دے منہا ہوگا؛ مؤجل قرض صرف واجب الادا حصے تک۔",
      },
      fields: {
        loans: "قرضے",
        bills: "فوری بل",
        businessLiabilities: "کاروباری واجبات",
        taxes: "واجب الادا ٹیکس",
      },
    },
  },
  results: {
    title: "آپ کی زکوٰۃ کا خلاصہ",
    gold: "سونے کی مالیت",
    silver: "چاندی کی مالیت",
    cash: "نقدی و بینک",
    business: "کاروباری اثاثے",
    investments: "سرمایہ کاری",
    receivables: "واجبات الوصول",
    totalAssets: "کل قابلِ زکوٰۃ اثاثے",
    liabilities: "قابلِ کٹوتی واجبات",
    netWealth: "خالص قابلِ زکوٰۃ مال",
    nisab: "موجودہ نصاب",
    zakatDue: "واجب زکوٰۃ",
    rate: "خالص مال کا ڈھائی فیصد (چالیسواں حصہ)",
    notDue: "زکوٰۃ واجب نہیں",
    notDueWhy: "آپ کا خالص مال نصاب سے کم ہے۔",
    noHawl: "ابھی زکوٰۃ واجب نہیں — قمری سال مکمل نہیں ہوا۔",
    due: "آپ پر زکوٰۃ واجب ہے",
    print: "پرنٹ",
    pdf: "پی ڈی ایف",
    share: "شیئر",
    again: "دوبارہ شروع",
    edit: "جوابات میں ترمیم",
  },
  disclaimer:
    "یہ کیلکولیٹر فقہ حنفی کے مطابق ہے۔ پیچیدہ مسائل میں کسی مستند مفتی صاحب سے رجوع کریں۔",
  savedNote: "آپ کے جوابات خود بخود اسی ڈیوائس پر محفوظ ہو رہے ہیں۔",
};

export const dictionaries: Record<Lang, Dict> = { en, ur };
