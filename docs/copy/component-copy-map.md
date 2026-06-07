# Component-level Copy Mapping

## Homepage
- `home.hero.headline` -> homepage.hero.headline
- `home.hero.subhead` -> homepage.hero.subhead
- `home.hero.cta.primary` -> homepage.hero.ctaPrimary
- `home.hero.cta.secondary` -> homepage.hero.ctaSecondary

## Features Page
- `features.h1` -> features.page.h1
- `features.card.enhance.title` -> features.cards.enhance.title
- `features.card.enhance.desc` -> features.cards.enhance.desc
- `features.card.bgremove.title` -> features.cards.bgremove.title
- `features.card.bgremove.desc` -> features.cards.bgremove.desc

## Editor
- `editor.upload.default` -> editor.upload.default
- `editor.upload.helper` -> editor.upload.helper
- `editor.action.generate` -> editor.actions.generate
- `editor.state.loading` -> editor.states.loading
- `editor.error.fileType` -> editor.errors.fileType
- `editor.error.fileSize` -> editor.errors.fileSize
- `editor.error.network` -> editor.errors.network

## Pricing
- `pricing.h1` -> pricing.h1
- `pricing.plan.free.name` -> pricing.free
- `pricing.plan.pro.name` -> pricing.pro
- `pricing.plan.team.name` -> pricing.team
- `pricing.plan.free.cta` -> pricing.ctaFree
- `pricing.plan.pro.cta` -> pricing.ctaPro
- `pricing.plan.team.cta` -> pricing.ctaTeam

## FAQ
- `faq.item.1.q` -> faq.q1
- `faq.item.1.a` -> faq.a1
- `faq.item.2.q` -> faq.q2
- `faq.item.2.a` -> faq.a2

## Legal/Footer
- `footer.legal.privacy` -> legal.links.privacy
- `footer.legal.terms` -> legal.links.terms
- `footer.legal.refund` -> legal.links.refund
- `footer.legal.cookie` -> legal.links.cookie

## Notes
- Keep copy keys stable across locales.
- Avoid hardcoded strings in UI components.
- Add fallbacks to `en` when target locale key is missing.
