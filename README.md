# Setup Steps

1. Clone the repo into

2. Go to the project folder

   ```sh
   cd lead_node
   ```

3. Install packages

   ```sh
   npm install
   ```

   or

   ```sh
   pnpm install
   ```

4. Create PostgreSQL database called `lead`

5. Set up your `.env` file

   - Duplicate `.env.example` to `.env`

6. Run the dev server
   For node

   ```sh
   npm run dev:node
   ```

   If you have bun installed and want to use bun instead of ts-node

   ```sh
   npm run dev:bun
   ```
