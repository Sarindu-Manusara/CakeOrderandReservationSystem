import React from 'react';
import { Link } from 'react-router-dom';
import { Cake, Instagram, Facebook, Twitter, MapPin, Phone, Mail } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-blue-900 text-white pt-16 pb-8">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <div className="flex items-center mb-4">
              <Cake className="mr-2" size={24} />
              <h3 className="text-xl font-serif font-semibold text-white">Perera & Sons</h3>
            </div>
            <p className="text-primary-200 mb-4">
            Founded in 1902, Perera & Sons is the largest food service restaurant chain in Sri Lanka serving a wide variety of cuisine. We make sure every item of food we produce has that extra bit of personal commitment and care.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-white hover:text-primary-300 transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-white hover:text-primary-300 transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-white hover:text-primary-300 transition-colors">
                <Twitter size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-primary-300">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-primary-100 hover:text-primary-300 transition-colors">Home</Link>
              </li>
              <li>
                <Link to="/cakes" className="text-primary-100 hover:text-primary-300 transition-colors">Products</Link>
              </li>
              <li>
                <Link to="/custom-cake" className="text-primary-100 hover:text-primary-300 transition-colors">Custom Cake Order</Link>
              </li>
              <li>
                <Link to="/login" className="text-primary-100 hover:text-primary-300 transition-colors">My Account</Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-primary-300">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex items-start">
                <MapPin className="mr-3 shrink-0 mt-1" size={18} />
                <span className="text-primary-100">123 Bakery Lane, Colombo, Sri Lanka</span>
              </li>
              <li className="flex items-center">
                <Phone className="mr-3 shrink-0" size={18} />
                <span className="text-primary-100">+94 11 123 4567</span>
              </li>
              <li className="flex items-center">
                <Mail className="mr-3 shrink-0" size={18} />
                <span className="text-primary-100">info@pererasoncakes.com</span>
              </li>
            </ul>
          </div>

          {/* Hours */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-primary-300">Opening Hours</h4>
            <ul className="space-y-2">
              <li className="text-primary-100">Monday - Friday: 8:00 AM - 8:00 PM</li>
              <li className="text-primary-100">Saturday: 9:00 AM - 7:00 PM</li>
              <li className="text-primary-100">Sunday: 10:00 AM - 6:00 PM</li>
            </ul>
          </div>
        </div>

        <hr className="border-accent-700 my-8" />

        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-primary-200 text-sm">
            &copy; {new Date().getFullYear()} Perera & Sons Bakery. All rights reserved.
          </p>
          <div className="mt-4 md:mt-0">
            <ul className="flex space-x-4 text-sm text-primary-200">
              <li><a href="#" className="hover:text-primary-300 transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-primary-300 transition-colors">Terms of Service</a></li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;