# NAVII GPS platform

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Website enquiry delivery

The `/contact` form succeeds only after at least one NAVII team notification
channel accepts the enquiry. Configure one or more of these production options:

- `RESEND_API_KEY`, `CONTACT_ENQUIRY_EMAIL`, and `CONTACT_FROM_EMAIL` for email.
- `WHATSAPP_ACCESS_TOKEN`, `WHATSAPP_PHONE_NUMBER_ID`,
  `WHATSAPP_GRAPH_VERSION`, and `CONTACT_WHATSAPP_TO` for an internal WhatsApp
  notification.
- `CONTACT_WEBHOOK_URL` and optional `CONTACT_WEBHOOK_TOKEN` for a CRM or
  automation webhook.

If every configured channel fails, the form shows a direct WhatsApp fallback
instead of claiming that the enquiry was received.

International SEO is held by default while India is the active priority.
Country and international-city routes stay available but use `noindex, follow`
and are excluded from the sitemap. Set `INTERNATIONAL_SEO_ENABLED=true` at
build time to restore them to the public sitemap and search index.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
