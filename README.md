# Ivy Homes Property Listing App

A MERN stack application built for the Ivy Homes internship assignment, displaying real estate listings and projects in Whitefield, Bangalore.

## Running the Application

### Prerequisites
- Node.js (v14+)
- npm or yarn
- MongoDB (running locally or a URI provided via `.env`)

### Setup and Execution

1. **Install Dependencies**
   Navigate to both the frontend and backend directories and install dependencies:
   ```bash
   cd backend
   npm install
   cd ../frontend
   npm install
   ```

2. **Start the Application**
   You can start both the backend proxy and frontend development server:
   ```bash
   # Terminal 1: Backend
   cd backend
   npm start

   # Terminal 2: Frontend
   cd frontend
   npm start
   ```

## Architecture Notes

### Express Proxy Backend
The application includes a custom backend proxy built with Express.js. This proxy is crucial because it:
- Automatically handles the 15-minute token refresh cycle for the Ivy Homes API.
- Fixes CORS issues by acting as a middleman between the browser and the API.
- Automatically injects the correct `X-API-Key` headers into requests, which is the actual required method of authentication (contrary to the documented `?api_key=` query parameter).

### Data Discrepancies and Handling
During the analysis phase, several data inconsistencies were discovered in the API responses. The frontend handles these gracefully to provide a unified experience:
- **Mixed Price Units**: Project prices were returned in mixed units (values < 10 in Crores, values >= 10 in Lakhs). The application normalizes these to consistently display prices in INR.
- **Area Units**: Listings sourced from `magichomes` reported area in square meters (values ranging from 35-93) instead of the documented square feet. The app standardizes these to square feet for accurate price-per-sqft calculations and comparisons.

## Analysis Scripts
The Python scripts used to analyze the dataset, discover API discrepancies, and generate the answers for `submission.json` are safely stored in the `analysis_scripts/` directory. These scripts are not required to run the main application but provide insight into the data processing methodology.
