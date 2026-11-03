import type { Metadata } from 'next';
import Banner from '@/components/Banner';
import NewArrivals from '@/components/NewArrivals';
import HowItWorks from '@/components/HowItWorks';
import TopCategories from '@/components/TopCategories';

export const metadata: Metadata = { title: 'BookNook | Home' };

export default function Home() {
  return (
    <main>
      <Banner />
      <NewArrivals />
      <HowItWorks />
      <TopCategories />
    </main>
  );
}