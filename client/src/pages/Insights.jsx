import React, { useState, useEffect } from 'react';
import api from '../api';
import { AlertTriangle, TrendingUp, Home, CheckCircle } from 'lucide-react';
import { formatPrice } from '../utils/format';

export default function Insights() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllListings = async () => {
      try {
        setLoading(true);
        let allListings = [];
        let offset = 0;
        const limit = 100;
        let hasMore = true;

        // Fetch up to 1000 items to avoid infinite loops/huge memory on client for this demo
        while (hasMore && allListings.length < 1000) {
          const res = await api.get(`/listings?offset=${offset}&limit=${limit}`);
          const items = res.data.results;
          if (items.length === 0) {
            hasMore = false;
          } else {
            allListings = [...allListings, ...items];
            offset += limit;
          }
        }

        computeAnalytics(allListings);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAllListings();
  }, []);

  const computeAnalytics = (listings) => {
    const total = listings.length;
    const active = listings.filter(l => l.is_live).length;
    const inactive = total - active;
    
    let corruptPrices = 0;
    let potentiallyFake = 0; // arbitrary metric: e.g. price < 100000 or price > 500000000
    
    const localities = {};
    const bhk = {};
    const prices = [];
    const sqftPrices = [];

    listings.forEach(l => {
      // Data quality checks
      if (l.price < 0) corruptPrices++;
      if (l.price > 0 && l.price < 100000) potentiallyFake++; // Suspiciously low for sale

      // Locality aggregation
      if (l.locality) {
        if (!localities[l.locality]) localities[l.locality] = { count: 0, prices: [] };
        localities[l.locality].count++;
        if (l.price > 0) localities[l.locality].prices.push(l.price);
      }

      // BHK aggregation
      if (l.bedrooms != null) {
        bhk[l.bedrooms] = (bhk[l.bedrooms] || 0) + 1;
      }

      if (l.price > 0) prices.push(l.price);

      if (l.price > 0 && l.carpet_area > 0) {
        let area = l.carpet_area;
        if (area < 200) area *= 10.764; // Convert sqm to sqft
        sqftPrices.push(l.price / area);
      }
    });

    prices.sort((a, b) => a - b);
    const medianPrice = prices.length > 0 ? 
      (prices.length % 2 !== 0 ? prices[Math.floor(prices.length / 2)] : (prices[prices.length / 2 - 1] + prices[prices.length / 2]) / 2) 
      : 0;

    const avgPricePerSqft = sqftPrices.length > 0 ? 
      sqftPrices.reduce((a, b) => a + b, 0) / sqftPrices.length : 0;

    const topLocalities = Object.entries(localities)
      .sort((a, b) => b[1].count - a[1].count)
      .slice(0, 10)
      .map(([name, data]) => ({
        name,
        count: data.count,
        avgPrice: data.prices.length ? data.prices.reduce((a,b)=>a+b,0)/data.prices.length : 0
      }));

    setData({
      total,
      active,
      inactive,
      corruptPrices,
      potentiallyFake,
      medianPrice,
      avgPricePerSqft,
      topLocalities,
      bhk: Object.entries(bhk).sort((a,b) => Number(a[0]) - Number(b[0]))
    });
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
        <p className="text-gray-500">Computing analytics from database...</p>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="space-y-8 pb-12">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Market Insights</h1>
        <p className="text-gray-500">Data-driven analysis of our property catalog.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-500 text-sm font-medium">Total Listings</h3>
            <Home className="w-5 h-5 text-blue-500" />
          </div>
          <p className="text-3xl font-bold text-gray-900">{data.total}</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-500 text-sm font-medium">Active Listings</h3>
            <CheckCircle className="w-5 h-5 text-green-500" />
          </div>
          <p className="text-3xl font-bold text-gray-900">{data.active}</p>
          <p className="text-sm text-green-600 mt-2">{((data.active/data.total)*100).toFixed(1)}% of total</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-500 text-sm font-medium">Median Price</h3>
            <IndianRupeeIcon className="w-5 h-5 text-purple-500" />
          </div>
          <p className="text-3xl font-bold text-gray-900">{formatPrice(data.medianPrice)}</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-500 text-sm font-medium">Avg Price / SqFt</h3>
            <TrendingUp className="w-5 h-5 text-orange-500" />
          </div>
          <p className="text-3xl font-bold text-gray-900">₹{Math.round(data.avgPricePerSqft).toLocaleString('en-IN')}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-100">
            <h3 className="font-bold text-gray-900">Top Localities</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Locality</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Listings</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Avg Price</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {data.topLocalities.map((loc, i) => (
                  <tr key={i} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{loc.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{loc.count}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatPrice(loc.avgPrice)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-100">
            <h3 className="font-bold text-gray-900">Listings by BHK</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {data.bhk.map(([rooms, count], i) => (
                <div key={i} className="flex items-center">
                  <div className="w-16 text-sm font-medium text-gray-700">{rooms} BHK</div>
                  <div className="flex-1 ml-4 bg-gray-100 rounded-full h-4 overflow-hidden">
                    <div 
                      className="bg-blue-500 h-full rounded-full" 
                      style={{ width: `${(count / data.total) * 100}%` }}
                    />
                  </div>
                  <div className="w-12 text-right text-sm text-gray-500 ml-4">{count}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-yellow-50 rounded-xl border border-yellow-200 p-6">
        <div className="flex items-start">
          <AlertTriangle className="w-6 h-6 text-yellow-600 mr-3 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="text-lg font-bold text-yellow-800 mb-4">Data Quality Report</h3>
            <ul className="space-y-3 text-yellow-700 text-sm">
              <li className="flex items-center justify-between bg-yellow-100/50 p-3 rounded">
                <span>Corrupt Data (Negative Prices)</span>
                <span className="font-bold">{data.corruptPrices} listings</span>
              </li>
              <li className="flex items-center justify-between bg-yellow-100/50 p-3 rounded">
                <span>Inactive Listings</span>
                <span className="font-bold">{data.inactive} listings</span>
              </li>
              <li className="flex items-center justify-between bg-yellow-100/50 p-3 rounded">
                <span>Potentially Fake (Price &lt; 1 Lakh)</span>
                <span className="font-bold">{data.potentiallyFake} listings</span>
              </li>
              <li className="bg-yellow-100/50 p-3 rounded">
                <span className="block font-semibold mb-1">Area Unit Discrepancy Note</span>
                Listings sourced from "magichomes" often have carpet area recorded in square meters instead of square feet. We applied an automatic conversion (x10.764) for areas &lt; 200.
              </li>
              <li className="bg-yellow-100/50 p-3 rounded">
                <span className="block font-semibold mb-1">Project Price Note</span>
                Projects API returns prices in raw Crores or Lakhs units (e.g. 1.2 or 45). Our frontend normalizes this by inferring Crores for values &lt; 10, and Lakhs for values &ge; 10.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

function IndianRupeeIcon(props) {
  return (
    <svg 
      {...props} 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <path d="M6 3h12" />
      <path d="M6 8h12" />
      <path d="m6 13 8.5 8" />
      <path d="M6 13h3" />
      <path d="M9 13c6.667 0 6.667-10 0-10" />
    </svg>
  );
}
