'use client';

import React from 'react';
import { Section, PageStyles } from '@/types/pageBuilder';
import { InlineEditor } from '../InlineEditor';
import { cn } from '@/lib/utils';
import { Linkedin, Twitter, Mail } from 'lucide-react';

interface TeamSectionProps {
  section: Section;
  globalStyles: PageStyles;
  isPreviewMode: boolean;
  onUpdate: (updates: Partial<Section>) => void;
}

export function TeamSection({
  section,
  globalStyles,
  isPreviewMode,
  onUpdate,
}: TeamSectionProps) {
  const content = section.content;
  const heading = content.heading || 'Meet Our Team';
  const description = content.description || 'The talented people behind our success';
  const members = content.members || [
    {
      name: 'Sarah Johnson',
      role: 'Founder & CEO',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300',
      bio: 'Visionary leader with 15 years of industry experience',
      linkedin: '#',
      twitter: '#',
      email: 'sarah@example.com',
    },
    {
      name: 'David Chen',
      role: 'Chief Technology Officer',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300',
      bio: 'Tech innovator passionate about scalable solutions',
      linkedin: '#',
      twitter: '#',
      email: 'david@example.com',
    },
    {
      name: 'Emily Rodriguez',
      role: 'Head of Design',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300',
      bio: 'Award-winning designer with an eye for detail',
      linkedin: '#',
      twitter: '#',
      email: 'emily@example.com',
    },
    {
      name: 'Michael Brown',
      role: 'Marketing Director',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300',
      bio: 'Strategic marketer driving growth and engagement',
      linkedin: '#',
      twitter: '#',
      email: 'michael@example.com',
    },
  ];

  const handleContentChange = (field: string, value: any) => {
    onUpdate({
      content: { ...content, [field]: value },
    });
  };

  const handleMemberChange = (index: number, field: string, value: string) => {
    const newMembers = [...members];
    newMembers[index] = { ...newMembers[index], [field]: value };
    handleContentChange('members', newMembers);
  };

  return (
    <div className="container mx-auto px-4 py-16 md:py-24">
      <div className="max-w-6xl mx-auto">
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {members.map((member: any, index: number) => (
            <div
              key={index}
              className="text-center group"
            >
              {/* Image */}
              <div className="relative mb-4 overflow-hidden rounded-2xl aspect-square">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>

              {/* Info */}
              <InlineEditor
                content={member.name}
                onChange={(value) => handleMemberChange(index, 'name', value)}
                tagName="h3"
                className="text-xl font-semibold mb-1"
                disabled={isPreviewMode}
              />

              <InlineEditor
                content={member.role}
                onChange={(value) => handleMemberChange(index, 'role', value)}
                tagName="p"
                className="text-sm mb-3"
                style={{ color: globalStyles.primaryColor }}
                disabled={isPreviewMode}
              />

              <InlineEditor
                content={member.bio}
                onChange={(value) => handleMemberChange(index, 'bio', value)}
                tagName="p"
                className="text-sm text-gray-600 dark:text-gray-400 mb-4"
                disabled={isPreviewMode}
              />

              {/* Social Links */}
              {isPreviewMode && (
                <div className="flex justify-center space-x-3">
                  <a
                    href={member.linkedin}
                    className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                  >
                    <Linkedin className="h-4 w-4" />
                  </a>
                  <a
                    href={member.twitter}
                    className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                  >
                    <Twitter className="h-4 w-4" />
                  </a>
                  <a
                    href={`mailto:${member.email}`}
                    className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                  >
                    <Mail className="h-4 w-4" />
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
