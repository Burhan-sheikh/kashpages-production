'use client';

import React from 'react';
import { Section } from '../types';
import { motion } from 'framer-motion';

interface SectionRendererProps {
  section: Section;
  isPreview?: boolean;
}

export function SectionRenderer({ section, isPreview = false }: SectionRendererProps) {
  const renderSection = () => {
    switch (section.type) {
      case 'hero':
        return (
          <div
            className="relative bg-gradient-to-r from-primary-600 to-primary-700 text-white py-20 px-6"
            style={{
              backgroundImage: section.data.backgroundImage
                ? `url(${section.data.backgroundImage})`
                : undefined,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                {section.data.title || 'Welcome'}
              </h1>
              <p className="text-xl mb-8 opacity-90">
                {section.data.subtitle || 'Your business tagline'}
              </p>
              <div className="flex gap-4 justify-center">
                {section.data.primaryButton && (
                  <a
                    href={section.data.primaryButton.link}
                    className="bg-white text-primary-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                  >
                    {section.data.primaryButton.text}
                  </a>
                )}
                {section.data.secondaryButton && (
                  <a
                    href={section.data.secondaryButton.link}
                    className="border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-primary-600 transition-colors"
                  >
                    {section.data.secondaryButton.text}
                  </a>
                )}
              </div>
            </div>
          </div>
        );

      case 'about':
        return (
          <div className="py-16 px-6">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                {section.data.heading || 'About Us'}
              </h2>
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <p className="text-gray-600 whitespace-pre-line">
                    {section.data.content || 'Tell your story here...'}
                  </p>
                </div>
                {section.data.image && (
                  <div>
                    <img
                      src={section.data.image}
                      alt="About"
                      className="rounded-lg shadow-lg w-full"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      case 'contact':
        return (
          <div className="py-16 px-6 bg-gray-50">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
                {section.data.heading || 'Get in Touch'}
              </h2>
              {section.data.showForm && (
                <div className="bg-white rounded-lg shadow-md p-8 max-w-lg mx-auto">
                  <form className="space-y-4">
                    <input
                      type="text"
                      placeholder="Your Name"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                    <input
                      type="email"
                      placeholder="Email Address"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                    <input
                      type="tel"
                      placeholder="Phone Number"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                    <textarea
                      placeholder="Your Message"
                      rows={4}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                    <button
                      type="submit"
                      className="w-full bg-primary-600 text-white py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
                    >
                      Send Message
                    </button>
                  </form>
                </div>
              )}
            </div>
          </div>
        );

      case 'services':
        return (
          <div className="py-16 px-6">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
                {section.data.heading || 'Our Services'}
              </h2>
              <div className="grid md:grid-cols-3 gap-8">
                {section.data.services?.map((service: any, index: number) => (
                  <div
                    key={index}
                    className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
                  >
                    <div className="text-3xl mb-4">{service.icon}</div>
                    <h3 className="text-xl font-semibold mb-2">{service.name}</h3>
                    <p className="text-gray-600 mb-4">{service.description}</p>
                    <p className="text-primary-600 font-semibold">{service.price}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="py-8 px-6 bg-gray-100 text-center">
            <p className="text-gray-600">
              Section type "{section.type}" - Preview coming soon
            </p>
          </div>
        );
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="section-wrapper"
    >
      {renderSection()}
    </motion.div>
  );
}
