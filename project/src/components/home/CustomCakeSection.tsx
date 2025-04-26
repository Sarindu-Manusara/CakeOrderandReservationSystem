import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const CustomCakeSection: React.FC = () => {
  return (
    <section className="py-20 bg-white overflow-hidden">
      <div className="container-custom">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Image Side */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="rounded-lg overflow-hidden shadow-xl">
              <img 
                src="https://images.pexels.com/photos/6208089/pexels-photo-6208089.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
                alt="Custom Cake Creation" 
                className="w-full h-auto object-cover"
              />
            </div>
            <div className="absolute -bottom-8 -right-8 hidden lg:block">
              <img 
                src="https://images.pexels.com/photos/6208086/pexels-photo-6208086.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
                alt="Cake Detail" 
                className="w-48 h-48 object-cover rounded-lg shadow-lg border-4 border-white"
              />
            </div>
          </motion.div>

          {/* Content Side */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl md:text-4xl font-serif mb-6 text-blue-600">Create Your Dream Cake</h2>
            <p className="text-accent-700 mb-6 text-yellow-600">
              Our custom cake service allows you to bring your vision to life. Whether it's a wedding, birthday, 
              or any special occasion, our expert bakers will create a masterpiece tailored just for you.
            </p>
            
            <ul className="space-y-4 mb-8 text-blue-400">
              {[
                "Choose from a variety of flavors, fillings, and frostings",
                "Select your cake size and shape",
                "Add custom decorations and personalized messages",
                "Work with our designers for unique creations"
              ].map((item, index) => (
                <motion.li 
                  key={index}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.1 * index }}
                  className="flex items-start"
                >
                  <span className="inline-block w-6 h-6 rounded-full bg-primary-500 text-white flex items-center justify-center mr-3 shrink-0">
                    ✓
                  </span>
                  <span>{item}</span>
                </motion.li>
              ))}
            </ul>
            
            <Link 
  to="/custom-cake" 
  className="px-6 py-3 bg-yellow-500 hover:bg-yellow-500 font-semibold rounded-full shadow-md transition-all text-blue-700"
>
  Design Your Cake
</Link>

          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default CustomCakeSection;