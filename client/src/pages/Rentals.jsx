import React, { useState, useEffect } from 'react';
import api from '../api';
import Pagination from '../components/Pagination';
import { MapPin, Bed, IndianRupee } from 'lucide-react';
import { formatPrice } from '../utils/format';

export default function Rentals() {
  const [rentals, setRentals] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [offset, setOffset] = useState(0);
  const limit = 12;

  useEffect(() => {
    const fetchRentals = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/rentals?offset=${offset}&limit=${limit}`);
        setRentals(response.data.results);
        setTotal(response.data.total);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchRentals();
  }, [offset]);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Rental Properties</h1>
        <p className="text-gray-500">Find homes for rent.</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="animate-pulse bg-white rounded-xl h-64 border border-gray-100 p-5"></div>
          ))}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rentals.map(rental => (
              <div key={rental.rental_id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow">
                <h3 className="font-semibold text-lg text-gray-900 mb-1 line-clamp-1">{rental.title || rental.apartment_name}</h3>
                <p className="text-gray-500 text-sm flex items-center mb-4">
                  <MapPin className="w-4 h-4 mr-1" /> {rental.locality}
                </p>
                
                <div className="flex justify-between items-end mt-4 pt-4 border-t border-gray-50">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Monthly Rent</p>
                    <p className="font-bold text-xl text-blue-600 flex items-center">
                      <IndianRupee className="w-5 h-5" /> {rental.monthly_rent?.toLocaleString('en-IN') || 'N/A'}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500 mb-1">Deposit</p>
                    <p className="font-medium text-gray-700">₹{rental.deposit?.toLocaleString('en-IN') || 'N/A'}</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mt-4">
                  {rental.bedrooms != null && (
                    <span className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded flex items-center">
                      <Bed className="w-3 h-3 mr-1" /> {rental.bedrooms} BHK
                    </span>
                  )}
                  {rental.furnishing && (
                    <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">
                      {rental.furnishing.replace('_', ' ')}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
          <Pagination offset={offset} limit={limit} total={total} onPageChange={setOffset} />
        </>
      )}
    </div>
  );
}
