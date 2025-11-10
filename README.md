# Happlicant Tech Task

Hey!
Thanks for taking the time to complete this technical challenge.
This task is designed to show your **design sense**, **frontend skills**, and **attention to detail**.

## Goal

Build a simple **Company Management App**.

The base project (Next.js + Shadcn) is already set up for you — just focus on building the functionality and UI. You'll also find a type for "Company" in the types folder.

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the database:**
   ```bash
   docker-compose up -d
   ```

3. **Run database migrations:**
   ```bash
   npx prisma migrate dev
   ```

4. **Seed the database with sample data:**
   ```bash
   npm run db:seed
   ```

5. **Start the development server:**
   ```bash
   npm run dev
   ```

The app will be available at `http://localhost:3000`.

## Requirements

### 1. Display Companies

- Fetch and display the existing companies - you can start with the dummyData.json file
- Show them in a **table** or **card grid** (bonus: build and toggle between the two views)

### 2. Add Companies

- Add a way to add a new company
- You choose your preferred way to save the data. State, localstorage, server, database etc.

### 3. Delete Companies

- Allow deleting existing companies from the list.
- No need to code an editing function (but bonus points if you do!)

## What We’re Looking For

We’re not expecting a big project — just clean, thoughtful work that shows you know how to:

- Build a **good-looking, usable interface** with Shadcn/UI
- Structure **React components** clearly
- Handle **basic state** and mutations
- Pay attention to **UX** (loading states, validation, empty states)

## How to Submit

1. **Fork this repository** to your GitHub account.
2. Complete the task in your fork.
3. Commit often and be descriptive
4. Open a **Pull Request** to this repository’s `main` branch.

Good luck, and have fun building! 🚀
— The Happlicant Team
