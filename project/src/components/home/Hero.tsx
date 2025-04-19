import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const Hero: React.FC = () => {
  return (
    <div className="relative h-screen bg-accent-900 overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-70"
        style={{ backgroundImage: "url('https://images.pexels.com/photos/4686794/pexels-photo-4686794.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2')" }}
      />

      {/* Content */}
      <div className="relative h-full flex items-center">
        <div className="container-custom">
          <div className="max-w-xl text-white">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold mb-4 text-white"
            >
              Artisan Cakes for Every Celebration
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg md:text-xl text-primary-100 mb-8"
            >
              Handcrafted with premium ingredients. Made fresh daily.
              Perfect for birthdays, weddings, and special moments.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4"
            >
              <Link to="/cakes" className="btn bg-primary-500 hover:bg-primary-600 text-accent-900 font-medium text-center">
                Shop Cakes
              </Link>
              <Link to="/custom-cake" className="btn bg-transparent border-2 border-white hover:bg-white/10 text-white font-medium text-center">
                Custom Order
              </Link>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div 
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center"
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 1.5 }}
      >
        <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white rounded-full mt-2"></div>
        </div>
        <span className="text-white text-sm mt-2">Scroll</span>
      </motion.div>
    </div>
  );
};

export default Hero;