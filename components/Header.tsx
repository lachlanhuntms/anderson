'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingCart } from '@phosphor-icons/react';
import { useCart } from '../contexts/CartContext';

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

const Header: React.FC = () => {
  const pathname = usePathname();
  const { cartItems, getPreviewPrice, getTotalPrice } = useCart();
  
  // On /plans page, show preview price; on other pages, show committed cart price
  const isPlansPage = pathname === '/plans';
  const cartPrice = isPlansPage ? getPreviewPrice() : getTotalPrice();
  const displayPrice = cartPrice > 0 ? formatCurrency(cartPrice) : '$0.00';

  return (
    <header className="bg-[#002a25] text-white px-6 py-4">
      <div className="container mx-auto flex items-center justify-between">
        {/* Logo on the left */}
        <Link href="/" className="flex items-center">
          <Image 
            src="/logo/logo.png" 
            alt="Logo" 
            className="h-auto w-32"
            width={100}
            height={100}
          />
        </Link>

        {/* Navigation link in center */}
        <nav className="flex-1 flex justify-center">
          <Link 
            href="/plans" 
            className="text-white hover:text-gray-200 font-semibold transition-colors"
          >
            Membership Plans
          </Link>
        </nav>

        {/* Cart button on the right */}
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 text-white hover:text-gray-200 transition-colors">
            <ShoppingCart size={24} color="white" weight="bold" />
            <span className="font-semibold">{displayPrice}</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
