import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Bed, Bath, Maximize, MapPin } from 'lucide-react';
import { formatPrice } from '../utils/format';

export default function ListingCard({ listing, onSave, isSaved }) {
  const navigate = useNavigate();

  return (
    <div 
      className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow cursor-pointer relative group"
      onClick={() => navigate(`/listings/${listing.listing_id}`)}
    >
      {!listing.is_live && (
        <div className="absolute top-3 left-3 bg-gray-900/75 text-white text-xs font-semibold px-2 py-1 rounded backdrop-blur-sm z-10">
          Inactive
        </div>
      )}
      
      <div className="absolute top-3 right-3 z-10">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onSave?.(listing);
          }}
          className={`p-2 rounded-full backdrop-blur-sm transition-colors ${
            isSaved ? 'bg-red-50 text-red-500' : 'bg-white/80 text-gray-500 hover:bg-white hover:text-red-500'
          }`}
        >
          <Heart className={`w-5 h-5 ${isSaved ? 'fill-current' : ''}`} />
        </button>
      </div>

      <div className="h-48 bg-gray-200 relative">
        <img 
          src={listing.image_url || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80'} 
          alt={listing.apartment_name}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="font-semibold text-lg text-gray-900 line-clamp-1">
              {listing.apartment_name}
            </h3>
            <p className="text-gray-500 text-sm flex items-center mt-1">
              <MapPin className="w-4 h-4 mr-1 flex-shrink-0" />
              {listing.locality}
            </p>
          </div>
          <div className="text-right">
            <div className="font-bold text-xl text-blue-600">
              {formatPrice(listing.price)}
            </div>
            {listing.furnishing && (
              <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded mt-1 inline-block">
                {listing.furnishing.replace('_', ' ')}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4 mt-4 pt-4 border-t border-gray-100 text-gray-600 text-sm">
          {listing.bedrooms != null && (
            <div className="flex items-center">
              <Bed className="w-4 h-4 mr-1.5 text-gray-400" />
              {listing.bedrooms} Beds
            </div>
          )}
          {listing.bathrooms != null && (
            <div className="flex items-center">
              <Bath className="w-4 h-4 mr-1.5 text-gray-400" />
              {listing.bathrooms} Baths
            </div>
          )}
          {listing.carpet_area != null && (
            <div className="flex items-center">
              <Maximize className="w-4 h-4 mr-1.5 text-gray-400" />
              {listing.carpet_area} {listing.carpet_area < 200 ? 'sqm' : 'sqft'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
