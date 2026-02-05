interface Product {
  id: number;
  name: string;
  monthlyPrice: number;
  totalMonthlyPrice: number;
  totalMonthlySavings: number;
  totalAnnualPrice: number;
}

export const products: Product[] = [
  {
    id: 1,
    name: 'Bronze Membership',
    monthlyPrice: 140,
    totalMonthlyPrice: 1680,
    totalMonthlySavings: 420,
    totalAnnualPrice: 2140,
  },
  {
    id: 2,
    name: 'Silver Membership',
    monthlyPrice: 240,
    totalMonthlyPrice: 2880,
    totalMonthlySavings: 3420,
    totalAnnualPrice: 5400,
  },
  {
    id: 3,
    name: 'Gold Membership',
    monthlyPrice: 340,
    totalMonthlyPrice: 3680,
    totalMonthlySavings: 820,
    totalAnnualPrice: 6820,
  },
];