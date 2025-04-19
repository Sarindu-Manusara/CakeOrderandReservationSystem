import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import CakeCard from '../ui/CakeCard';
import { Cake } from '../../types';

interface FeaturedCakesProps {
  cakes: Cake[];
}

const FeaturedCakes: React.FC<FeaturedCakesProps> = ({ cakes }) => {
  return (
    <section className="py-20 bg-primary-50">
      <div className="container-custom">
        <div className="text-center mb-12">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-4xl font-serif mb-4"
          >
            Our Signature Cakes
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-accent-600 max-w-2xl mx-auto"
          >
            Explore our most popular cakes, each crafted with premium ingredients
            and designed to make your special occasions even more memorable.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {cakes.map((cake, index) => (
            <motion.div
              key={cake._id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 * index }}
            >
              <CakeCard cake={cake} />
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-12 text-center"
        >
          <Link to="/cakes" className="btn btn-outline">
            View All Cakes
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturedCakes;