'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '../contexts/CartContext';

interface Product {
  id: number;
  name: string;
  monthlyPrice: number;
  totalMonthlyPrice: number;
  totalMonthlySavings: number;
  totalAnnualPrice: number;
}

interface PlanSlideProps {
  product: Product;
  onPrevSlide: () => void;
  onNextSlide: () => void;
}

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

const PlanSlide: React.FC<PlanSlideProps> = ({ product, onPrevSlide, onNextSlide }) => {
  const [selectedPaymentOption, setSelectedPaymentOption] = useState<'monthly' | 'annual'>('monthly');
  const router = useRouter();
  const { updatePreview, commitPreview } = useCart();

  // Update preview automatically when product or billing option changes
  useEffect(() => {
    updatePreview({
      productId: product.id,
      productName: product.name,
      monthlyPrice: product.monthlyPrice,
      totalAnnualPrice: product.totalAnnualPrice,
      billingType: selectedPaymentOption,
    });
  }, [product.id, product.name, product.monthlyPrice, product.totalAnnualPrice, selectedPaymentOption, updatePreview]);

  const handlePurchase = () => {
    // Commit preview to cart and navigate
    commitPreview();
    router.push('/cart');
  };

  const features = [
    { text: "Legal Advice Consultations", hasFeature: true },
    { text: "Contract Drafting", hasFeature: true },
    { text: "Contract Reviewing", hasFeature: true },
    { text: "Contract Amendments", hasFeature: true },
    { text: "Domestic Trade Mark Applications", hasFeature: true },
    { text: "Employment and HR Support", hasFeature: true },
    { text: "Business Structuring Assistance", hasFeature: false },
    { text: "Business Tools and Legal Templates", hasFeature: false },
    { text: "50% off hourly rates", hasFeature: false },
  ];

  return (
    <div className="bg-white overflow-hidden">
      {/* Top Header with Navigation */}
      <div className="bg-[#B3B3B3] px-6 py-4">
        <div className="flex items-center justify-between">
          <button
            onClick={onPrevSlide}
            className="p-2 hover:bg-gray-700 rounded-full transition-colors"
            aria-label="Previous plan"
          >
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <h2 className="text-xl font-bold text-white text-center">{product.name}</h2>

          <button
            onClick={onNextSlide}
            className="p-2 hover:bg-gray-700 rounded-full transition-colors"
            aria-label="Next plan"
          >
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Main Content - Two Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
        {/* Left Column - Membership Information */}
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-6 text-center">Membership Information</h3>

          {/* Icons Section */}
          <div className="flex justify-center items-center space-x-8 mb-8">
            <div className="flex flex-col items-center">
              <img src="/icons/video-icon.png" alt="Video" className="w-12 h-12 mb-2" />
              <span className="text-sm text-gray-600 text-center">Play Our Video</span>
            </div>
            <div className="flex flex-col items-center">
              <img src="/icons/website-icon.png" alt="Website" className="w-12 h-12 mb-2" />
              <span className="text-sm text-gray-600 text-center">See Our Website</span>
            </div>
            <div className="flex flex-col items-center">
              <img src="/icons/portfolio-icon.png" alt="Portfolio" className="w-12 h-12 mb-2" />
              <span className="text-sm text-gray-600 text-center">Visit Our Portfolio</span>
            </div>
          </div>

          {/* Features List */}
          <h3 className="text-lg font-semibold text-gray-800 mb-6 text-left">All the legal assistance your business needs: </h3>
          <div className="space-y-3">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center space-x-3">
                <img
                  src={feature.hasFeature ? "/icons/tick-icon.png" : "/icons/cross-icon.png"}
                  alt={feature.hasFeature ? "Included" : "Not included"}
                  className="w-5 h-5 shrink-0"
                />
                <span className="text-sm text-gray-700">{feature.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column - Payment Information */}
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">Payment Information</h3>

          {/* Main Price Display */}
          <div className="text-center mb-6">
            <span className="text-5xl font-bold text-black">{formatCurrency(product.monthlyPrice)}</span>
            <span className="text-gray-600 text-lg">/month</span>
          </div>

          {/* Contact Buttons */}
          <div className="flex items-center justify-center gap-4 mb-6">
            <button className="flex items-center gap-2 text-black font-semibold py-2 px-4">
              <img src="/icons/phone-icon.png" alt="Phone" className="w-5 h-5" />
              Speak To Our Team
            </button>
            <button className="flex items-center gap-2 text-black font-semibold py-2 px-4">
              <img src="/icons/chat-icon.png" alt="Chat" className="w-5 h-5" />
              Chat With Our Team
            </button>
          </div>

          {/* Payment Options Header */}
          <h4 className="text-center font-semibold text-gray-800 mb-4">Select a payment option below</h4>

          {/* Payment Options Grid - 4x3 */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            {/* Row 1 */}
            <div></div> {/* Empty top left */}
            <div className="text-center">
              <h5 className="font-semibold text-gray-800 mb-2">Monthly Fee</h5>
              <input
                type="checkbox"
                checked={selectedPaymentOption === 'monthly'}
                onChange={() => setSelectedPaymentOption('monthly')}
                className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
              />
            </div>
            <div className="text-center">
              <h5 className="font-semibold text-gray-800 mb-2">Annual Fee</h5>
              <input
                type="checkbox"
                checked={selectedPaymentOption === 'annual'}
                onChange={() => setSelectedPaymentOption('annual')}
                className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
              />
            </div>

            {/* Row 2 */}
            <div className="text-center font-medium text-gray-700">Annual Cost</div>
            <div className="text-center font-semibold text-gray-800">{formatCurrency(product.totalMonthlyPrice)}</div>
            <div className="text-center font-semibold text-gray-800">{formatCurrency(product.totalAnnualPrice)}</div>

            {/* Row 3 */}
            <div className="text-center font-medium text-gray-700">Your Savings</div>
            <div className="text-center font-semibold text-green-600">{formatCurrency(product.totalMonthlySavings)}</div>
            <div className="text-center text-red-600 font-medium">No Savings</div>

            {/* Row 4 */}
            <div className="text-center font-medium text-gray-700">12 Month Contract</div>
            <div className="flex justify-center">
              <img src="/icons/tick-icon.png" alt="Included" className="w-5 h-5" />
            </div>
            <div className="flex justify-center">
              <img src="/icons/cross-icon.png" alt="Not included" className="w-5 h-5" />
            </div>
          </div>

          {/* Purchase Button */}
          <div className="text-center">
            <button
              onClick={handlePurchase}
              className="bg-black hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors text-lg"
            >
              Purchase Membership
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlanSlide;