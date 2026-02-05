'use client';

import React, { useState, useEffect } from 'react';
import { useCart } from '@/contexts/CartContext';
import MembershipHeader from '@/components/cart/MembershipHeader';
import MembershipPlanDetails from '@/components/cart/MembershipPlanDetails';
import PaymentSummary from '@/components/cart/PaymentSummary';
import TermsAndConditions from '@/components/cart/TermsAndConditions';
import CheckoutButton from '@/components/cart/CheckoutButton';

const CartPage = () => {
  const [termsAgreed, setTermsAgreed] = useState(false);
  const { cartItems } = useCart();

  // Reset terms agreement when cart item changes
  useEffect(() => {
    setTermsAgreed(false);
  }, [cartItems]);

  // Get the selected cart item (only one item allowed)
  const selectedItem = cartItems.length > 0 ? cartItems[0] : null;

  // Calculate pricing dynamically from cart context
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'AUD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Use totalAnnualPrice if annual, monthlyPrice if monthly
  const basePrice = selectedItem 
    ? (selectedItem.billingType === 'annual' 
        ? selectedItem.totalAnnualPrice 
        : selectedItem.monthlyPrice)
    : 0;
  const gstAmount = basePrice * 0.1; // 10% GST
  const totalAmount = basePrice + gstAmount;

  // Format as currency strings for display
  const subtotal = formatCurrency(basePrice);
  const gst = formatCurrency(gstAmount);
  const total = formatCurrency(totalAmount);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white py-12 px-4">
      <div className="w-full max-w-4xl bg-white overflow-hidden">
        <MembershipHeader />
        <MembershipPlanDetails 
          productName={selectedItem?.productName || ''} 
          billingType={selectedItem?.billingType || 'monthly'}
          price={basePrice}
        />
        <PaymentSummary subtotal={subtotal} gst={gst} total={total} />
        <TermsAndConditions onAgreementChange={setTermsAgreed} />
        <CheckoutButton disabled={!termsAgreed} />
      </div>
    </div>
  );
};

export default CartPage;
