import type { Lang } from "@/lib/zakat/i18n";

export interface CalcCopy {
  fitranaNav: string;
  ushrNav: string;
  inheritanceNav: string;
  aboutNav: string;
  moreCalculators: string;

  // Fitrana
  fitranaTitle: string;
  fitranaIntro: string;
  people: string;
  peopleHint: string;
  wheatKg: string;
  wheatPrice: string;
  useAnnounced: string;
  announcedAmount: string;
  perPerson: string;
  totalWheat: string;
  totalDue: string;
  fitranaRuling: string;
  fitranaMistakes: string;
  fitranaEvidence: string;

  // Ushr
  ushrTitle: string;
  ushrIntro: string;
  quantity: string;
  quantityHint: string;
  pricePerUnit: string;
  irrigation: string;
  rain: string;
  irrigated: string;
  grossValue: string;
  rateLabel: string;
  produceDue: string;
  ushrDue: string;
  ushrRuling: string;
  ushrMistakes: string;
  ushrEvidence: string;

  // Inheritance
  inheritanceTitle: string;
  inheritanceIntro: string;
  estate: string;
  estateHint: string;
  spouse: string;
  spouseNone: string;
  husband: string;
  wife: string;
  wives: string;
  sons: string;
  daughters: string;
  father: string;
  mother: string;
  grandfather: string;
  grandmothers: string;
  brothers: string;
  sisters: string;
  heir: string;
  share: string;
  amount: string;
  each: string;
  totalDistributed: string;
  awlNote: string;
  raddNote: string;
  siblingsExcluded: string;
  grandmotherExcluded: string;
  noHeirs: string;
  inheritanceRuling: string;
  inheritanceMistakes: string;
  inheritanceEvidence: string;
  heirNames: Record<string, string>;

  // Shared
  ruling: string;
  mistakes: string;
  evidence: string;
  result: string;
  currencyNote: string;
  reset: string;

  // About
  aboutTitle: string;
  aboutIntro: string;
  aboutWhat: string;
  aboutWhatBody: string;
  aboutMethod: string;
  aboutMethodBody: string;
  aboutPrices: string;
  aboutPricesBody: string;
  aboutLimits: string;
  aboutLimitsBody: string;

  // Legal pages (Urdu rendering of the English legal text)
  privacyTitle: string;
  privacyBody: string[];
  termsTitle: string;
  termsBody: string[];
  disclaimerTitle: string;
  disclaimerBody: string[];
  legalEnglishNote: string;
}

const en: CalcCopy = {
  fitranaNav: "Fitrana",
  ushrNav: "Ushr",
  inheritanceNav: "Inheritance",
  aboutNav: "About",
  moreCalculators: "More calculators",

  fitranaTitle: "Fitrana calculator (Sadaqat al-Fitr)",
  fitranaIntro:
    "Work out Sadaqat al-Fitr for yourself and everyone in your care, using the Hanafi measure of half a sa' of wheat per person.",
  people: "Number of people",
  peopleHint: "Yourself plus every dependant you support.",
  wheatKg: "Wheat per person (kg)",
  wheatPrice: "Wheat / flour price per kg",
  useAnnounced: "Use the amount announced locally instead",
  announcedAmount: "Announced amount per person",
  perPerson: "Per person",
  totalWheat: "Total wheat equivalent",
  totalDue: "Total Fitrana due",
  fitranaRuling:
    "In the Hanafi school Sadaqat al-Fitr is wajib on every Muslim who owns Nisab-level surplus wealth on the day of Eid, and is paid on behalf of himself and his minor children. The measure is half a sa' of wheat (or its flour), or one full sa' of barley, dates or raisins — or the cash value of that food.",
  fitranaMistakes:
    "Paying after the Eid prayer without need, paying for one person only while supporting a family, or using an outdated wheat price.",
  fitranaEvidence:
    "The Prophet ﷺ made Sadaqat al-Fitr obligatory as a purification for the fasting person and food for the poor. (Sunan Abu Dawud)",

  ushrTitle: "Ushr calculator (agricultural Zakat)",
  ushrIntro:
    "Ushr is due on the produce of the land at harvest. It is a separate obligation and is never merged with wealth Zakat.",
  quantity: "Harvest quantity",
  quantityHint: "Use any unit you trade in — kilograms, maunds or bags — and price it per that unit.",
  pricePerUnit: "Market price per unit",
  irrigation: "How was the land watered?",
  rain: "Rain, springs or rivers (10%)",
  irrigated: "Tube well, canal or purchased water (5%)",
  grossValue: "Value of the harvest",
  rateLabel: "Applicable rate",
  produceDue: "Produce due (in kind)",
  ushrDue: "Ushr payable",
  ushrRuling:
    "According to Imam Abu Hanifa, Ushr is due on any quantity of produce of the land — there is no Nisab and no Hawl. One tenth is due where irrigation is natural, and one twentieth where it is artificial and costly. Cultivation expenses are not deducted first.",
  ushrMistakes:
    "Adding crop value to cash and paying only 2.5%, deducting farming expenses before calculating, or waiting a year before paying.",
  ushrEvidence: "\u201cOn that watered by rain, a tenth.\u201d (Sahih al-Bukhari)",

  inheritanceTitle: "Islamic inheritance calculator (Faraid)",
  inheritanceIntro:
    "Distribute an estate among the closest heirs according to Hanafi Faraid. Enter the estate remaining after funeral expenses, debts and any valid bequest (up to one third).",
  estate: "Net estate to distribute",
  estateHint: "After funeral costs, debts and a bequest of at most one third.",
  spouse: "Surviving spouse",
  spouseNone: "None",
  husband: "Husband",
  wife: "Wife",
  wives: "Number of wives",
  sons: "Sons",
  daughters: "Daughters",
  father: "Father is alive",
  mother: "Mother is alive",
  grandfather: "Paternal grandfather is alive",
  grandmothers: "Grandmothers",
  brothers: "Full brothers",
  sisters: "Full sisters",
  heir: "Heir",
  share: "Share",
  amount: "Amount",
  each: "each",
  totalDistributed: "Total distributed",
  awlNote:
    "The fixed shares exceeded the estate, so every share was reduced proportionally ('Awl).",
  raddNote: "There was no residuary heir, so the remainder returned to the sharers (Radd).",
  siblingsExcluded: "Brothers and sisters are excluded by a son, the father or the grandfather.",
  grandmotherExcluded: "A grandmother does not inherit while the mother is alive.",
  noHeirs: "Add at least one surviving heir to see the distribution.",
  inheritanceRuling:
    "Fixed shares (furud) are given first to the spouse, parents, grandparents and daughters; whatever remains goes to the residuaries ('asaba), where a male receives the portion of two females. If the fixed shares exceed the estate they are scaled down ('Awl); if a residue remains with no residuary it returns to the sharers (Radd).",
  inheritanceMistakes:
    "Dividing the estate before settling debts, treating a gift made in the lifetime as inheritance, or bequeathing more than one third to a non-heir.",
  inheritanceEvidence:
    "\u201cAllah instructs you concerning your children: for the male, what is equal to the share of two females.\u201d (Qur'an 4:11)",
  heirNames: {
    husband: "Husband",
    wife: "Wife / wives",
    mother: "Mother",
    father: "Father",
    grandfather: "Paternal grandfather",
    grandmother: "Grandmother(s)",
    sons: "Sons",
    daughters: "Daughters",
    fullBrothers: "Full brothers",
    fullSisters: "Full sisters",
  },

  ruling: "Hanafi ruling",
  mistakes: "Common mistakes",
  evidence: "Evidence",
  result: "Result",
  currencyNote: "Amounts are shown in the currency set by the site administrator.",
  reset: "Reset",

  aboutTitle: "About this calculator",
  aboutIntro:
    "A free, private set of Islamic finance calculators built strictly on Hanafi fiqh, in English and Urdu.",
  aboutWhat: "What this site offers",
  aboutWhatBody:
    "A step-by-step Zakat calculator with education at every step, plus separate Fitrana, Ushr and inheritance (Faraid) calculators, a Hanafi Zakat guide, and answers to common questions.",
  aboutMethod: "Our method",
  aboutMethodBody:
    "Every ruling follows the Hanafi school. Nisab is 87.48 grams of gold or 612.36 grams of silver, Zakat is 2.5% of net Zakatable wealth after a full lunar year, women's gold jewellery is Zakatable, and tools of trade are excluded.",
  aboutPrices: "Prices and data",
  aboutPricesBody:
    "Gold and silver prices are fetched from public market data and can be overridden by the site administrator. Your calculation figures stay on your own device and are never uploaded.",
  aboutLimits: "Limits",
  aboutLimitsBody:
    "These calculators are educational tools. Complex estates, business structures and unusual family situations should be referred to a qualified Hanafi Mufti.",

  privacyTitle: "Privacy Policy",
  privacyBody: [],
  termsTitle: "Terms & Conditions",
  termsBody: [],
  disclaimerTitle: "Disclaimer",
  disclaimerBody: [],
  legalEnglishNote: "",
};

const ur: CalcCopy = {
  fitranaNav: "فطرانہ",
  ushrNav: "عشر",
  inheritanceNav: "میراث",
  aboutNav: "تعارف",
  moreCalculators: "مزید کیلکولیٹر",

  fitranaTitle: "فطرانہ کیلکولیٹر (صدقۃ الفطر)",
  fitranaIntro:
    "اپنے اور اپنے زیرِ کفالت افراد کا صدقۃ الفطر معلوم کریں — حنفی مقدار نصف صاع گندم فی کس کے حساب سے۔",
  people: "افراد کی تعداد",
  peopleHint: "خود اور وہ تمام افراد جن کی کفالت آپ کے ذمے ہے۔",
  wheatKg: "فی کس گندم (کلوگرام)",
  wheatPrice: "گندم / آٹے کی فی کلو قیمت",
  useAnnounced: "مقامی طور پر اعلان کردہ رقم استعمال کریں",
  announcedAmount: "فی کس اعلان کردہ رقم",
  perPerson: "فی کس",
  totalWheat: "کل گندم کے برابر",
  totalDue: "کل واجب فطرانہ",
  fitranaRuling:
    "فقہ حنفی میں صدقۃ الفطر ہر اس مسلمان پر واجب ہے جو عید کے دن حاجتِ اصلیہ سے زائد نصاب کا مالک ہو، اور وہ اپنی اور اپنی نابالغ اولاد کی طرف سے ادا کرے گا۔ مقدار نصف صاع گندم (یا آٹا) یا ایک صاع جَو، کھجور یا کشمش، یا اس کی قیمت ہے۔",
  fitranaMistakes:
    "بلا عذر نمازِ عید کے بعد ادا کرنا، پورے گھرانے کے بجائے صرف ایک فرد کا ادا کرنا، یا پرانی قیمت پر حساب لگانا۔",
  fitranaEvidence:
    "نبی کریم ﷺ نے صدقۃ الفطر روزے دار کے لیے پاکیزگی اور مساکین کے لیے خوراک کے طور پر مقرر فرمایا۔ (سنن ابو داؤد)",

  ushrTitle: "عشر کیلکولیٹر (زرعی زکوٰۃ)",
  ushrIntro:
    "زمین کی پیداوار پر کٹائی کے وقت عشر واجب ہوتا ہے۔ یہ الگ عبادت ہے اور مالی زکوٰۃ میں شامل نہیں کی جاتی۔",
  quantity: "پیداوار کی مقدار",
  quantityHint: "جو پیمانہ آپ استعمال کرتے ہیں (کلو، من، بوری) وہی لکھیں اور قیمت اسی کے حساب سے دیں۔",
  pricePerUnit: "فی اکائی بازاری قیمت",
  irrigation: "زمین کو پانی کیسے ملا؟",
  rain: "بارش، چشمے یا دریا (دسواں حصہ)",
  irrigated: "ٹیوب ویل، نہر یا خریدا ہوا پانی (بیسواں حصہ)",
  grossValue: "پیداوار کی مالیت",
  rateLabel: "قابلِ اطلاق شرح",
  produceDue: "واجب پیداوار (جنس میں)",
  ushrDue: "واجب عشر",
  ushrRuling:
    "امام ابو حنیفہؒ کے نزدیک زمین کی ہر مقدار پیداوار پر عشر واجب ہے — نہ نصاب کی شرط ہے نہ حول کی۔ قدرتی آبپاشی پر دسواں حصہ اور مصنوعی و پرخرچ آبپاشی پر بیسواں حصہ واجب ہے۔ کاشت کے اخراجات پہلے منہا نہیں کیے جاتے۔",
  ushrMistakes:
    "فصل کی قیمت نقدی میں شامل کر کے صرف ڈھائی فیصد ادا کرنا، اخراجات منہا کرنا، یا سال گزرنے کا انتظار کرنا۔",
  ushrEvidence: "”جسے بارش سیراب کرے اس میں دسواں حصہ ہے۔“ (صحیح بخاری)",

  inheritanceTitle: "اسلامی میراث کیلکولیٹر (فرائض)",
  inheritanceIntro:
    "فقہ حنفی کے مطابق ترکہ قریبی ورثاء میں تقسیم کریں۔ وہ رقم درج کریں جو تجہیز و تکفین، قرض اور جائز وصیت (زیادہ سے زیادہ ایک تہائی) کے بعد باقی بچے۔",
  estate: "قابلِ تقسیم ترکہ",
  estateHint: "تجہیز و تکفین، قرضوں اور ایک تہائی تک وصیت کے بعد باقی رقم۔",
  spouse: "زندہ شریکِ حیات",
  spouseNone: "کوئی نہیں",
  husband: "شوہر",
  wife: "بیوی",
  wives: "بیویوں کی تعداد",
  sons: "بیٹے",
  daughters: "بیٹیاں",
  father: "والد حیات ہیں",
  mother: "والدہ حیات ہیں",
  grandfather: "دادا حیات ہیں",
  grandmothers: "دادی / نانی",
  brothers: "حقیقی بھائی",
  sisters: "حقیقی بہنیں",
  heir: "وارث",
  share: "حصہ",
  amount: "رقم",
  each: "فی کس",
  totalDistributed: "کل تقسیم شدہ",
  awlNote: "مقررہ حصے ترکہ سے زیادہ ہو گئے، اس لیے تمام حصوں میں تناسب سے کمی کی گئی (عول)۔",
  raddNote: "کوئی عصبہ موجود نہیں تھا، اس لیے باقی مال اصحابِ فروض کو واپس دیا گیا (رد)۔",
  siblingsExcluded: "بیٹے، والد یا دادا کی موجودگی میں بھائی بہن محروم ہو جاتے ہیں۔",
  grandmotherExcluded: "والدہ کی موجودگی میں دادی یا نانی وارث نہیں ہوتیں۔",
  noHeirs: "تقسیم دیکھنے کے لیے کم از کم ایک وارث درج کریں۔",
  inheritanceRuling:
    "پہلے اصحابِ فروض (شریکِ حیات، والدین، دادا دادی اور بیٹیاں) کو مقررہ حصے دیے جاتے ہیں، پھر باقی مال عصبہ کو ملتا ہے جہاں مرد کو دو عورتوں کے برابر حصہ ملتا ہے۔ اگر مقررہ حصے ترکہ سے بڑھ جائیں تو تناسب سے کمی (عول) کی جاتی ہے، اور اگر عصبہ نہ ہو تو بچا ہوا مال اصحابِ فروض کو واپس (رد) کر دیا جاتا ہے۔",
  inheritanceMistakes:
    "قرض ادا کیے بغیر ترکہ تقسیم کرنا، زندگی میں دیے گئے ہبہ کو میراث سمجھنا، یا غیر وارث کے لیے ایک تہائی سے زیادہ وصیت کرنا۔",
  inheritanceEvidence:
    "”اللہ تمہیں تمہاری اولاد کے بارے میں حکم دیتا ہے: مرد کے لیے دو عورتوں کے برابر حصہ ہے۔“ (النساء ۱۱)",
  heirNames: {
    husband: "شوہر",
    wife: "بیوی / بیویاں",
    mother: "والدہ",
    father: "والد",
    grandfather: "دادا",
    grandmother: "دادی / نانی",
    sons: "بیٹے",
    daughters: "بیٹیاں",
    fullBrothers: "حقیقی بھائی",
    fullSisters: "حقیقی بہنیں",
  },

  ruling: "حنفی حکم",
  mistakes: "عام غلطیاں",
  evidence: "دلیل",
  result: "نتیجہ",
  currencyNote: "رقوم اسی کرنسی میں دکھائی جا رہی ہیں جو منتظم نے مقرر کی ہے۔",
  reset: "دوبارہ شروع",

  aboutTitle: "اس کیلکولیٹر کا تعارف",
  aboutIntro:
    "فقہ حنفی پر مبنی مفت اور محفوظ اسلامی مالیاتی کیلکولیٹرز، اردو اور انگریزی دونوں میں۔",
  aboutWhat: "اس ویب سائٹ پر کیا ہے؟",
  aboutWhatBody:
    "مرحلہ وار زکوٰۃ کیلکولیٹر جس کے ہر مرحلے پر رہنمائی موجود ہے، نیز فطرانہ، عشر اور میراث (فرائض) کے الگ کیلکولیٹر، حنفی زکوٰۃ رہنمائی اور عام سوالات کے جوابات۔",
  aboutMethod: "ہمارا طریقہ کار",
  aboutMethodBody:
    "تمام مسائل فقہ حنفی کے مطابق ہیں۔ نصاب ۸۷.۴۸ گرام سونا یا ۶۱۲.۳۶ گرام چاندی ہے، قمری سال گزرنے کے بعد خالص مالِ زکوٰۃ کا ڈھائی فیصد واجب ہے، خواتین کے زیورات پر زکوٰۃ ہے، اور آلاتِ تجارت مستثنیٰ ہیں۔",
  aboutPrices: "قیمتیں اور معلومات",
  aboutPricesBody:
    "سونے چاندی کی قیمتیں عوامی مارکیٹ ڈیٹا سے حاصل کی جاتی ہیں اور منتظم انہیں خود بھی مقرر کر سکتا ہے۔ آپ کے اعداد و شمار آپ ہی کے آلے پر رہتے ہیں، کہیں اپ لوڈ نہیں ہوتے۔",
  aboutLimits: "حدود",
  aboutLimitsBody:
    "یہ کیلکولیٹر تعلیمی مقصد کے لیے ہیں۔ پیچیدہ ترکہ، کاروباری ڈھانچے اور غیر معمولی خاندانی صورتوں میں کسی مستند حنفی مفتی صاحب سے رجوع کریں۔",

  privacyTitle: "پرائیویسی پالیسی",
  privacyBody: [
    "یہ حنفی زکوٰۃ کیلکولیٹر بنیادی طور پر پرائیویسی کو مدِ نظر رکھ کر بنایا گیا ہے۔ زکوٰۃ کا تمام حساب آپ ہی کے براؤزر یا آلے میں ہوتا ہے۔ سونا، چاندی، نقدی، کاروباری اثاثے، سرمایہ کاری، واجبات الوصول اور قرضوں کی جو رقوم آپ درج کرتے ہیں وہ کبھی ہمارے سرور پر نہیں بھیجی جاتیں۔",
    "کیا محفوظ ہوتا ہے: آپ کا زیرِ تکمیل حساب، زبان اور تھیم کی ترجیح آپ کے آلے کی مقامی اسٹوریج میں محفوظ رہتی ہے تاکہ آپ بعد میں واپس آ سکیں۔ براؤزر کا ڈیٹا صاف کر کے یا کیلکولیٹر ری سیٹ کر کے آپ اسے کسی بھی وقت ہٹا سکتے ہیں۔",
    "بیرونی معلومات: سونے، چاندی اور کرنسی کی تازہ قیمتیں عوامی مارکیٹ ڈیٹا فراہم کنندگان سے لی جاتی ہیں۔ صرف قیمت کی درخواست بھیجی جاتی ہے، آپ کی مالی تفصیلات شامل نہیں ہوتیں۔",
    "اکاؤنٹ: اکاؤنٹ صرف ان منتظمین کے لیے ہے جو قیمتیں اور مواد کا انتظام کرتے ہیں۔ اکاؤنٹ بنانے کی صورت میں صرف آپ کا ای میل تصدیق کے لیے محفوظ کیا جاتا ہے۔ ہم ذاتی معلومات کبھی فروخت نہیں کرتے۔",
  ],
  termsTitle: "شرائط و ضوابط",
  termsBody: [
    "اس ویب سائٹ کے استعمال سے آپ ان شرائط سے اتفاق کرتے ہیں۔ یہ کیلکولیٹر مفت اور تعلیمی مقصد کے لیے فراہم کیا گیا ہے۔",
    "درستگی: تمام حساب فقہ حنفی کے اصولوں کے مطابق کیا جاتا ہے، تاہم نتیجہ آپ کے فراہم کردہ اعداد و شمار اور بازاری قیمتوں پر منحصر ہے۔ حتمی ذمہ داری استعمال کنندہ کی ہے۔",
    "شرعی مشورہ نہیں: یہ ویب سائٹ کسی مستند مفتی کے فتوے کا متبادل نہیں۔ پیچیدہ مسائل میں اہلِ علم سے رجوع کریں۔",
    "دستیابی: ہم مسلسل دستیابی یا بیرونی قیمت فراہم کنندگان کے تسلسل کی ضمانت نہیں دیتے۔ خدمات وقتاً فوقتاً تبدیل یا معطل کی جا سکتی ہیں۔",
  ],
  disclaimerTitle: "اعلانِ لاتعلقی",
  disclaimerBody: [
    "یہ کیلکولیٹر صرف تعلیمی اور رہنمائی کے مقصد سے بنایا گیا ہے اور فقہ حنفی کے مشہور اقوال پر مبنی ہے۔",
    "نتائج آپ کے درج کردہ اعداد اور بازاری قیمتوں پر مبنی تخمینہ ہیں۔ قیمتیں لمحہ بہ لمحہ بدلتی ہیں، اس لیے ادائیگی سے پہلے موجودہ نرخ کی تصدیق کر لیں۔",
    "پیچیدہ صورتوں — مثلاً مشترکہ کاروبار، اقساط، پنشن فنڈ، وقف املاک یا میراث کے غیر معمولی مسائل — میں کسی مستند حنفی مفتی صاحب سے رجوع کرنا ضروری ہے۔",
    "اس ویب سائٹ کے استعمال سے پیدا ہونے والے کسی مالی یا شرعی نتیجے کی ذمہ داری ہم پر عائد نہیں ہوتی۔",
  ],
  legalEnglishNote: "اصل انگریزی متن ذیل میں موجود ہے۔",
};

export const calcCopy: Record<Lang, CalcCopy> = { en, ur };
