import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import Hero from '../components/home/Hero';
import CustomCakeSection from '../components/home/CustomCakeSection';
import Testimonials from '../components/home/Testimonials';
import AdminSection from '../components/home/AdminSection';
import { Product } from '../types';
import { AuthContext } from '../context/AuthContext';
import FeaturedProducts from '../components/home/FeaturedProducts';

// Temporary mock data until we connect to the backend
const mockProducts: Product[] = [
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
    reviews: [],
    featured: false,
    stock: 0,
    weatherSensitive: false,
    minimumStock: 0,
    maximumStock: 0,
    productType: 'cake'
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
    reviews: [],
    featured: false,
    stock: 0,
    weatherSensitive: false,
    minimumStock: 0,
    maximumStock: 0,
    productType: 'cake'
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
    reviews: [],
    featured: false,
    stock: 0,
    weatherSensitive: false,
    minimumStock: 0,
    maximumStock: 0,
    productType: 'cake'
  }
];

const HomePage: React.FC = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>(mockProducts);
  const [loading, setLoading] = useState(false);
  const { user } = useContext(AuthContext);
  
  useEffect(() => {
    // When backend is ready, uncomment this to fetch real data
    
    const fetchFeaturedProducts = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get('/api/products/featured');
        setFeaturedProducts(data);
      } catch (error) {
        console.error('Error fetching featured cakes:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchFeaturedProducts();
    
  }, []);
  
  return (
    <div>
      <Hero />
      <FeaturedProducts products={featuredProducts} />
      <CustomCakeSection />
      <Testimonials />
      {user?.isAdmin && <AdminSection />}
    </div>
  );
};

export default HomePage;