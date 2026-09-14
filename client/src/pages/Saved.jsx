import React, { useState, useEffect } from 'react';
import api from '../api';
import ListingCard from '../components/ListingCard';

export default function Saved() {
  const [savedItems, setSavedItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSaved = async () => {
    try {
      const response = await api.get('/saved');
      setSavedItems(response.data.results);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSaved();
  }, []);

  const handleRemove = async (listingId) => {
    try {
      const item = savedItems.find(s => s.listing.listing_id === listingId);
      if (item) {
        await api.delete(`/saved/${item.id}`);
        setSavedItems(prev => prev.filter(s => s.id !== item.id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Saved Properties</h1>
        <p className="text-gray-500">Your shortlisted properties.</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div></div>
      ) : savedItems.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl border border-gray-100">
          <p className="text-gray-500">You haven't saved any properties yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedItems.map(item => (
            <ListingCard 
              key={item.id} 
              listing={item.listing} 
              onSave={() => handleRemove(item.listing.listing_id)}
              isSaved={true}
            />
          ))}
        </div>
      )}
    </div>
  );
}
