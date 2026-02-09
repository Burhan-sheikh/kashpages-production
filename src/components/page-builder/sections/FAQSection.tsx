'use client';

import React, { useState } from 'react';
import { Section, PageStyles } from '@/types/pageBuilder';
import { InlineEditor } from '../InlineEditor';
import { cn } from '@/lib/utils';
import { ChevronDown } from 'lucide-react';

interface FAQSectionProps {
  section: Section;
  globalStyles: PageStyles;
  isPreviewMode: boolean;
  onUpdate: (updates: Partial<Section>) => void;
}

export function FAQSection({
  section,
  globalStyles,
  isPreviewMode,
  onUpdate,
}: FAQSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const content = section.content;
  const heading = content.heading || 'Frequently Asked Questions';
  const description = content.description || 'Find answers to common questions';
  const faqs = content.faqs || [
    {
      question: 'What is your refund policy?',
      answer: 'We offer a 30-day money-back guarantee. If you\'re not satisfied with our service, contact us within 30 days for a full refund.',
    },
    {
      question: 'How do I get started?',
      answer: 'Simply sign up for an account, choose your plan, and you\'ll be up and running in minutes. Our onboarding process is quick and easy.',
    },
    {
      question: 'Can I change my plan later?',
      answer: 'Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately, and billing is prorated.',
    },
    {
      question: 'Do you offer customer support?',
      answer: 'We provide 24/7 customer support via email and live chat. Premium plans also include phone support and dedicated account managers.',
    },
    {
      question: 'Is my data secure?',
      answer: 'Absolutely. We use industry-standard encryption and security measures to protect your data. We\'re also compliant with GDPR and other regulations.',
    },
  ];

  const handleContentChange = (field: string, value: any) => {
    onUpdate({
      content: { ...content, [field]: value },
    });
  };

  const handleFaqChange = (index: number, field: string, value: string) => {
    const newFaqs = [...faqs];
    newFaqs[index] = { ...newFaqs[index], [field]: value };
    handleContentChange('faqs', newFaqs);
  };

  return (
    <div className="container mx-auto px-4 py-16 md:py-24">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <InlineEditor
            content={heading}
            onChange={(value) => handleContentChange('heading', value)}
            tagName="h2"
            className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4"
            style={{
              fontFamily: globalStyles.typography.fontFamily,
              color: section.styles.textColor || globalStyles.primaryColor,
            }}
            disabled={isPreviewMode}
          />

          <InlineEditor
            content={description}
            onChange={(value) => handleContentChange('description', value)}
            tagName="p"
            className="text-lg md:text-xl text-gray-600 dark:text-gray-400"
            disabled={isPreviewMode}
          />
        </div>

        <div className="space-y-4">
          {faqs.map((faq: any, index: number) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden bg-white dark:bg-gray-800"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="w-full p-6 text-left flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                >
                  <InlineEditor
                    content={faq.question}
                    onChange={(value) => handleFaqChange(index, 'question', value)}
                    tagName="h3"
                    className="text-lg font-semibold pr-4"
                    disabled={isPreviewMode}
                  />
                  <ChevronDown
                    className={cn(
                      'h-5 w-5 flex-shrink-0 transition-transform',
                      isOpen && 'rotate-180'
                    )}
                    style={{ color: globalStyles.primaryColor }}
                  />
                </button>

                <div
                  className={cn(
                    'overflow-hidden transition-all',
                    isOpen ? 'max-h-96' : 'max-h-0'
                  )}
                >
                  <div className="p-6 pt-0">
                    <InlineEditor
                      content={faq.answer}
                      onChange={(value) => handleFaqChange(index, 'answer', value)}
                      tagName="p"
                      className="text-gray-600 dark:text-gray-400 leading-relaxed"
                      disabled={isPreviewMode}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
