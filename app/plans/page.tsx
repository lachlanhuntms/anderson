'use client';

import React from 'react'
import { useCart } from '../../contexts/CartContext'
import MembershipPlansCarousel from '../../components/MembershipPlansCarousel'
import ContactFormSection from '../../components/ContactFormSection'
import SuccessMessage from '../../components/SuccessMessage'
import { products } from '../../data/products'

const PlansPage = () => {
  const { showSuccess, setShowSuccess } = useCart();

  return (
    <div className="min-h-screen bg-white py-12">
      <SuccessMessage show={showSuccess} onDismiss={() => setShowSuccess(false)} />
      <div className="container mx-auto px-4">
        {/* <h1 className="text-4xl font-bold text-center text-gray-800 mb-12">
          Membership Plans
        </h1> */}
        <MembershipPlansCarousel products={products} />
      </div>
    </div>
  )
}

export default PlansPage
