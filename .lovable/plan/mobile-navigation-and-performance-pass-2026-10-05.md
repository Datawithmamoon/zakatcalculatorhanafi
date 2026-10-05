# Mobile navigation and performance pass

## What will change
- Rework the shared public header into a two-row mobile layout: brand on the first row, wrapping navigation and language control below it at 320px.
- Keep the current desktop header appearance and preserve Urdu RTL ordering and alignment.
- Lazy-load noncritical educational/reference panels and the Zakat wizard’s heavier step-specific UI.
- Defer derived calculator results while users are actively typing so rapid keystrokes do not repeatedly run calculations.
- Preserve all existing calculator formulas, Hanafi rules, routes, copy, and styling.

## Verification
- Test the requested pages at 320px and representative 360–430px widths for clipping and horizontal page scroll.
- Test English and Urdu navigation, calculator inputs/results, and confirm desktop remains intact.
- Check the generated bundles and current build/runtime diagnostics.

## Technical details
- Use responsive grid/flex constraints (`minmax(0,1fr)`, `min-w-0`, wrapping controls) in the shared header.
- Use React `lazy`, `Suspense`, and deferred input state only at presentation boundaries; calculation functions remain unchanged.
