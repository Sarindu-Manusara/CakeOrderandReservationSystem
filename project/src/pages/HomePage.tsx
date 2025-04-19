import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import Hero from '../components/home/Hero';
import FeaturedCakes from '../components/home/FeaturedCakes';
import CustomCakeSection from '../components/home/CustomCakeSection';
import Testimonials from '../components/home/Testimonials';
import AdminSection from '../components/home/AdminSection';
import { Cake } from '../types';
import { AuthContext } from '../context/AuthContext';

// Temporary mock data until we connect to the backend
const mockCakes: Cake[] = [
  {
    _id: '1',
    name: 'Chocolate Fudge Dream',
    description: 'Rich chocolate layers with fudge filling and smooth chocolate ganache. A chocolate lover\'s dream!',
    image: 'https://images.pexels.com/photos/132694/pexels-photo-132694.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    price: 45.99,
    category: 'chocolate',
    isAvailable: true,
    flavors: ['chocolate', 'fudge'],
    sizes: ['small', 'medium', 'large'],
    rating: 4.8,
    reviews: []
  },
  {
    _id: '2',
    name: 'Vanilla Bean Celebration',
    description: 'Light vanilla sponge with vanilla bean buttercream and sprinkles. Perfect for any celebration!',
    image: 'https://images.pexels.com/photos/1120970/pexels-photo-1120970.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    price: 39.99,
    category: 'vanilla',
    isAvailable: true,
    flavors: ['vanilla'],
    sizes: ['small', 'medium', 'large'],
    rating: 4.5,
    reviews: []
  },
  {
    _id: '3',
    name: 'Red Velvet Elegance',
    description: 'Classic red velvet cake with cream cheese frosting. A timeless favorite with deep red color and hint of cocoa.',
    image: 'https://images.pexels.com/photos/6783147/pexels-photo-6783147.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    price: 42.99,
    category: 'red-velvet',
    isAvailable: true,
    flavors: ['red velvet'],
    sizes: ['medium', 'large'],
    rating: 4.7,
    reviews: []
  }
];

const HomePage: React.FC = () => {
  const [featuredCakes, setFeaturedCakes] = useState<Cake[]>(mockCakes);
  const [loading, setLoading] = useState(false);
  const { user } = useContext(AuthContext);
  
  useEffect(() => {
    // When backend is ready, uncomment this to fetch real data
    /*
    const fetchFeaturedCakes = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get('/api/cakes/featured');
        setFeaturedCakes(data);
      } catch (error) {
        console.error('Error fetching featured cakes:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchFeaturedCakes();
    */
  }, []);
  
  return (
    <div>
      <Hero />
      <FeaturedCakes cakes={featuredCakes} />
      <CustomCakeSection />
      <Testimonials />
      {user?.isAdmin && <AdminSection />}
    </div>
  );
};

export default HomePage;