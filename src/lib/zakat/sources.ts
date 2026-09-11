import type { Lang, StepKey } from "./i18n";

/**
 * Classical Hanafi references for each wizard step.
 *
 * Sources are the primary Hanafi fiqh texts (al-Hidayah of al-Marghinani,
 * Bada'i` al-Sana'i` of al-Kasani, Radd al-Muhtar of Ibn `Abidin, al-Fatawa
 * al-Hindiyya / `Alamgiri) together with the hadith collection references
 * those texts rely on. They are quoted as chapter/section references so a
 * reader can verify the ruling in any standard edition.
 */
export const eduSources: Record<Lang, Partial<Record<StepKey, string>>> = {
  en: {
    hawl:
      "al-Marghinani, al-Hidayah, Kitab al-Zakat (conditions of obligation); al-Kasani, Bada'i` al-Sana'i` 2/12 — a complete lunar year over Nisab. Hadith: Sunan Abu Dawud 1573, Sunan Ibn Majah 1792.",
    gold:
      "al-Hidayah, Kitab al-Zakat, Bab Zakat al-Mal; Ibn `Abidin, Radd al-Muhtar 2/298 — jewellery of gold and silver is zakatable in the Hanafi school whatever the intention. Qur'an 9:34; Sahih Muslim 987.",
    silver:
      "al-Fatawa al-Hindiyya 1/179; Bada'i` al-Sana'i` 2/17 — silver Nisab is 200 dirhams (612.36 g), valued at market price. Sahih al-Bukhari 1447.",
    cash:
      "Ibn `Abidin, Radd al-Muhtar 2/303 — currency takes the ruling of gold and silver (athman) and is zakatable in full at 2.5%.",
    business:
      "al-Hidayah, Bab Zakat al-`Urud; Bada'i` al-Sana'i` 2/20 — goods of trade are valued at market price on the Zakat due date. Sunan Abu Dawud 1562.",
    investments:
      "Radd al-Muhtar 2/272 on `urud al-tijarah; contemporary application to shares in Fatawa `Uthmani 2/45 — shares bought for resale are trade goods and zakatable at full market value.",
    receivables:
      "al-Fatawa al-Hindiyya 1/175 — dayn qawi (strong debt) is zakatable, and Zakat is paid on doubtful debt when it is actually recovered; Radd al-Muhtar 2/305.",
    agriculture:
      "al-Hidayah, Kitab al-Zakat, Bab al-`Ushr — Imam Abu Hanifa: `Ushr is due on all produce of the land with no Nisab and no Hawl. Sahih al-Bukhari 1483.",
    livestock:
      "Bada'i` al-Sana'i` 2/26–33 and al-Fatawa al-Hindiyya 1/176 — the prescribed sa'imah scale for camels, cattle and sheep. Sahih al-Bukhari 1454.",
    excluded:
      "Bada'i` al-Sana'i` 2/11 — Zakat is only on mal nami (growing wealth); hajat asliyya (home, transport, tools of the trade) are exempt. Radd al-Muhtar 2/262.",
    liabilities:
      "al-Fatawa al-Hindiyya 1/172; Radd al-Muhtar 2/260 — debts due now are deducted; long-term instalment debt is deducted only to the extent of the instalments currently owed.",
  },
  ur: {
    hawl:
      "الہدایہ، کتاب الزکاۃ (شرائطِ وجوب)؛ بدائع الصنائع ۲/۱۲ — نصاب پر پورا قمری سال گزرنا شرط ہے۔ حدیث: سنن ابو داؤد ۱۵۷۳، سنن ابن ماجہ ۱۷۹۲۔",
    gold:
      "الہدایہ، باب زکاۃ المال؛ ردّ المحتار ۲/۲۹۸ — حنفی مسلک میں سونے چاندی کے زیورات پر ہر حال میں زکوٰۃ ہے۔ القرآن ۹:۳۴؛ صحیح مسلم ۹۸۷۔",
    silver:
      "الفتاویٰ الہندیہ ۱/۱۷۹؛ بدائع الصنائع ۲/۱۷ — چاندی کا نصاب دو سو درہم یعنی ۶۱۲.۳۶ گرام ہے، بازاری قیمت کا اعتبار ہے۔ صحیح بخاری ۱۴۴۷۔",
    cash: "ردّ المحتار ۲/۳۰۳ — نقدی اثمان کے حکم میں ہے، پوری رقم پر ڈھائی فیصد زکوٰۃ واجب ہے۔",
    business:
      "الہدایہ، باب زکاۃ العروض؛ بدائع الصنائع ۲/۲۰ — مالِ تجارت کی قیمت یومِ وجوب کے بازاری نرخ پر لگائی جائے گی۔ سنن ابو داؤد ۱۵۶۲۔",
    investments:
      "ردّ المحتار ۲/۲۷۲ (عروضِ تجارت)؛ فتاویٰ عثمانی ۲/۴۵ — فروخت کی نیت سے خریدے گئے حصص مالِ تجارت ہیں، پوری بازاری قیمت پر زکوٰۃ ہے۔",
    receivables:
      "الفتاویٰ الہندیہ ۱/۱۷۵ — دَینِ قوی پر زکوٰۃ واجب ہے، اور مشکوک قرض پر وصولی کے وقت ادا کی جائے گی؛ ردّ المحتار ۲/۳۰۵۔",
    agriculture:
      "الہدایہ، باب العشر — امام ابو حنیفہؒ کے نزدیک زمین کی ہر پیداوار پر عشر ہے، نہ نصاب کی شرط نہ حول کی۔ صحیح بخاری ۱۴۸۳۔",
    livestock:
      "بدائع الصنائع ۲/۲۶–۳۳؛ الفتاویٰ الہندیہ ۱/۱۷۶ — سائمہ اونٹ، گائے اور بکریوں کا مقررہ جدول۔ صحیح بخاری ۱۴۵۴۔",
    excluded:
      "بدائع الصنائع ۲/۱۱ — زکوٰۃ صرف مالِ نامی پر ہے؛ حاجاتِ اصلیہ (مکان، سواری، آلاتِ پیشہ) مستثنیٰ ہیں۔ ردّ المحتار ۲/۲۶۲۔",
    liabilities:
      "الفتاویٰ الہندیہ ۱/۱۷۲؛ ردّ المحتار ۲/۲۶۰ — واجب الادا قرض منہا ہوگا؛ طویل المدت اقساط میں صرف واجب الادا اقساط منہا کی جائیں گی۔",
  },
};

/** References for the standalone calculators. */
export const calcSources: Record<Lang, { fitrana: string; ushr: string; inheritance: string }> = {
  en: {
    fitrana:
      "al-Hidayah, Kitab al-Zakat, Bab Sadaqat al-Fitr; al-Fatawa al-Hindiyya 1/191 — half a sa` of wheat (approx. 2.045 kg) or one sa` of barley, dates or raisins, and paying the cash value is permitted in the Hanafi school. Sahih al-Bukhari 1503, Sunan Abu Dawud 1609.",
    ushr:
      "al-Hidayah, Bab al-`Ushr; Bada'i` al-Sana'i` 2/59 — one tenth on naturally watered land, one twentieth where irrigation is costly, with no deduction of cultivation expenses per Imam Abu Hanifa. Sahih al-Bukhari 1483.",
    inheritance:
      "Qur'an 4:11–12 and 4:176; al-Sirajiyya fi al-Fara'id (al-Sajawandi) — the standard Hanafi text on fixed shares, `asaba, `Awl and Radd; al-Fatawa al-Hindiyya, Kitab al-Fara'id. Sahih al-Bukhari 6732.",
  },
  ur: {
    fitrana:
      "الہدایہ، باب صدقۃ الفطر؛ الفتاویٰ الہندیہ ۱/۱۹۱ — نصف صاع گندم (تقریباً ۲.۰۴۵ کلو) یا ایک صاع جَو، کھجور یا کشمش، اور حنفی مسلک میں قیمت دینا بھی جائز ہے۔ صحیح بخاری ۱۵۰۳، سنن ابو داؤد ۱۶۰۹۔",
    ushr:
      "الہدایہ، باب العشر؛ بدائع الصنائع ۲/۵۹ — قدرتی آبپاشی پر دسواں اور پرخرچ آبپاشی پر بیسواں حصہ، امام ابو حنیفہؒ کے نزدیک اخراجات منہا نہیں ہوں گے۔ صحیح بخاری ۱۴۸۳۔",
    inheritance:
      "القرآن ۴:۱۱–۱۲ اور ۴:۱۷۶؛ السراجیۃ فی الفرائض (سجاوندی) — اصحابِ فروض، عصبہ، عول اور رد کے حنفی اصول؛ الفتاویٰ الہندیہ، کتاب الفرائض۔ صحیح بخاری ۶۷۳۲۔",
  },
};
