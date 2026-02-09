import React from 'react';
import Image from 'next/image';
import clsx from 'clsx';
import { User } from 'lucide-react';

interface AvatarProps {
  src?: string;
  alt?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export function Avatar({ src, alt = 'Avatar', size = 'md', className }: AvatarProps) {
  const sizes = {
    xs: 'h-6 w-6',
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16',
  };

  const iconSizes = {
    xs: 'h-3 w-3',
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6',
    xl: 'h-8 w-8',
  };

  return (
    <div
      className={clsx(
        'relative inline-flex items-center justify-center rounded-full bg-gray-200 overflow-hidden',
        sizes[size],
        className
      )}
    >
      {src ? (
        <Image src={src} alt={alt} fill className="object-cover" />
      ) : (
        <User className={clsx('text-gray-500', iconSizes[size])} />
      )}
    </div>
  );
}
