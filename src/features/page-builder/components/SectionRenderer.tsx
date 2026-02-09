'use client';

import React from 'react';
import { Section } from '../types';

interface SectionRendererProps {
  section: Section;
  isPreview?: boolean;
}

export function SectionRenderer({ section, isPreview = false }: SectionRendererProps) {
  const { type, data } = section;

  // Base classes for all sections
  const baseClasses = 'w-full';
  const previewClasses = isPreview ? '' : 'min-h-[100px]';

  switch (type) {
    case 'hero':
      return (
        <section
          className={`${baseClasses} ${previewClasses} relative bg-gradient-to-br from-primary-600 to-primary-800 text-white py-20 px-6`}
          style={{
            backgroundImage: data.backgroundImage
              ? `url(${data.backgroundImage})`
              : undefined,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              {data.headline || 'Welcome to Our Business'}
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-white/90">
              {data.subheadline || 'Your trusted partner for quality services'}
            </p>
            {data.buttonText && (
              <a
                href={data.buttonLink || '#'}
                className="inline-block bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                {data.buttonText}
              </a>
            )}
          </div>
        </section>
      );

    case 'about':
      return (
        <section className={`${baseClasses} ${previewClasses} py-16 px-6`}>
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-4">
                  {data.title || 'About Us'}
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  {data.description || 'Tell your story here...'}
                </p>
              </div>
              {data.image && (
                <div className="rounded-lg overflow-hidden">
                  <img
                    src={data.image}
                    alt={data.title}
                    className="w-full h-auto"
                  />
                </div>
              )}
            </div>
          </div>
        </section>
      );

    case 'services':
      return (
        <section className={`${baseClasses} ${previewClasses} py-16 px-6 bg-gray-50`}>
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">
                {data.title || 'Our Services'}
              </h2>
              {data.description && (
                <p className="text-gray-600">{data.description}</p>
              )}
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {(data.items || []).map((item: any, index: number) => (
                <div key={index} className="bg-white p-6 rounded-lg shadow-sm">
                  <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                  <p className="text-gray-600">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      );

    case 'contact':
      return (
        <section className={`${baseClasses} ${previewClasses} py-16 px-6`}>
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center">
              {data.title || 'Contact Us'}
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                {data.email && (
                  <div>
                    <h3 className="font-semibold mb-1">Email</h3>
                    <p className="text-gray-600">{data.email}</p>
                  </div>
                )}
                {data.phone && (
                  <div>
                    <h3 className="font-semibold mb-1">Phone</h3>
                    <p className="text-gray-600">{data.phone}</p>
                  </div>
                )}
                {data.address && (
                  <div>
                    <h3 className="font-semibold mb-1">Address</h3>
                    <p className="text-gray-600">{data.address}</p>
                  </div>
                )}
              </div>
              <div>
                <form className="space-y-4">
                  <input
                    type="text"
                    placeholder="Your Name"
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                  <input
                    type="email"
                    placeholder="Your Email"
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                  <textarea
                    placeholder="Your Message"
                    rows={4}
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                  <button
                    type="submit"
                    className="w-full bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700"
                  >
                    Send Message
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>
      );

    case 'gallery':
      return (
        <section className={`${baseClasses} ${previewClasses} py-16 px-6`}>
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center">
              {data.title || 'Gallery'}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {(data.images || []).map((image: string, index: number) => (
                <div
                  key={index}
                  className="aspect-square rounded-lg overflow-hidden"
                >
                  <img
                    src={image}
                    alt={`Gallery ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      );

    case 'testimonials':
      return (
        <section className={`${baseClasses} ${previewClasses} py-16 px-6 bg-gray-50`}>
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold mb-12 text-center">
              {data.title || 'What Our Clients Say'}
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {(data.testimonials || []).map((testimonial: any, index: number) => (
                <div key={index} className="bg-white p-6 rounded-lg shadow-sm">
                  <p className="text-gray-600 mb-4">"{testimonial.text}"</p>
                  <div className="font-semibold">{testimonial.name}</div>
                  <div className="text-sm text-gray-500">{testimonial.role}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      );

    case 'cta':
      return (
        <section
          className={`${baseClasses} ${previewClasses} bg-primary-600 text-white py-16 px-6`}
        >
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {data.headline || 'Ready to Get Started?'}
            </h2>
            <p className="text-xl mb-8 text-white/90">
              {data.description || 'Take action today'}
            </p>
            {data.buttonText && (
              <a
                href={data.buttonLink || '#'}
                className="inline-block bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                {data.buttonText}
              </a>
            )}
          </div>
        </section>
      );

    default:
      return (
        <section className={`${baseClasses} ${previewClasses} py-16 px-6 bg-gray-100`}>
          <div className="max-w-6xl mx-auto text-center">
            <p className="text-gray-500">Section type "{type}" renderer coming soon...</p>
          </div>
        </section>
      );
  }
}