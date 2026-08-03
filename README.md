# Zakat Pro

Build a Professional Hanafi Zakat Calculator Web Application



Create a modern, responsive, multilingual (Urdu + English) Islamic Zakat Calculator based strictly on Hanafi Fiqh.



Primary Goal



The calculator must help Muslims accurately determine whether Zakat is obligatory and calculate the exact amount payable according to Hanafi jurisprudence.



This application must clearly distinguish between:



- Zakatable Assets

- Non-Zakatable Assets (Hajat-e-Asliyah)

- Liabilities

- Nisab

- Hawl (One Lunar Year)



The UI must be extremely simple while the calculation engine must be comprehensive.



---



Design



Use a premium Islamic minimalist design.



Colors:



- Emerald Green

- White

- Gold accents



Typography:



- Modern clean font

- Excellent Urdu support

- RTL support for Urdu



Responsive for



- Mobile

- Tablet

- Desktop



Dark Mode



Light Mode



---



Languages



Support



English



Urdu



Allow instant switching.



---



Step-by-Step Wizard



Instead of showing a huge form, create a guided wizard.



Step 1

Personal Information



Only ask:



Have you completed one lunar year since becoming owner of Nisab?



Options



Yes



No



If No



Stop calculation and explain Hawl.



---



Step 2



Gold



Ask



Do you own gold?



If Yes



Input



Weight



Unit



Gram



Tola



Auto convert.



Choose



24K



22K



21K



18K



Allow current market price auto-fill.



Also allow manual override.



Calculate total value.



---



Step 3



Silver



Same system as Gold.



---



Step 4



Cash



Cash at home



Cash in wallet



Cash in bank



Prize bonds



EasyPaisa



JazzCash



Current Accounts



Savings Accounts



Foreign Currency



Automatically convert currencies if exchange rate available.



---



Step 5



Business



Trading stock



Inventory



Goods for sale



Business cash



Business receivables



---



Step 6



Investments



Shares



Mutual Funds



Islamic Investments



Crypto Assets



Gold ETF



Silver ETF



Only include zakatable investments according to Hanafi rules.



Explain each field.



---



Step 7



Receivables



Money people owe you.



Separate into



Highly likely to recover



Uncertain



Bad debt



Apply Hanafi rulings correctly.



---



Step 8



Agricultural Produce



Optional section.



Explain that normal agricultural zakat differs from wealth zakat.



Do not merge calculations.



---



Step 9



Livestock



Optional.



Explain separate rulings.



---



Step 10



Assets NOT Included



Provide checklist.



Residential Home



Furniture



Personal Car



Personal Clothes



Personal Electronics



Books



Tools of Profession



Business Machinery



Factory Equipment



Anything under Hajat-e-Asliyah



Explain why these are excluded.



---



Step 11



Liabilities



Outstanding debts



Immediate bills



Business liabilities



Taxes legally due



Only deduct liabilities deductible according to Hanafi fiqh.



---



Calculation Logic



Calculate



Total Zakatable Assets



Minus Eligible Liabilities



Equals Net Zakatable Wealth



Fetch latest Nisab based on Silver.



Allow manual Nisab selection.



Also show Gold Nisab.



Explain that Hanafi generally uses Silver Nisab for cash and mixed assets.



If Net Wealth < Nisab



Display



Zakat is not obligatory.



Otherwise



Calculate



Net Wealth ÷ 40



Also display



2.5%



---



Results Screen



Show



Gold Value



Silver Value



Cash



Business



Receivables



Investments



Liabilities



Net Wealth



Current Nisab



Zakat Due



Round to nearest Rupee.



Provide printable report.



Download PDF.



Print.



Share.



---



Educational Section



Every section should include



"What is included?"



"What is excluded?"



"Common mistakes"



"Hanafi ruling"



Short evidence from Qur'an or authentic Hadith without lengthy quotations.



---



Important Notes



Display disclaimer:



This calculator follows Hanafi jurisprudence.



For complex situations consult a qualified Mufti.



---



Advanced Features



Save calculations locally.



No login required.



Optional account system.



Offline support.



PWA support.



Fast loading.



SEO optimized.



Accessibility compliant.



High contrast mode.



Keyboard navigation.



Error validation.



Autosave.



Reset calculator.



---



Admin Panel



Allow admin to update



Gold Price



Silver Price



Currency Rates



Nisab



Islamic educational content



FAQs



---



Technical Stack



React



TypeScript



Tailwind CSS



Supabase



Responsive UI



Component-based architecture



Reusable calculation engine



Clean code



Well documented



Unit tested calculation logic.



---



Final Requirement



The calculation engine must be modular so every Hanafi rule can be updated independently in the future.



The application should feel like a professional Islamic financial tool rather than a simple calculator.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/67067ddc-e50d-4052-bb0e-2c643100c29f).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
