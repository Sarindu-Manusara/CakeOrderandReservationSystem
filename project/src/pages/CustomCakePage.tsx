import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { motion } from 'framer-motion';
import { CakeSlice, Calendar, CheckSquare } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { formatCurrency } from '../../server/utils/FormatCurrency';

const sizeOptions = [
  { id: 'small', name: 'Small (6")', price: 4500 },
  { id: 'medium', name: 'Medium (8")', price: 5500 },
  { id: 'large', name: 'Large (10")', price: 6500 },
  { id: 'xlarge', name: 'Extra Large (12")', price: 7500 },
];

const flavorOptions = [
  'Vanilla',
  'Chocolate',
  'Red Velvet',
  'Lemon',
  'Strawberry',
  'Carrot',
  'Coffee',
  'Coconut',
];

const frostingOptions = [
  'Vanilla Buttercream',
  'Chocolate Ganache',
  'Cream Cheese',
  'Whipped Cream',
  'Fondant',
  'Caramel',
  'Lemon',
  'Berry',
];

const decorationOptions = [
  'Sprinkles',
  'Fresh Fruit',
  'Chocolate Shavings',
  'Flowers',
  'Gold/Silver Leaf',
  'Custom Topper',
  'Edible Image',
  'Drip Design',
];



const CustomCakePage: React.FC = () => {
  const { register, handleSubmit, control, watch, formState: { errors } } = useForm<FormValues>({
    defaultValues: {
      size: 'medium',
      flavor: 'Vanilla',
      frosting: 'Vanilla Buttercream',
      decorations: [],
      message: '',
      specialRequests: '',
      deliveryDate: '',
      isReservation: false
    }
  });

  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentStep, setCurrentStep] = useState(1);
  const [imagePreview, setImagePreview] = useState('https://images.pexels.com/photos/6208089/pexels-photo-6208089.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2');

  const watchSize = watch('size');
  const watchFlavor = watch('flavor');
  const watchDecorations = watch('decorations');
  const watchIsReservation = watch('isReservation');

  const selectedSizePrice = sizeOptions.find(option => option.id === watchSize)?.price || 0;

  const calculatePrice = () => {
    let total = selectedSizePrice;
    total += watchDecorations.length * 500; // 500 LKR per decoration
    return total;
  };

  const updateImagePreview = () => {
    const images = [
      'https://images.pexels.com/photos/6208089/pexels-photo-6208089.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      'https://images.pexels.com/photos/4099305/pexels-photo-4099305.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      'https://images.pexels.com/photos/9986228/pexels-photo-9986228.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
    ];
    
    const randomIndex = Math.floor(Math.random() * images.length);
    setImagePreview(images[randomIndex]);
  };

  const nextStep = () => {
    setCurrentStep(prev => prev + 1);
    updateImagePreview();
  };

  const prevStep = () => {
    setCurrentStep(prev => prev - 1);
  };

  const onSubmit = async (data: FormValues) => {
    if (!user) {
      navigate('/login');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const customCakeData = {
        ...data,
        price: calculatePrice(),
        isCustom: true
      };

      await axios.post('/api/custom-cakes', customCakeData, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      navigate('/cart');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create custom cake');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-24 pb-16 bg-primary-50">
      <div className="container-custom">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-serif mb-4">Design Your Perfect Cake</h1>
          <p className="text-accent-600 max-w-2xl mx-auto">
            Create a custom cake tailored to your exact specifications.
            Our expert bakers will bring your vision to life.
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex justify-center mb-12">
          <div className="flex items-center max-w-md w-full">
            {[1, 2, 3].map((step) => (
              <React.Fragment key={step}>
                <div className="relative flex-1 flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center z-10 ${
                    currentStep >= step ? 'bg-primary-500 text-white' : 'bg-white text-accent-400 border border-accent-300'
                  }`}>
                    {step}
                  </div>
                  <div className="text-xs mt-2 text-center">
                    {step === 1 ? 'Cake Basics' : step === 2 ? 'Decorations' : 'Review & Order'}
                  </div>
                </div>
                {step < 3 && (
                  <div className={`flex-1 h-1 ${
                    currentStep > step ? 'bg-primary-500' : 'bg-accent-300'
                  }`} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          {/* Form Section */}
          <div className="md:col-span-3">
            <div className="bg-white rounded-lg shadow-md p-6">
              <form onSubmit={handleSubmit(onSubmit)}>
                {/* Step 1: Cake Basics */}
                {currentStep === 1 && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h2 className="text-2xl font-serif mb-6">Choose Your Cake Basics</h2>
                    
                    {/* Size Selection */}
                    <div className="mb-6">
                      <label className="label">Cake Size</label>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {sizeOptions.map((size) => (
                          <label 
                            key={size.id} 
                            className={`relative border rounded-lg p-4 cursor-pointer flex flex-col items-center text-center transition-all ${
                              watchSize === size.id ? 'border-primary-500 bg-primary-50' : 'border-accent-200 hover:border-primary-300'
                            }`}
                          >
                            <input
                              type="radio"
                              value={size.id}
                              {...register('size')}
                              className="sr-only"
                            />
                            <CakeSlice size={24} className={`mb-2 ${watchSize === size.id ? 'text-primary-500' : 'text-accent-400'}`} />
                            <span className="font-medium text-sm">{size.name}</span>
                            <span className="text-accent-600 text-sm">{formatCurrency(size.price)}</span>
                            {watchSize === size.id && (
                              <div className="absolute top-2 right-2 text-primary-500">
                                <CheckSquare size={16} />
                              </div>
                            )}
                          </label>
                        ))}
                      </div>
                    </div>
                    
                    {/* Flavor Selection */}
                    <div className="mb-6">
                      <label htmlFor="flavor" className="label">Cake Flavor</label>
                      <select
                        id="flavor"
                        {...register('flavor', { required: 'Please select a flavor' })}
                        className="input"
                      >
                        {flavorOptions.map(flavor => (
                          <option key={flavor} value={flavor}>{flavor}</option>
                        ))}
                      </select>
                      {errors.flavor && <p className="text-red-500 text-sm mt-1">{errors.flavor.message}</p>}
                    </div>
                    
                    {/* Frosting Selection */}
                    <div className="mb-6">
                      <label htmlFor="frosting" className="label">Frosting Type</label>
                      <select
                        id="frosting"
                        {...register('frosting', { required: 'Please select a frosting' })}
                        className="input"
                      >
                        {frostingOptions.map(frosting => (
                          <option key={frosting} value={frosting}>{frosting}</option>
                        ))}
                      </select>
                      {errors.frosting && <p className="text-red-500 text-sm mt-1">{errors.frosting.message}</p>}
                    </div>
                    
                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={nextStep}
                        className="btn btn-primary"
                      >
                        Continue to Decorations
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* Step 2: Decorations and Extras */}
                {currentStep === 2 && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h2 className="text-2xl font-serif mb-6">Choose Decorations & Extras</h2>
                    
                    {/* Decorations */}
                    <div className="mb-6">
                      <label className="label">Decorations (Choose up to 3)</label>
                      <div className="grid grid-cols-2 gap-3">
                        <Controller
                          control={control}
                          name="decorations"
                          render={({ field }) => (
                            <>
                              {decorationOptions.map(decoration => (
                                <label 
                                  key={decoration} 
                                  className={`
                                    relative border rounded-lg p-3 cursor-pointer flex items-center transition-all
                                    ${field.value.includes(decoration) ? 'border-primary-500 bg-primary-50' : 'border-accent-200 hover:border-primary-300'}
                                  `}
                                >
                                  <input
                                    type="checkbox"
                                    value={decoration}
                                    checked={field.value.includes(decoration)}
                                    onChange={(e) => {
                                      if (e.target.checked) {
                                        if (field.value.length < 3) {
                                          field.onChange([...field.value, decoration]);
                                        }
                                      } else {
                                        field.onChange(field.value.filter((value: string) => value !== decoration));
                                      }
                                    }}
                                    className="sr-only"
                                  />
                                  <span className="text-sm">{decoration}</span>
                                  {field.value.includes(decoration) && (
                                    <div className="absolute top-2 right-2 text-primary-500">
                                      <CheckSquare size={16} />
                                    </div>
                                  )}
                                </label>
                              ))}
                            </>
                          )}
                        />
                      </div>
                      <div className="text-xs text-accent-500 mt-2">Each decoration adds {formatCurrency(500)} to the total price</div>
                    </div>
                    
                    {/* Message */}
                    <div className="mb-6">
                      <label htmlFor="message" className="label">Cake Message (Optional)</label>
                      <input
                        id="message"
                        type="text"
                        {...register('message')}
                        placeholder="Happy Birthday, Congratulations, etc."
                        className="input"
                      />
                    </div>
                    
                    {/* Special Requests */}
                    <div className="mb-6">
                      <label htmlFor="specialRequests" className="label">Special Requests (Optional)</label>
                      <textarea
                        id="specialRequests"
                        {...register('specialRequests')}
                        placeholder="Any additional details or requests for your cake..."
                        className="input min-h-[100px]"
                      />
                    </div>
                    
                    <div className="flex justify-between">
                      <button
                        type="button"
                        onClick={prevStep}
                        className="btn btn-outline"
                      >
                        Back
                      </button>
                      <button
                        type="button"
                        onClick={nextStep}
                        className="btn btn-primary"
                      >
                        Continue to Review
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* Step 3: Review & Order */}
                {currentStep === 3 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h2 className="text-2xl font-serif mb-6">Review Your Custom Cake</h2>
                    
                    <div className="space-y-4 mb-6">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">Size:</span>
                        <span>
                          {sizeOptions.find(size => size.id === watchSize)?.name}
                          <span className="ml-2 text-accent-500">
                            ({formatCurrency(sizeOptions.find(size => size.id === watchSize)?.price || 0)})
                          </span>
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="font-medium">Flavor:</span>
                        <span>{watchFlavor}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="font-medium">Frosting:</span>
                        <span>{watch('frosting')}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="font-medium">Decorations:</span>
                        <span>
                          {watchDecorations.length > 0 
                            ? watchDecorations.join(', ') 
                            : 'None'}
                          {watchDecorations.length > 0 && (
                            <span className="ml-2 text-accent-500">
                              ({formatCurrency(watchDecorations.length * 500)})
                            </span>
                          )}
                        </span>
                      </div>
                      {watch('message') && (
                        <div className="flex items-center justify-between">
                          <span className="font-medium">Message:</span>
                          <span>{watch('message')}</span>
                        </div>
                      )}
                      {watch('specialRequests') && (
                        <div className="flex flex-col">
                          <span className="font-medium">Special Requests:</span>
                          <span className="text-sm mt-1">{watch('specialRequests')}</span>
                        </div>
                      )}
                      
                      <hr className="my-4" />
                      
                      <div className="flex items-center justify-between font-semibold text-lg">
                        <span>Total Price:</span>
                        <span>{formatCurrency(calculatePrice())}</span>
                      </div>
                    </div>
                    
                    {/* Delivery/Reservation */}
                    <div className="mb-6 p-4 bg-primary-50 rounded-lg">
                      <div className="flex items-start mb-4">
                        <input
                          type="checkbox"
                          id="isReservation"
                          {...register('isReservation')}
                          className="mt-1"
                        />
                        <label htmlFor="isReservation" className="ml-2">
                          <span className="font-medium block">Reserve for a future date</span>
                          <span className="text-sm text-accent-600">
                            Select this if you want to reserve this cake for a specific date
                          </span>
                        </label>
                      </div>
                      
                      {watchIsReservation && (
                        <div className="animate-fade-in">
                          <label htmlFor="deliveryDate" className="label">Reservation Date</label>
                          <div className="relative">
                            <input
                              type="date"
                              id="deliveryDate"
                              {...register('deliveryDate', {
                                required: watchIsReservation ? 'Please select a date' : false,
                                validate: value => {
                                  if (watchIsReservation) {
                                    const selectedDate = new Date(value);
                                    const today = new Date();
                                    today.setHours(0, 0, 0, 0);
                                    
                                    // Require at least 3 days in advance
                                    const minDate = new Date(today);
                                    minDate.setDate(today.getDate() + 3);
                                    
                                    return selectedDate >= minDate || 'Please select a date at least 3 days from today';
                                  }
                                  return true;
                                }
                              })}
                              className="input pl-10"
                              min={(() => {
                                const date = new Date();
                                date.setDate(date.getDate() + 3);
                                return date.toISOString().split('T')[0];
                              })()}
                            />
                            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-accent-400" size={18} />
                          </div>
                          {errors.deliveryDate && (
                            <p className="text-red-500 text-sm mt-1">{errors.deliveryDate.message}</p>
                          )}
                          <p className="text-sm text-accent-500 mt-2">
                            * Custom cakes require at least 3 days advance notice
                          </p>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex justify-between">
                      <button
                        type="button"
                        onClick={prevStep}
                        className="btn btn-outline"
                      >
                        Back
                      </button>
                      <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={loading}
                      >
                        {loading ? 'Adding to Cart...' : 'Add to Cart'}
                      </button>
                    </div>

                    {error && (
                      <div className="mt-4 p-3 bg-red-50 text-red-600 rounded-lg">
                        {error}
                      </div>
                    )}
                  </motion.div>
                )}
              </form>
            </div>
          </div>

          {/* Preview Section */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
              <h3 className="text-xl font-serif mb-4">Your Cake Preview</h3>
              
              <div className="rounded-lg overflow-hidden mb-6">
                <img 
                  src={imagePreview} 
                  alt="Cake Preview" 
                  className="w-full h-auto"
                />
              </div>
              
              <div className="text-sm text-center text-accent-500">
                * Preview is illustrative. Your actual custom cake will be created by our expert bakers based on your specifications.
              </div>
              
              <div className="mt-6 bg-primary-50 rounded-lg p-4">
                <h4 className="font-medium mb-2">Estimated Price</h4>
                <div className="flex justify-between text-lg font-semibold">
                  <span>Total:</span>
                  <span>{formatCurrency(calculatePrice())}</span>
                </div>
                <p className="text-xs text-accent-500 mt-2">
                  Price includes size and selected decorations
                </p>
              </div>
              
              <div className="mt-6">
                <h4 className="font-medium mb-2">Need Help?</h4>
                <p className="text-sm text-accent-600 mb-4">
                  Have questions about creating your custom cake? Our team is here to help!
                </p>
                <button className="btn btn-outline w-full">
                  Contact Our Bakers
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomCakePage;