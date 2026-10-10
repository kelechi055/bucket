
# Bucket <img src="/public/bucket-logo.png" alt="Bucket Preview" width="25"/>

**🏆 1st Place Overall & AI/ML Track Winner @ HackHounds 2025**

Personalized bucket lists powered by AI. Designed to help you explore your passions, one curated list at a time.


> [!NOTE]  
> This project is still in development. Check out the [Live Demo](https://www.youtube.com/watch?v=ZKqaYJEHWIg).

## ✨ What is Bucket?

**Bucket** is an AI-powered bucket list generator built for people exploring new places, starting internships, or just trying to discover new passions. Based on your location, interests, budget, availability, and more, it generates a list of unique experiences for you to explore.

Whether you're solo, social, outdoorsy, or a foodie, **Bucket** has something for everyone.

---

## 🚀 Features

- 🌐 AI-generated activities powered by the **Gemini API**
- 📍 Location-aware suggestions
- 💸 Personalized to your budget and availability
- 🧭 Perfect for interns and explorers in unfamiliar cities
- ✨ Smooth animated word transitions using Framer Motion
- 🧠 Dynamic sparkles and branding visuals for delight

> [!TIP]  
> Bucket learns your preferences to give you ideas you didn’t even know you were looking for.

---

## 🧰 Tech Stack

- [Next.js](https://nextjs.org/) (App Router)
- [JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
- [Tailwind CSS](https://tailwindcss.com/)
- [Framer Motion](https://www.framer.com/motion/)
- [Material UI](https://mui.com/)
- [Gemini API](https://deepmind.google/technologies/gemini/)
- [FontSource](https://www.npmjs.com/package/@fontsource) – Poppins, Inter, Inria Serif

---

## 🧪 Folder Structure

```
📦 bucket
├── .next
├── bucket
├── node_modules
├── public
│   ├── images & assets
├── src
│   ├── app
│   │   ├── api
│   │   │   └── generate
│   │   │       └── page.js      
│   │   ├── layout.js
│   │   └── page.js             
│   ├── components
│   │   ├── animated.js          
│   │   ├── bucket_item.jsx      
│   │   ├── navbar.js
│   │   ├── summerLoader.js      
│   │   ├── trusted.js
│   │   └── trusted2.js
│   └── globals.css
```

---

## 💻 Running Locally

To run Bucket locally:

Use Node 24.12 or newer in the Node 24 LTS line. With nvm, run `nvm install`
and `nvm use` from the project directory. Vercel should use Node 24.x.

1. **Clone the repository**

```bash
git clone https://github.com/kelechi055/bucket.git
cd bucket
```

2. **Install dependencies**

```bash
npm install
```

3. **Set up environment variables**

> [!NOTE]  
> You’ll need access to the Gemini API to use the generation feature.

Copy the example to `.env.local`, then replace the placeholder with your API key:

```bash
cp .env.example .env.local
```

Real `.env` files stay local and are ignored by Git. When deploying, set
`GEMINI_API_KEY` in your hosting provider's environment settings.

4. **Run the development server**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

### Clerk authentication

The app uses its existing Clerk application for sign-in, sign-up, and account
controls. `/save` requires sign-in; visitors can still use `/generate`.
Sign-in and sign-up pages are available at `/sign-in` and `/sign-up`.
Clerk preserves the requested destination after login and otherwise sends users
to `/generate`. Signing out returns to the home page.

Use valid `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` and `CLERK_SECRET_KEY` credentials
from the same existing Clerk application in your local and deployment environment.
Do not commit real keys. Production deployments need that application's production
keys and domain configuration. Run `npx -y clerk@latest doctor` to check setup.

### Saved-list storage

Signed-in users can save a generated list and revisit it at `/save` using the
Saved Lists navigation link. Lists are stored in
`users/{clerkUserId}/savedBucketLists`, newest first.

To connect Clerk sign-in to Firebase:

1. Enable Firebase Authentication in the `sunnylist-1f5a2` project.
2. In Firebase Project Settings → Service Accounts, obtain a service account
   key for that project. Set its `client_email` as `FIREBASE_CLIENT_EMAIL` and
   its `private_key` as `FIREBASE_PRIVATE_KEY` in `.env.local` and your hosting
   environment. Escaped `\n` line breaks are supported. Keep these values server-only.
3. Publish the owner-only rules in `firestore.rules` through the Firestore Rules
   tab, merging them with any existing application rules as needed.
4. Restart the app, sign in, generate a list, click Save Bucket List, and open
   Saved Lists. Check with another account that the list is not visible there.

If your Clerk app already has a Firebase custom-token template, you can instead
set `NEXT_PUBLIC_CLERK_FIREBASE_TEMPLATE` to its name. Its Firebase UID must match
the Clerk user ID. No service account environment variables are needed in that case.
Older lists under unrelated Firebase UIDs or the global `bucketLists` collection
require an explicit ownership migration; they are not exposed to all users.

---

## 📜 Available Scripts

| Script        | Description                        |
|---------------|------------------------------------|
| `dev`         | Starts the local development server |
| `build`       | Builds the app for production       |
| `start`       | Starts the production server        |
| `lint`        | Runs ESLint                         |
| `typecheck`   | Checks TypeScript without emitting files |

---

## 🤝 Contributing

Got ideas or improvements? Feel free to fork the repo, submit issues, or open a PR. All contributions are welcome.

---

## 🛡️ License

MIT License © 2025

---

## 🧠 Notes

> [!TIP]  
> This project was built with a focus on real-world usability. Whether you're a summer intern or just exploring a new city — **Bucket** makes planning adventures fun, personalized, and effortless.

>[!NOTE]
> Bucket is not fully responsive on mobile due to time constraints; it's best used on desktop.

> [!CAUTION]  
> Still polishing things! Expect frequent changes as we work toward the full release.
