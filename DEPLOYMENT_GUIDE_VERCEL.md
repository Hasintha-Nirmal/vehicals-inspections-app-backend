# Deploying Backend to Vercel

## Prerequisites

- **Vercel CLI**: Install globally using `npm install -g vercel` or usage via `npx vercel`.
- **Vercel Account**: Sign up at [vercel.com](https://vercel.com).

## Deployment Steps

1. **Navigate to Backend Directory**
   Open your terminal and navigate to the `backend` folder:

   ```bash
   cd "d:\DevPros\Vehical Inspection\backend"
   ```

2. **Login to Vercel**

   ```bash
   npx vercel login
   ```

   Follow the instructions to log in (email or GitHub).

3. **Deploy**
   Run the deploy command:

   ```bash
   npx vercel
   ```

   **Setup Questions:**
   - **Set up and deploy?** `Y`
   - **Which scope?** (Select your account)
   - **Link to existing project?** `N` (unless you already created one)
   - **Project name?** `vehicle-inspection-backend` (or your preference)
   - **In which directory is your code located?** `./` (Default is fine)
   - **Want to modify these settings?** `N`

4. **Environment Variables**
   Vercel needs your `.env` variables to connect to the database.
   - Go to your Vercel Dashboard for the project.
   - Click **Settings** > **Environment Variables**.
   - Add the following variables (copy from your local `.env`):
     - `MONGODB_URI`
     - `DB_NAME`
     - `JWT_SECRET` (if applicable)

   **Alternatively**, you can add them during deployment:

   ```bash
   npx vercel env add MONGODB_URI
   ```

5. **Production Deployment**
   Once tested, deploy to production:
   ```bash
   npx vercel --prod
   ```

## Notes

- The `api/index.js` file is the entry point for Vercel Serverless Functions.
- `vercel.json` routes all traffic to this function.
- The database connection is cached to reuse connections between function invocations.
