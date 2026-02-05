'use client';

import React, { useState, useEffect } from 'react';
import PlanSlide from './PlanSlide';
import { useCart } from '../contexts/CartContext';

interface Product {
  id: number;
  name: string;
  monthlyPrice: number;
  totalMonthlyPrice: number;
  totalMonthlySavings: number;
  totalAnnualPrice: number;
}

interface MembershipPlansCarouselProps {
  products: Product[];
}

const MembershipPlansCarousel: React.FC<MembershipPlansCarouselProps> = ({ products }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { updatePreview } = useCart();

  // Initialize preview with first product (monthly) on mount
  useEffect(() => {
    if (products.length > 0) {
      updatePreview({
        productId: products[0].id,
        productName: products[0].name,
        monthlyPrice: products[0].monthlyPrice,
        totalAnnualPrice: products[0].totalAnnualPrice,
        billingType: 'monthly',
      });
    }
  }, []); // Only run on mount

  const nextSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === products.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? products.length - 1 : prevIndex - 1
    );
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  if (!products || products.length === 0) {
    return <div className="text-center text-gray-500">No plans available</div>;
  }

  return (
    <div className="relative w-full max-w-8xl mx-auto">
      {/* Main carousel container */}
      <div className="overflow-hidden rounded-lg">
        <div
          className="flex transition-transform duration-300 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {products.map((product) => (
            <div key={product.id} className="w-full shrink-0 px-4">
              <PlanSlide
                product={product}
                onPrevSlide={prevSlide}
                onNextSlide={nextSlide}
              />
            </div>
          ))}
        </div>
      </div>


      {/* Dots indicator */}
      {products.length > 1 && (
        <div className="flex justify-center mt-6 space-x-2">
          {products.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-colors ${
                index === currentIndex ? 'bg-blue-600' : 'bg-gray-300'
              }`}
              aria-label={`Go to plan ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Current plan indicator */}
      <div className="text-center mt-4 text-gray-600">
        {currentIndex + 1} of {products.length}
      </div>
    </div>
  );
};

export default MembershipPlansCarousel;