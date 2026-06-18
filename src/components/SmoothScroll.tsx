'use client';
import { useEffect } from 'react';

export default function SmoothScroll() {
  useEffect(() => {
    requestAnimationFrame(() => {
      document.documentElement.classList.add('smooth-scroll');
    });
  }, []);
  return null;
}
