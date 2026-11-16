# Product-type essentials

During project foundation, identify which types apply (a product can match
several) and load only those sections. Each item is something founders often
discover too late; decide now whether it is in the MVP, deferred, or not
applicable. Present the result to the owner in plain language.

## Software sold to businesses or teams (B2B SaaS)

- Account structure: organization, workspaces/teams, members, roles, and
  invitations; tenant isolation per the security baseline
- Self-serve onboarding and first-run experience
- Subscriptions: plans, trials, limits, failed payments, upgrades/downgrades,
  invoices and tax
- Internal admin console for support, with audited and permission-limited
  access to customer accounts
- Audit log of who changed what
- Data export, account deletion, and offboarding

## Consumer app

- Sign-up friction, social/passwordless sign-in, account recovery
- Notifications (email/push) with preferences and unsubscribe
- Abuse, spam, and fake-account prevention
- Store-ready privacy disclosures and age requirements

## Marketplace or platform with two sides

- Separate journeys for each side; trust between strangers (verification,
  reviews, reporting)
- Payments between parties: payouts, fees, refunds, disputes, and the payment
  provider's marketplace product (for example Stripe Connect)
- Moderation, policy enforcement, and fraud

## Mobile app

- App store review rules, in-app purchase rules, release and update cadence
- Forcing or tolerating old app versions against a changing backend
- Offline and poor-connection behavior; push notifications; device permissions

## Online store or commerce

- Catalog, inventory, and stock reservation during checkout
- Taxes, shipping, returns, refunds, and order status communication
- Hosted checkout and fraud screening

## Internal tool

- Company sign-in (SSO) and role-based access
- Integration with existing systems of record; who owns the data
- Audit needs and data retention

## Content, media, or community site

- Search visibility (SEO), page speed, and sharing previews
- User-generated content: moderation, reporting, takedown
- Media storage, processing, and delivery costs

## AI-powered features

- Cost per request and monthly ceiling; caching and model choice
- Quality evaluation, fallback when the model fails or is slow
- Prompt injection and data leakage; user data sent to model providers
- Clear user expectations about accuracy
