'use client';

import React from 'react';
import { Section, PageStyles } from '@/types/pageBuilder';
import { InlineEditor } from '../InlineEditor';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

interface PricingSectionProps {
  section: Section;
  globalStyles: PageStyles;
  isPreviewMode: boolean;
  onUpdate: (updates: Partial<Section>) => void;
}

export function PricingSection({
  section,
  globalStyles,
  isPreviewMode,
  onUpdate,
}: PricingSectionProps) {
  const content = section.content;
  const heading = content.heading || 'Simple, Transparent Pricing';
  const description = content.description || 'Choose the perfect plan for your needs';
  const plans = content.plans || [
    {
      name: 'Starter',
      price: '$29',
      period: 'month',
      description: 'Perfect for individuals and small projects',
      features: [
        '5 Projects',
        '10GB Storage',
        'Basic Support',
        'Email Notifications',
      ],
      highlighted: false,
      buttonText: 'Get Started',
    },
    {
      name: 'Professional',
      price: '$79',
      period: 'month',
      description: 'Ideal for growing teams and businesses',
      features: [
        'Unlimited Projects',
        '100GB Storage',
        'Priority Support',
        'Advanced Analytics',
        'Custom Integrations',
      ],
      highlighted: true,
      buttonText: 'Start Free Trial',
    },
    {
      name: 'Enterprise',
      price: '$199',
      period: 'month',
      description: 'For large organizations with custom needs',
      features: [
        'Unlimited Everything',
        'Dedicated Support',
        'Custom Solutions',
        'SLA Guarantee',
        'Onboarding & Training',
      ],
      highlighted: false,
      buttonText: 'Contact Sales',
    },
  ];

  const handleContentChange = (field: string, value: any) => {
    onUpdate({
      content: { ...content, [field]: value },
    });
  };

  const handlePlanChange = (index: number, field: string, value: any) => {
    const newPlans = [...plans];
    newPlans[index] = { ...newPlans[index], [field]: value };
    handleContentChange('plans', newPlans);
  };

  return (
    <div className="container mx-auto px-4 py-16 md:py-24">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan: any, index: number) => (
            <div
              key={index}
              className={cn(
                'relative p-8 rounded-2xl transition-all',
                'border-2',
                plan.highlighted
                  ? 'border-primary-500 shadow-2xl scale-105'
                  : 'border-gray-200 dark:border-gray-700 hover:border-primary-300',
                'bg-white dark:bg-gray-800'
              )}
            >
              {plan.highlighted && (
                <div
                  className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-sm font-semibold text-white"
                  style={{ backgroundColor: globalStyles.primaryColor }}
                >
                  Most Popular
                </div>
              )}

              <div className="text-center mb-6">
                <InlineEditor
                  content={plan.name}
                  onChange={(value) => handlePlanChange(index, 'name', value)}
                  tagName="h3"
                  className="text-2xl font-bold mb-2"
                  disabled={isPreviewMode}
                />

                <InlineEditor
                  content={plan.description}
                  onChange={(value) => handlePlanChange(index, 'description', value)}
                  tagName="p"
                  className="text-sm text-gray-600 dark:text-gray-400"
                  disabled={isPreviewMode}
                />
              </div>

              <div className="text-center mb-8">
                <div className="flex items-baseline justify-center">
                  <InlineEditor
                    content={plan.price}
                    onChange={(value) => handlePlanChange(index, 'price', value)}
                    tagName="span"
                    className="text-5xl font-bold"
                    disabled={isPreviewMode}
                  />
                  <span className="text-gray-500 ml-2">/ {plan.period}</span>
                </div>
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature: string, featureIndex: number) => (
                  <li key={featureIndex} className="flex items-start">
                    <Check
                      className="h-5 w-5 mr-3 flex-shrink-0 mt-0.5"
                      style={{ color: globalStyles.primaryColor }}
                    />
                    <span className="text-gray-600 dark:text-gray-400">{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                className={cn(
                  'w-full py-3 rounded-lg font-semibold transition-all',
                  plan.highlighted
                    ? 'text-white shadow-lg hover:shadow-xl'
                    : 'border-2 hover:bg-gray-50 dark:hover:bg-gray-700'
                )}
                style={{
                  backgroundColor: plan.highlighted ? globalStyles.primaryColor : undefined,
                  borderColor: plan.highlighted ? undefined : globalStyles.primaryColor,
                  color: plan.highlighted ? undefined : globalStyles.primaryColor,
                }}
              >
                {plan.buttonText}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
