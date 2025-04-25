import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';

interface Testimonial {
  id: number;
  name: string;
  image: string;
  text: string;
  rating: number;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Sarah Johnson",
    image: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    text: "The custom birthday cake exceeded all my expectations! Not only was it visually stunning, but the taste was absolutely divine. Everyone at the party was impressed.",
    rating: 5
  },
  {
    id: 2,
    name: "Michael Patel",
    image: "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    text: "Ordered their signature chocolate truffle cake for our anniversary and it was perfect. The attention to detail and quality of ingredients really shows. Will definitely order again!",
    rating: 5
  },
  {
    id: 3,
    name: "Emily Chen",
    image: "https://images.pexels.com/photos/1674752/pexels-photo-1674752.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    text: "My wedding cake was a dream come true! The team at Perera & Sons worked with me to create exactly what I envisioned. The cake wasn't just beautiful, it was delicious too.",
    rating: 5
  }
];

const Testimonials: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextTestimonial = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section className="py-20 bg-accent-50">
      <div className="container-custom">
        <div className="text-center mb-12">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-4xl font-serif mb-4"
          >
            Customer Love
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-accent-600 max-w-2xl mx-auto"
          >
            Don't just take our word for it. Here's what our customers have to say about our products and service.
          </motion.p>
        </div>

        <div className="relative max-w-4xl mx-auto">
          <div className="overflow-hidden">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-lg shadow-lg p-8 md:p-12"
            >
              <div className="flex flex-col md:flex-row gap-8 items-center">
                <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden shrink-0 border-4 border-primary-100">
                  <img 
                    src={testimonials[currentIndex].image} 
                    alt={testimonials[currentIndex].name}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center mb-3">
                    {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                      <Star key={i} className="fill-primary-500 text-primary-500" size={18} />
                    ))}
                  </div>
                  
                  <p className="text-accent-700 mb-6 italic">
                    "{testimonials[currentIndex].text}"
                  </p>
                  
                  <h4 className="font-semibold text-lg">
                    {testimonials[currentIndex].name}
                  </h4>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Navigation Buttons */}
          <button 
            onClick={prevTestimonial}
            className="absolute top-1/2 -left-4 md:-left-6 transform -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center text-accent-700 hover:text-secondary-800 transition-colors focus:outline-none"
          >
            <ChevronLeft size={24} />
          </button>
          
          <button 
            onClick={nextTestimonial}
            className="absolute top-1/2 -right-4 md:-right-6 transform -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center text-accent-700 hover:text-secondary-800 transition-colors focus:outline-none"
          >
            <ChevronRight size={24} />
          </button>

          {/* Dots */}
          <div className="flex justify-center space-x-2 mt-6">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-3 h-3 rounded-full ${
                  index === currentIndex ? 'bg-primary-500' : 'bg-primary-200'
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;