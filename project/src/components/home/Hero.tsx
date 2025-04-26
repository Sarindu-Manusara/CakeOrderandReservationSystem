import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const Hero: React.FC = () => {
  return (
    <div className="relative h-screen bg-blue-800 overflow-hidden">
      {/* No Background Image */}

      {/* Optional: Remove the overlay too if you don't need any gradient */}
      {/* <div className="absolute inset-0 bg-gradient-to-t from-accent-900 via-accent-800/60 to-transparent" /> */}

      {/* Content */}
      <div className="relative h-full flex items-center justify-center px-6">
        <div className="max-w-3xl text-center text-white">
        <motion.h1
  initial={{ opacity: 0, y: 30 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.8 }}
  className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold leading-tight text-yellow-400"
>
  Dedicated to Culinary Excellence
</motion.h1>


          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-primary-100 mt-6 text-lg md:text-xl"
          >
            Enriching lives through nourishing, memorable food experiences.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-8 flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link
              to="/cakes"
              className="px-6 py-3 bg-primary-500 hover:bg-primary-600 text-accent-900 font-semibold rounded-full shadow-md transition-all text-blue-700"
            >
              Shop Products
            </Link>
            <Link
              to="/custom-cake"
              className="px-6 py-3 bg-transparent border-2 border-white hover:bg-white/10 text-white font-semibold rounded-full transition-all"
            >
              Custom Cake Order
            </Link>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div 
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center text-blue-500"
        animate={{ y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 1.5 }}
      >
        <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center ">
          <div className="w-1 h-3 bg-white rounded-full mt-2" />
        </div>
        <span className="text-white text-xs mt-2">Scroll</span>
      </motion.div>
    </div>
  );
};

export default Hero;
