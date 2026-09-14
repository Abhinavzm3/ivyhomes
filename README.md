# Ivy Homes Property Listing App

A React + Express application built for the Ivy Homes internship assignment, displaying real estate listings and projects in Whitefield, Bangalore.

## Running the Application

### Prerequisites
- Node.js

### Setup and Execution

1. **Install Dependencies**
   Navigate to both the server and client directories and install dependencies:
   ```bash
   cd server
   npm install
   
   cd ../client
   npm install
   ```

2. **Start the Application**
   You can start both the backend proxy and frontend development server:
   ```bash
   # Terminal 1: Backend
   cd server
   npm start

   # Terminal 2: Frontend
   cd client
   npm run dev
   ```

## Architecture Notes

### Express Proxy Backend
The application includes a custom backend proxy built with Express.js. This proxy is crucial because it:
- Automatically handles the 15-minute token refresh cycle for the Ivy Homes API.
- Fixes CORS issues by acting as a middleman between the browser and the API.
- Automatically injects the correct `X-API-Key` headers into requests, which is the actual required method of authentication (contrary to the documented `?api_key=` query parameter).

### Data Discrepancies and Handling
During development, several data inconsistencies were discovered in the API responses. The frontend handles these gracefully to provide a unified experience:
- **Mixed Price Units**: Project prices were returned in mixed units (values < 10 in Crores, values >= 10 in Lakhs). The application normalizes these to consistently display prices correctly.
- **Area Units**: Listings sourced from `magichomes` reported area in square meters instead of the documented square feet. The app standardizes these to square feet.
