# Legal, privacy, and compliance

The agent is not a lawyer. Flag likely obligations, explain them plainly, say
which must be handled before launch, and recommend professional advice where
consequence is high. Never present this as legal advice.

| If the product... | Usually needs |
| --- | --- |
| Collects personal data | Privacy policy; data inventory (what, why, where, how long); deletion and export on request; GDPR/UK GDPR for European users, CCPA/CPRA for California |
| Uses analytics, ads, or tracking cookies | Consent banner where required; honor opt-out |
| Takes payments | Hosted checkout (for example Stripe Checkout) so card data never touches your servers; refunds, receipts, sales tax/VAT |
| Has user accounts | Terms of service; account deletion; age limits (COPPA under 13 in the US, higher thresholds elsewhere) |
| Handles health, financial, education, or children's data | Sector rules (for example HIPAA); stop and get advice before building |
| Ships a mobile app | App store review rules, in-app purchase rules, privacy labels |
| Sends email or SMS | Consent and unsubscribe (CAN-SPAM, TCPA, local equivalents) |
| Hosts user content | Moderation, abuse reporting, takedown process |
| Serves the public | Accessibility (WCAG) to reduce legal exposure; see `ui-engineering` |
| Shares data with vendors | Vendor data-processing agreements; data location requirements |

Output the applicable rows only, split into before-launch and later, and name
the items that need a lawyer.
