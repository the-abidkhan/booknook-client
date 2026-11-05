'use client';

import Link from 'next/link';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const slides = [
  {
    title: 'Discover Your Next Great Read',
    text: 'Browse a growing collection of books across fiction, science, history and more.',
    image: '/banner-1.jpg',
  },
  {
    title: 'Borrow a Book for a Few Days',
    text: 'Pick a book you love, borrow it with one click and enjoy it at your own pace.',
    image: '/banner-2.jpg',
  },
  {
    title: 'Share Books With Everyone',
    text: 'Add your own books to the library so other readers can enjoy them too.',
    image: '/banner-3.jpg',
  },
];

export default function Banner() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-6">
      <Swiper
        modules={[Autoplay, Navigation, Pagination]}
        autoplay={{ delay: 4000, disableOnInteraction: false }}
        navigation
        pagination={{ clickable: true }}
        loop
        className="h-[420px] overflow-hidden rounded-xl md:h-[500px]"
        style={
          {
            '--swiper-navigation-color': '#ffffff',
            '--swiper-pagination-color': '#ffffff',
          } as React.CSSProperties
        }
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.title}>
            <div
              className="relative flex h-full items-center justify-center bg-cover bg-center px-6 text-center"
              style={{ backgroundImage: `url(${slide.image})` }}
            >
              <div className="absolute inset-0 bg-[#2A1A10]/60" />
              <div className="relative max-w-2xl">
                <h2 className="text-3xl font-bold text-white md:text-5xl">
                  {slide.title}
                </h2>
                <p className="mt-4 text-base text-[#F5EBDD] md:text-lg">
                  {slide.text}
                </p>
                <Link
                  href="/books"
                  className="mt-8 inline-block rounded-lg bg-[#F5EBDD] px-6 py-3 font-semibold text-[#3E2A1E] transition-colors hover:bg-white"
                >
                  Browse Books
                </Link>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}