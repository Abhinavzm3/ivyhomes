import React from 'react';

export default function FilterBar({ filters, setFilters, onApply, localities }) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Locality</label>
          <select 
            name="locality" 
            value={filters.locality} 
            onChange={handleChange}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
          >
            <option value="">All Localities</option>
            {localities.map(loc => (
              <option key={loc} value={loc}>{loc}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Bedrooms</label>
          <select 
            name="bedrooms" 
            value={filters.bedrooms} 
            onChange={handleChange}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
          >
            <option value="">Any</option>
            {[1, 2, 3, 4].map(num => (
              <option key={num} value={num}>{num} BHK</option>
            ))}
            <option value="5">5+ BHK</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Min Price</label>
          <input 
            type="number" 
            name="minPrice" 
            value={filters.minPrice} 
            onChange={handleChange}
            placeholder="e.g. 5000000"
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Max Price</label>
          <input 
            type="number" 
            name="maxPrice" 
            value={filters.maxPrice} 
            onChange={handleChange}
            placeholder="e.g. 20000000"
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Furnishing</label>
          <select 
            name="furnishing" 
            value={filters.furnishing} 
            onChange={handleChange}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border mb-2"
          >
            <option value="">Any</option>
            <option value="UNFURNISHED">Unfurnished</option>
            <option value="SEMI_FURNISHED">Semi-Furnished</option>
            <option value="FULLY_FURNISHED">Fully-Furnished</option>
          </select>
        </div>
      </div>
      <div className="flex justify-end mt-4">
        <button
          onClick={onApply}
          className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Apply Filters
        </button>
      </div>
    </div>
  );
}
