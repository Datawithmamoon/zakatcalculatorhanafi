# Home Page and Calculator Routing

## Goal

Turn `/` into a bilingual calculator-selection page while preserving the existing Zakat and Haq Mehr calculators as separate, unchanged experiences.

## Implementation

1. **Relocate the Zakat calculator**
   - Move the current Zakat page UI, provider, wizard, footer, and supporting content from `/` to a new `/zakat-calculator` route.
   - Preserve its calculation logic, live pricing, saved state, exports, accessibility behavior, and visual design.

2. **Build the new bilingual home page**
   - Replace `/` with a focused “What would you like to calculate?” selection screen.
   - Use the existing emerald/gold branding, typography, spacing, shell, semantic tokens, and card/button components.
   - Provide two large, accessible options linking to `/zakat-calculator` and `/haq-mehr-calculator`.
   - Add equivalent Urdu copy and keep the existing saved language preference and RTL behavior.

3. **Update navigation and internal links**
   - Keep the brand/logo linked to `/`.
   - Point the public “Calculator” navigation item and Zakat-specific calls to action in FAQ, Guide, and Disclaimer to `/zakat-calculator`.
   - Preserve home links in authentication, admin, error, and not-found screens where “home” is the intended destination.

4. **Update SEO and discovery**
   - Give `/` unique selection-page metadata, canonical URL, social tags, and appropriate structured data.
   - Move the existing Zakat-specific metadata and WebApplication structured data to `/zakat-calculator`, updating its canonical URL and breadcrumbs.
   - Add `/zakat-calculator` to the sitemap while retaining `/` and `/haq-mehr-calculator`.

5. **Verify the complete flow**
   - Confirm the project builds cleanly and the generated route tree recognizes the new route.
   - Test both home cards, public navigation, direct calculator URLs, language switching, Urdu RTL, mobile layout, and browser console output.
   - Confirm the Zakat wizard and Haq Mehr calculation still operate independently after the routing change.

## Technical Notes

- The new route file will use `createFileRoute("/zakat-calculator")`; the generated route tree will not be edited manually.
- Calculator business logic and live-rate infrastructure will not be changed.
- Existing design tokens and reusable UI components remain authoritative; no new visual system or dependency is needed.