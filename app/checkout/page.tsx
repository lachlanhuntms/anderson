'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, useStripe, useElements } from '@stripe/react-stripe-js';
import { useCart } from '@/contexts/CartContext';
import CheckoutHeader from '@/components/checkout/CheckoutHeader';
import CheckoutForm from '@/components/checkout/CheckoutForm';
import OrderSummary from '@/components/checkout/OrderSummary';
import PaymentDetailsSection from '@/components/checkout/PaymentDetailsSection';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'AUD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validateForm = (formData: {
  companyName: string;
  firstName: string;
  lastName: string;
  email: string;
  mobileNo: string;
  businessAddress: string;
}): { [key: string]: string } => {
  const errors: { [key: string]: string } = {};

  if (!formData.companyName.trim()) {
    errors.companyName = 'Company name is required';
  }
  if (!formData.firstName.trim()) {
    errors.firstName = 'First name is required';
  }
  if (!formData.lastName.trim()) {
    errors.lastName = 'Last name is required';
  }
  if (!formData.email.trim()) {
    errors.email = 'Email is required';
  } else if (!validateEmail(formData.email)) {
    errors.email = 'Please enter a valid email address';
  }
  if (!formData.mobileNo.trim()) {
    errors.mobileNo = 'Mobile number is required';
  }
  if (!formData.businessAddress.trim()) {
    errors.businessAddress = 'Business address is required';
  }

  return errors;
};

interface CheckoutPageContentProps {
  clientSecret: string;
}

const CheckoutPageContent: React.FC<CheckoutPageContentProps> = ({ clientSecret }) => {
  const router = useRouter();
  const { cartItems, clearCart, setShowSuccess } = useCart();
  const stripe = useStripe();
  const elements = useElements();

  const [formData, setFormData] = useState({
    companyName: '',
    firstName: '',
    lastName: '',
    email: '',
    mobileNo: '',
    businessAddress: '',
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isProcessing, setIsProcessing] = useState(false);

  // Get the selected cart item (only one item allowed)
  const selectedItem = cartItems.length > 0 ? cartItems[0] : null;

  // Calculate pricing dynamically from cart context
  // Use totalAnnualPrice if annual, monthlyPrice if monthly
  const basePrice = selectedItem 
    ? (selectedItem.billingType === 'annual' 
        ? selectedItem.totalAnnualPrice 
        : selectedItem.monthlyPrice)
    : 0;
  const gstAmount = basePrice * 0.1; // 10% GST
  const totalAmount = basePrice + gstAmount;

  // Format as currency strings for display
  const planName = selectedItem?.productName || 'No membership selected';
  const planPrice = formatCurrency(basePrice);
  const subtotal = formatCurrency(basePrice);
  const gst = formatCurrency(gstAmount);
  const total = formatCurrency(totalAmount);

  // Redirect if no cart item
  useEffect(() => {
    if (!selectedItem) {
      router.push('/plans');
    }
  }, [selectedItem, router]);

  const handleFormChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handlePayNow = async () => {
    // Validate form
    const formErrors = validateForm(formData);
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    if (!stripe || !elements || !clientSecret) {
      return;
    }

    setIsProcessing(true);

    try {
      const { error: submitError } = await elements.submit();
      if (submitError) {
        setIsProcessing(false);
        return;
      }

      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        clientSecret,
        confirmParams: {
          return_url: `${window.location.origin}/plans`,
          payment_method_data: {
            billing_details: {
              name: `${formData.firstName} ${formData.lastName}`,
              email: formData.email,
              phone: formData.mobileNo,
              address: {
                line1: formData.businessAddress,
              },
            },
          },
        },
        redirect: 'if_required',
      });

      if (error) {
        console.error('Payment error:', error);
        setIsProcessing(false);
      } else if (paymentIntent && paymentIntent.status === 'succeeded') {
        // Clear cart, set success state, and redirect to plans page
        clearCart();
        setShowSuccess(true);
        router.push('/plans');
      }
    } catch (err) {
      console.error('Payment processing error:', err);
      setIsProcessing(false);
    }
  };

  if (!selectedItem) {
    return null;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white py-12 px-4">
      <div className="w-full max-w-5xl bg-white overflow-hidden">
        <CheckoutHeader />
        
        {/* Two Column Layout - Form and Order Summary */}
        <div className="grid grid-cols-2 gap-12 p-6">
          {/* Left Column - Personal Details Form */}
          <div className="flex flex-col">
            <CheckoutForm 
              formData={formData} 
              onChange={handleFormChange}
              errors={errors}
            />
          </div>

          {/* Right Column - Order Summary */}
          <div className="flex flex-col h-full">
            <OrderSummary
              planName={planName}
              planPrice={planPrice}
              subtotal={subtotal}
              gst={gst}
              total={total}
              billingType={selectedItem.billingType}
            />
          </div>
        </div>

        {/* Full Width - Payment Details Section */}
        {clientSecret && (
          <div className="px-6 pb-6">
            <PaymentDetailsSection
              onPayNow={handlePayNow}
              disabled={isProcessing}
            />
          </div>
        )}
      </div>
    </div>
  );
};

const CheckoutPage = () => {
  const { cartItems } = useCart();
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Get the selected cart item (only one item allowed)
  const selectedItem = cartItems.length > 0 ? cartItems[0] : null;

  // Calculate pricing dynamically from cart context
  // Use totalAnnualPrice if annual, monthlyPrice if monthly
  const basePrice = selectedItem 
    ? (selectedItem.billingType === 'annual' 
        ? selectedItem.totalAnnualPrice 
        : selectedItem.monthlyPrice)
    : 0;
  const gstAmount = basePrice * 0.1; // 10% GST
  const totalAmount = basePrice + gstAmount;

  // Create payment intent when component mounts or total changes
  useEffect(() => {
    if (!selectedItem) {
      setIsLoading(false);
      return;
    }

    if (totalAmount > 0) {
      setIsLoading(true);
      setError(null);
      fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: totalAmount,
          currency: 'usd',
        }),
      })
        .then((res) => {
          if (!res.ok) {
            throw new Error('Failed to create payment intent');
          }
          return res.json();
        })
        .then((data) => {
          setClientSecret(data.clientSecret);
          setIsLoading(false);
        })
        .catch((error) => {
          console.error('Error creating payment intent:', error);
          setError('Failed to initialize payment. Please try again.');
          setIsLoading(false);
        });
    }
  }, [totalAmount, selectedItem]);

  if (!selectedItem) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#002a25] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading payment form...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-white py-12 px-4">
        <div className="w-full max-w-5xl bg-white overflow-hidden">
          <CheckoutHeader />
          <div className="p-6">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-800 font-semibold mb-2">Payment Error</p>
              <p className="text-red-600">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!clientSecret) {
    return null;
  }

  return (
    <Elements stripe={stripePromise} options={{ clientSecret }}>
      <CheckoutPageContent clientSecret={clientSecret} />
    </Elements>
  );
};

export default CheckoutPage;
