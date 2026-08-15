# Integrated Technology Solutions — Premium Website

## Features
- Premium responsive website
- AI chatbot with secure server-side API integration
- Automatic inquiry/quotation collection into `data/inquiries.json`
- Facebook Messenger integration via environment variable
- Google Maps embed configured by `MAP_QUERY`
- Mobile menu and quotation modal
- SVG company logo
- Simple admin inquiry endpoint: `/admin?token=YOUR_ADMIN_TOKEN`

## Run locally
1. Install Node.js 18+.
2. Copy `.env.example` to `.env` and set values. If you use a hosting platform, add these as environment variables instead.
3. Start with `npm start`.
4. Open `http://localhost:3000`.

## AI
Set `OPENAI_API_KEY` on the server. The browser never receives the secret key.
If no key is configured, the chatbot falls back to a demo response.

## Replace before launch
- Phone number and email in `public/index.html`
- `MESSENGER_URL`
- `MAP_QUERY`
- Company address/business hours
- Project photos and project descriptions
- `ADMIN_TOKEN`

For production, move inquiry storage to a managed database and add proper authentication/rate limiting to the admin endpoint.
