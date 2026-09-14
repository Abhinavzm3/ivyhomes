import React, { useState, useEffect } from 'react';
import api from '../api';
import Pagination from '../components/Pagination';
import { MapPin, Building, Activity } from 'lucide-react';

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [offset, setOffset] = useState(0);
  const limit = 12;

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/projects?offset=${offset}&limit=${limit}`);
        setProjects(response.data.results);
        setTotal(response.data.total);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, [offset]);

  const formatProjectPrice = (price) => {
    if (!price) return 'N/A';
    const num = parseFloat(price);
    if (isNaN(num)) return price;
    
    // Normalize mixed Crores and Lakhs data
    let actualPrice = num;
    if (num < 10) {
      actualPrice = num * 10000000;
    } else {
      actualPrice = num * 100000;
    }

    if (actualPrice >= 10000000) return `₹${(actualPrice / 10000000).toFixed(2)} Cr`;
    if (actualPrice >= 100000) return `₹${(actualPrice / 100000).toFixed(2)} L`;
    return `₹${actualPrice.toLocaleString('en-IN')}`;
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">New Projects</h1>
        <p className="text-gray-500">Discover upcoming and ongoing residential projects.</p>
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
            {projects.map(project => (
              <div key={project.project_id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-bold text-lg text-gray-900">{project.apartment_name}</h3>
                    <p className="text-sm text-blue-600 font-medium">{project.developer_name}</p>
                  </div>
                  {project.status && (
                    <span className="bg-green-50 text-green-700 text-xs px-2 py-1 rounded-full font-medium flex items-center">
                      <Activity className="w-3 h-3 mr-1" /> {project.status}
                    </span>
                  )}
                </div>
                
                <p className="text-gray-500 text-sm flex items-center mb-6">
                  <MapPin className="w-4 h-4 mr-1 text-gray-400" /> {project.locality}
                </p>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-50">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Price Range</p>
                    <p className="font-semibold text-gray-900">
                      {formatProjectPrice(project.min_price)}
                      {project.max_price && project.max_price !== project.min_price && ` - ${formatProjectPrice(project.max_price)}`}
                    </p>
                  </div>
                  {project.total_units && (
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Total Units</p>
                      <p className="font-semibold text-gray-900 flex items-center">
                        <Building className="w-4 h-4 mr-1 text-gray-400" /> {project.total_units}
                      </p>
                    </div>
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
