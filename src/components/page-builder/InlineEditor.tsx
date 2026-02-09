'use client';

import React, { useState, useRef, useEffect } from 'react';
import ContentEditable from 'react-contenteditable';
import { cn } from '@/lib/utils';

interface InlineEditorProps {
  content: string;
  onChange: (content: string) => void;
  tagName?: keyof JSX.IntrinsicElements;
  className?: string;
  placeholder?: string;
  disabled?: boolean;
}

export function InlineEditor({
  content,
  onChange,
  tagName = 'div',
  className,
  placeholder = 'Click to edit...',
  disabled = false,
}: InlineEditorProps) {
  const [isFocused, setIsFocused] = useState(false);
  const contentRef = useRef(content);

  useEffect(() => {
    contentRef.current = content;
  }, [content]);

  const handleChange = (evt: any) => {
    const newContent = evt.target.value;
    contentRef.current = newContent;
  };

  const handleBlur = () => {
    setIsFocused(false);
    if (contentRef.current !== content) {
      onChange(contentRef.current);
    }
  };

  return (
    <ContentEditable
      html={content || ''}
      disabled={disabled}
      onChange={handleChange}
      onFocus={() => setIsFocused(true)}
      onBlur={handleBlur}
      tagName={tagName}
      className={cn(
        'outline-none transition-all',
        isFocused && 'ring-2 ring-primary-500 ring-offset-2',
        !content && !isFocused && 'opacity-50',
        className
      )}
      data-placeholder={!content && !isFocused ? placeholder : undefined}
      style={{
        minHeight: '1em',
      }}
    />
  );
}
