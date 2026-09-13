import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Bed, Bath, Maximize, Compass, Building, Phone, User, Heart } from 'lucide-react';
import api from '../api';
import { formatPrice } from '../utils/format';

export default function ListingDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const response = await api.get(`/listings/${id}`);
        setListing(response.data);
      } catch (err) {
        setError('Failed to fetch listing details');
      } finally {
        setLoading(false);
      }
    };
    fetchListing();
  }, [id]);

  if (loading) {
    return <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>;
  }

  if (error || !listing) {
    return (
      <div className="text-center py-20">
        <p className="text-red-500 mb-4">{error || 'Listing not found'}</p>
        <button onClick={() => navigate(-1)} className="text-blue-600 hover:underline">Go back</button>
      </div>
    );
  }

  const renderArea = () => {
    if (listing.carpet_area == null) return 'N/A';
    if (listing.carpet_area < 200) {
      const sqft = Math.round(listing.carpet_area * 10.764);
      return (
        <div>
          <span>{sqft} sqft</span>
          <span className="text-xs text-gray-400 block">({listing.carpet_area} sqm)</span>
        </div>
      );
    }
    return `${listing.carpet_area} sqft`;
  };

  return (
    <div className="max-w-5xl mx-auto pb-12">
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center text-gray-500 hover:text-gray-900 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to listings
      </button>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="h-[400px] relative bg-gray-200">
          <img 
            src={listing.image_url || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200&q=80'} 
            alt={listing.apartment_name}
            className="w-full h-full object-cover"
          />
          {!listing.is_live && (
            <div className="absolute top-4 left-4 bg-gray-900/75 text-white px-3 py-1.5 rounded-md font-medium backdrop-blur-sm">
              Inactive Listing
            </div>
          )}
        </div>

        <div className="p-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{listing.apartment_name}</h1>
              <p className="text-lg text-gray-500 flex items-center">
                <MapPin className="w-5 h-5 mr-2 text-gray-400" />
                {listing.locality} {listing.city && `, ${listing.city}`}
              </p>
            </div>
            <div className="text-right">
              <div className="text-4xl font-bold text-blue-600 mb-2">
                {formatPrice(listing.price)}
              </div>
              <p className="text-gray-500">
                ₹{Math.round(listing.price / (listing.carpet_area * (listing.carpet_area < 200 ? 10.764 : 1))).toLocaleString('en-IN')} / sqft
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-8 border-y border-gray-100 mb-8">
            <div className="flex flex-col">
              <span className="text-gray-500 text-sm mb-1 flex items-center"><Bed className="w-4 h-4 mr-1"/> Bedrooms</span>
              <span className="font-semibold text-gray-900 text-lg">{listing.bedrooms || 'N/A'}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-gray-500 text-sm mb-1 flex items-center"><Bath className="w-4 h-4 mr-1"/> Bathrooms</span>
              <span className="font-semibold text-gray-900 text-lg">{listing.bathrooms || 'N/A'}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-gray-500 text-sm mb-1 flex items-center"><Maximize className="w-4 h-4 mr-1"/> Carpet Area</span>
              <span className="font-semibold text-gray-900 text-lg">{renderArea()}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-gray-500 text-sm mb-1 flex items-center"><Building className="w-4 h-4 mr-1"/> Floor</span>
              <span className="font-semibold text-gray-900 text-lg">
                {listing.floor_number !== null ? listing.floor_number : 'N/A'} 
                {listing.total_floors ? ` of ${listing.total_floors}` : ''}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Property Details</h2>
              <div className="grid grid-cols-2 gap-y-4 gap-x-8 text-gray-600 mb-8">
                <div>
                  <span className="block text-sm text-gray-400">Furnishing</span>
                  <span className="font-medium text-gray-900">{listing.furnishing?.replace('_', ' ') || 'N/A'}</span>
                </div>
                <div>
                  <span className="block text-sm text-gray-400">Facing</span>
                  <span className="font-medium text-gray-900">{listing.facing || 'N/A'}</span>
                </div>
                <div>
                  <span className="block text-sm text-gray-400">Balconies</span>
                  <span className="font-medium text-gray-900">{listing.balconies !== null ? listing.balconies : 'N/A'}</span>
                </div>
                <div>
                  <span className="block text-sm text-gray-400">Status</span>
                  <span className="font-medium text-gray-900">{listing.is_live ? 'Active' : 'Inactive'}</span>
                </div>
              </div>

              {listing.description && (
                <>
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Description</h2>
                  <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                    {listing.description}
                  </p>
                </>
              )}
            </div>

            <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 h-fit">
              <h3 className="font-bold text-gray-900 mb-4">Contact Poster</h3>
              <div className="space-y-4">
                {listing.posted_by && (
                  <div className="flex items-center text-gray-600">
                    <User className="w-5 h-5 mr-3 text-gray-400" />
                    <span>{listing.posted_by}</span>
                  </div>
                )}
                {listing.contact_number && (
                  <div className="flex items-center text-gray-600">
                    <Phone className="w-5 h-5 mr-3 text-gray-400" />
                    <span>{listing.contact_number}</span>
                  </div>
                )}
              </div>
              <button className="w-full mt-6 bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors">
                Contact Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
