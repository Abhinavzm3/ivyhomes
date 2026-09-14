# Ivy Homes Assignment

Here is my submission for the Ivy Homes frontend assignment. I built this using React (Vite) and Tailwind, along with a small Express proxy server to handle some of the API quirks.

## How to run it

You'll need two terminals to run the frontend and the proxy server.

**Terminal 1 (Backend Proxy):**
```bash
cd server
npm install
npm start
```

**Terminal 2 (Frontend):**
```bash
cd client
npm install
npm run dev
```
The app will open at `http://localhost:5173`. 

## Notes on the implementation

While working with the API, I noticed a lot of the documentation didn't match the actual responses (which I've fully logged in my `submission.json`). 

Because of CORS issues, the 15-minute token expiry, and the `X-API-Key` header requirements, I set up the Express server to handle auth and proxy the requests securely to the Ivy Homes API. 

The frontend handles data normalization on the fly. For example, it detects when project prices are mixed up between Crores and Lakhs, and converts the magichomes listings from square meters into square feet so the UI remains consistent.
