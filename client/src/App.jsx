import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Listings from './pages/Listings';
import ListingDetail from './pages/ListingDetail';
import Saved from './pages/Saved';
import Rentals from './pages/Rentals';
import Projects from './pages/Projects';
import Insights from './pages/Insights';

function ProtectedRoute({ children }) {
  const token = localStorage.getItem('access_token');
  return token ? children : <Navigate to='/login' />;
}


export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Navbar />
        <main className='max-w-7xl mx-auto px-4 py-6'>
          <Routes>
            <Route path='/login' element={<Login />} />
            <Route path='/listings' element={<ProtectedRoute><Listings /></ProtectedRoute>} />
            <Route path='/listings/:id' element={<ProtectedRoute><ListingDetail /></ProtectedRoute>} />
            <Route path='/saved' element={<ProtectedRoute><Saved /></ProtectedRoute>} />
            <Route path='/rentals' element={<ProtectedRoute><Rentals /></ProtectedRoute>} />
            <Route path='/projects' element={<ProtectedRoute><Projects /></ProtectedRoute>} />
            <Route path='/insights' element={<ProtectedRoute><Insights /></ProtectedRoute>} />
            <Route path='*' element={<Navigate to='/listings' />} />
          </Routes>
        </main>
      </AuthProvider>
    </BrowserRouter>
  );
}
