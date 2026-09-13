import React, { useState, useEffect } from 'react';
import api from '../api';
import ListingCard from '../components/ListingCard';
import FilterBar from '../components/FilterBar';
import Pagination from '../components/Pagination';

export default function Listings() {
  const [listings, setListings] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [offset, setOffset] = useState(0);
  const limit = 12;
  
  const [filters, setFilters] = useState({
    locality: '',
    bedrooms: '',
    minPrice: '',
    maxPrice: '',
    furnishing: ''
  });
  
  const [localities, setLocalities] = useState([]);
  const [savedIds, setSavedIds] = useState(new Set());


  
  const fetchListings = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const queryParams = new URLSearchParams({
        offset,
        limit,
      });
      
      if (filters.locality) queryParams.append('locality', filters.locality);
      if (filters.bedrooms) queryParams.append('bedrooms', filters.bedrooms);
      if (filters.minPrice) queryParams.append('min_price', filters.minPrice);
      if (filters.maxPrice) queryParams.append('max_price', filters.maxPrice);
      if (filters.furnishing) queryParams.append('furnishing', filters.furnishing);

      const [listingsRes, savedRes] = await Promise.all([
        api.get(`/listings?${queryParams.toString()}`),
        api.get('/saved')
      ]);

      setListings(listingsRes.data.results);
      setTotal(listingsRes.data.total);
      
      const savedSet = new Set(savedRes.data.results.map(s => s.listing_id));
      setSavedIds(savedSet);
      
      // Basic extraction of localities for filter dropdown
      if (localities.length === 0) {
        const uniqueLocalities = [...new Set(listingsRes.data.results.map(l => l.locality).filter(Boolean))];
        setLocalities(uniqueLocalities);
      }
    } catch (err) {
      setError('Failed to fetch listings');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListings();
  }, [offset]); // Refetch on pagination

  const handleApplyFilters = () => {
    setOffset(0);
    fetchListings();
  };

  const toggleSave = async (listing) => {
    try {
      if (savedIds.has(listing.listing_id)) {

        const savedRes = await api.get('/saved');
        const savedItem = savedRes.data.results.find(s => s.listing_id === listing.listing_id);
        if (savedItem) {
          await api.delete(`/saved/${savedItem.listing_id}`);
          setSavedIds(prev => {
            const next = new Set(prev);
            next.delete(listing.listing_id);
            return next;
          });
        }
      } else {
        await api.post('/saved', { listing_id: listing.listing_id });
        setSavedIds(prev => new Set(prev).add(listing.listing_id));
      }
    } catch (err) {
      console.error('Failed to toggle save', err);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Properties for Sale</h1>
        <p className="text-gray-500">Find your dream home from our verified listings.</p>
      </div>

      <FilterBar 
        filters={filters} 
        setFilters={setFilters} 
        onApply={handleApplyFilters} 
        localities={['Whitefield', 'Indiranagar', 'Koramangala', 'HSR Layout', 'Bellandur']} 
      />

      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-6">
          {error}
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="animate-pulse bg-white rounded-xl h-[340px] border border-gray-100">
              <div className="h-48 bg-gray-200 rounded-t-xl" />
              <div className="p-5 space-y-4">
                <div className="h-4 bg-gray-200 rounded w-3/4" />
                <div className="h-4 bg-gray-200 rounded w-1/2" />
                <div className="h-4 bg-gray-200 rounded w-full" />
              </div>
            </div>
          ))}
        </div>
      ) : listings.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-gray-100">
          <p className="text-gray-500 text-lg">No listings found matching your criteria.</p>
          <button 
            onClick={() => {
              setFilters({ locality: '', bedrooms: '', minPrice: '', maxPrice: '', furnishing: '' });
              setOffset(0);
              fetchListings();
            }}
            className="mt-4 text-blue-600 font-medium hover:underline"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {listings.map(listing => (
              <ListingCard 
                key={listing.listing_id} 
                listing={listing} 
                onSave={toggleSave}
                isSaved={savedIds.has(listing.listing_id)}
              />
            ))}
          </div>
          <Pagination 
            offset={offset} 
            limit={limit} 
            total={total} 
            onPageChange={setOffset} 
          />
        </>
      )}
    </div>
  );
}
