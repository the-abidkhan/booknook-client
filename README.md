<div align="center">

# 📚 BookNook

**A small online library. Add a book, borrow a book, return a book.**

[![Live Site](https://img.shields.io/badge/Live%20Site-booknook--client--theta.vercel.app-8B4A2B?style=for-the-badge)](https://booknook-client-theta.vercel.app)

</div>

---

## ✨ Features

- 📖 **Browse all books** in a responsive grid with category tabs, search and sorting
- 🔐 **Secure authentication** with email/password and Google login (BetterAuth + MongoDB)
- ➕ **Add your own books** with cover image upload and total copies
- ✏️ **Manage your books**: edit with a pre-filled form, delete with a confirmation modal
- 🔄 **Borrow and return** books, and track them all in My Borrows
- 📉 **Live availability**: copies update on borrow and return, with a "Not Available" state and no double borrowing
- 🛡️ **JWT-protected API** with private routes that survive a page reload
- 🏠 **Rich home page**: Swiper banner, latest 6 New Arrivals, How It Works and Top Categories
- 💬 **Polished UX**: toast messages, loading spinners, custom 404 and dynamic page titles

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Client** | Next.js (App Router), TypeScript, Tailwind CSS, Swiper.js, react-hot-toast |
| **Auth** | BetterAuth, MongoDB Adapter, JWT |
| **Server** | Express.js, MongoDB |
| **Hosting** | Vercel |

## 🗺️ Routes

| Route | Access | Purpose |
|---|---|---|
| `/` | Public | Home |
| `/books` | Public | All books |
| `/books/:id` | Private | Details and borrow |
| `/add-book` | Private | Add a book |
| `/my-books` | Private | Edit and delete your books |
| `/my-borrows` | Private | Borrowed books and return |
| `/my-profile` | Private | Your profile |

---

<div align="center">

Made with ☕ and 📚 by **Abid Khan**

</div>