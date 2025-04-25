// import React, { useState, useEffect, useContext } from 'react';
// import { useParams, Link } from 'react-router-dom';
// import { ShoppingCart, ArrowLeft, CloudSun } from 'lucide-react';
// import axios from 'axios';
// import CartContext from '../context/CartContext';
// import { Cake } from '../types';
// import { formatCurrency } from '../../server/utils/FormatCurrency';

// const CakeDetailPage: React.FC = () => {
//   const { id } = useParams<{ id: string }>();
//   const [cake, setCake] = useState<Cake | null>(null);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [error, setError] = useState<string>('');
//   const [selectedSize, setSelectedSize] = useState<string>('');
//   const [quantity, setQuantity] = useState<number>(1);
//   const { addToCart } = useContext(CartContext);

//   useEffect(() => {
//     const fetchCake = async () => {
//       setLoading(true);
//       try {
//         const { data } = await axios.get(`/api/cakes/${id}`);
//         setCake(data);
//         setSelectedSize(data.sizes[0] || '');
//       } catch (err: any) {
//         setError(err.response?.data?.message || 'Failed to fetch cake details');
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (id) {
//       fetchCake();
//     }
//   }, [id]);

//   const handleAddToCart = () => {
//     if (!cake) return;

//     if (!cake.isAvailable || cake.stock <= 0) {
//       alert('This cake is currently out of stock');
//       return;
//     }

//     if (quantity > cake.stock) {
//       alert(`Only ${cake.stock} units available`);
//       return;
//     }

//     addToCart({
//       _id: cake._id,
//       name: cake.name,
//       price: cake.price,
//       image: cake.image,
//       quantity
//     });
//   };

//   if (loading) {
//     return (
//       <div className="container mx-auto px-4 py-12 flex justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto"></div>
//           <p className="mt-4 text-lg">Loading cake details...</p>
//         </div>
//       </div>
//     );
//   }

//   if (!cake) {
//     return (
//       <div className="container mx-auto px-4 py-12">
//         <div className="text-center">
//           <h2 className="text-2xl font-bold mb-4">Cake Not Found</h2>
//           <p className="mb-6">Sorry, the cake you're looking for doesn't exist.</p>
//           <Link to="/cakes" className="text-primary-500 hover:underline flex items-center justify-center">
//             <ArrowLeft className="mr-2" size={16} />
//             Back to all cakes
//           </Link>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="container mx-auto px-4 py-12">
//       <Link to="/cakes" className="text-primary-500 hover:underline flex items-center mb-6">
//         <ArrowLeft className="mr-2" size={16} />
//         Back to all cakes
//       </Link>
      
//       <div className="grid md:grid-cols-2 gap-12">
//         {/* Cake Image */}
//         <div className="rounded-lg overflow-hidden shadow-lg">
//           <img 
//             src={cake.image} 
//             alt={cake.name} 
//             className="w-full h-auto object-cover"
//           />
//         </div>
        
//         {/* Cake Details */}
//         <div>
//           <div className="flex items-center justify-between mb-2">
//             <h1 className="text-3xl font-bold">{cake.name}</h1>
//             {cake.weatherSensitive && (
//               <div className="flex items-center text-primary-500" title="Weather sensitive item">
//                 <CloudSun size={24} />
//               </div>
//             )}
//           </div>
//           <p className="text-2xl font-semibold text-primary-500 mb-4">{formatCurrency(cake.price)}</p>
//           <p className="text-accent-700 mb-6">{cake.description}</p>
          
//           {/* Size Selection */}
//           <div className="mb-6">
//             <h3 className="text-lg font-semibold mb-2">Size</h3>
//             <div className="flex space-x-2">
//               {cake.sizes.map((size) => (
//                 <button
//                   key={size}
//                   className={`px-4 py-2 rounded-full border ${
//                     selectedSize === size 
//                       ? 'bg-primary-500 text-white border-primary-500' 
//                       : 'border-accent-300 hover:border-primary-300'
//                   }`}
//                   onClick={() => setSelectedSize(size)}
//                 >
//                   {size}
//                 </button>
//               ))}
//             </div>
//           </div>
          
//           {/* Quantity */}
//           <div className="mb-6">
//             <h3 className="text-lg font-semibold mb-2">Quantity</h3>
//             <div className="flex items-center">
//               <button 
//                 className="px-3 py-1 border border-accent-300 rounded-l-md hover:bg-accent-50"
//                 onClick={() => setQuantity(Math.max(1, quantity - 1))}
//                 aria-label="Decrease quantity"
//               >
//                 -
//               </button>
//               <input 
//                 type="number" 
//                 min="1"
//                 max={cake.stock}
//                 value={quantity} 
//                 onChange={(e) => setQuantity(Math.max(1, Math.min(parseInt(e.target.value) || 1, cake.stock)))}
//                 className="w-16 text-center py-1 border-t border-b border-accent-300"
//               />
//               <button 
//                 className="px-3 py-1 border border-accent-300 rounded-r-md hover:bg-accent-50"
//                 onClick={() => setQuantity(Math.min(quantity + 1, cake.stock))}
//                 aria-label="Increase quantity"
//               >
//                 +
//               </button>
//             </div>
//             <p className="text-sm text-accent-500 mt-1">
//               {cake.stock} units available
//             </p>
//           </div>
          
//           {/* Add to Cart Button */}
//           <button 
//             className={`w-full py-3 px-6 rounded-md mb-6 flex items-center justify-center ${
//               cake.isAvailable && cake.stock > 0
//                 ? 'bg-primary-500 hover:bg-primary-600 text-white'
//                 : 'bg-accent-200 text-accent-500 cursor-not-allowed'
//             }`}
//             onClick={handleAddToCart}
//             disabled={!cake.isAvailable || cake.stock <= 0}
//           >
//             <ShoppingCart className="mr-2" size={18} />
//             {cake.isAvailable && cake.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
//           </button>
          
//           {/* Flavors */}
//           <div className="mb-6">
//             <h3 className="text-lg font-semibold mb-2">Available Flavors</h3>
//             <div className="flex flex-wrap gap-2">
//               {cake.flavors.map((flavor, index) => (
//                 <span 
//                   key={index}
//                   className="px-3 py-1 bg-primary-50 text-primary-700 rounded-full text-sm"
//                 >
//                   {flavor}
//                 </span>
//               ))}
//             </div>
//           </div>
          
//           {/* Reviews */}
//           {cake.reviews && cake.reviews.length > 0 && (
//             <div className="mb-6">
//               <h3 className="text-lg font-semibold mb-2">Customer Reviews</h3>
//               <div className="space-y-4">
//                 {cake.reviews.map((review, index) => (
//                   <div key={index} className="border-b border-accent-200 pb-4">
//                     <div className="flex items-center justify-between mb-2">
//                       <span className="font-medium">{review.user.name}</span>
//                       <div className="flex items-center">
//                         <span className="text-primary-500">{review.rating}/5</span>
//                       </div>
//                     </div>
//                     <p className="text-accent-600">{review.comment}</p>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default CakeDetailPage;