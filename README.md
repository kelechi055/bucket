
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

Create a `.env.local` file:

```bash
GEMINI_API_KEY=your_gemini_api_key
```

4. **Run the development server**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

---

## 📜 Available Scripts

| Script        | Description                        |
|---------------|------------------------------------|
| `dev`         | Starts the local development server |
| `build`       | Builds the app for production       |
| `start`       | Starts the production server        |
| `lint`        | Runs ESLint                         |

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
