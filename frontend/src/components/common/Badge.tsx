import React from 'react';
import { Priority, ExamPriority, SessionStatus } from '../../types';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 
    | 'acid' 
    | 'ultramarine' 
    | 'orchid' 
    | 'tangerine' 
    | 'mint' 
    | 'silver' 
    | 'ink' 
    | 'coral' 
    | 'marigold' 
    | 'celadon' 
    | 'turquoise' 
    | 'lavender' 
    | 'plum' 
    | 'slate' 
    | 'indigo' 
    | 'cyan' 
    | 'purple' 
    | 'emerald' 
    | 'amber' 
    | 'rose';
  dot?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'ultramarine',
  dot = false,
  className = '',
  size = 'md'
}) => {
  const variantStyles = {
    // Prismatic Atelier Primary Palette
    acid: 'bg-[#D6EF72] text-[#1D2506] border-[#B5D73F] font-bold shadow-xs',
    ultramarine: 'bg-[#3548D4]/10 text-[#3548D4] border-[#3548D4]/25 font-semibold',
    orchid: 'bg-[#A66CFF]/15 text-[#7030D6] border-[#A66CFF]/35 font-semibold',
    tangerine: 'bg-[#FF784F]/15 text-[#D4471B] border-[#FF784F]/35 font-semibold',
    mint: 'bg-[#9DE2CB]/30 text-[#12684F] border-[#9DE2CB]/60 font-semibold',
    silver: 'bg-[#D9D5E8]/60 text-[#3C3252] border-[#C2BCD7] font-medium',
    ink: 'bg-[#24152F] text-[#F6F0E6] border-[#382448] font-bold',

    // Secondary / Compatibility variants
    coral: 'bg-[#FF784F]/15 text-[#D4471B] border-[#FF784F]/35 font-semibold',
    marigold: 'bg-[#FFB800]/20 text-[#925B00] border-[#FFB800]/40 font-semibold',
    celadon: 'bg-[#9DE2CB]/30 text-[#12684F] border-[#9DE2CB]/60 font-semibold',
    turquoise: 'bg-[#9DE2CB]/30 text-[#0E6C68] border-[#9DE2CB]/50 font-semibold',
    lavender: 'bg-[#D9D5E8]/70 text-[#493974] border-[#C2BCD7] font-semibold',
    plum: 'bg-[#24152F] text-[#F6F0E6] border-[#382448] font-semibold',
    slate: 'bg-[#EAE4D7] text-[#554763] border-[#DDD5C5] font-medium',

    indigo: 'bg-[#3548D4]/10 text-[#3548D4] border-[#3548D4]/25 font-semibold',
    cyan: 'bg-[#9DE2CB]/30 text-[#0E6C68] border-[#9DE2CB]/50 font-semibold',
    purple: 'bg-[#A66CFF]/15 text-[#7030D6] border-[#A66CFF]/35 font-semibold',
    emerald: 'bg-[#9DE2CB]/30 text-[#12684F] border-[#9DE2CB]/60 font-semibold',
    amber: 'bg-[#FFB800]/20 text-[#925B00] border-[#FFB800]/40 font-semibold',
    rose: 'bg-[#FF784F]/15 text-[#D4471B] border-[#FF784F]/35 font-semibold',
  };

  const dotColors = {
    acid: 'bg-[#1D2506]',
    ultramarine: 'bg-[#3548D4]',
    orchid: 'bg-[#A66CFF]',
    tangerine: 'bg-[#FF784F]',
    mint: 'bg-[#12684F]',
    silver: 'bg-[#3C3252]',
    ink: 'bg-[#D6EF72]',

    coral: 'bg-[#FF784F]',
    marigold: 'bg-[#FFB800]',
    celadon: 'bg-[#12684F]',
    turquoise: 'bg-[#0E6C68]',
    lavender: 'bg-[#A66CFF]',
    plum: 'bg-[#D6EF72]',
    slate: 'bg-[#7A6B8A]',

    indigo: 'bg-[#3548D4]',
    cyan: 'bg-[#0E6C68]',
    purple: 'bg-[#A66CFF]',
    emerald: 'bg-[#12684F]',
    amber: 'bg-[#FFB800]',
    rose: 'bg-[#FF784F]',
  };

  const sizeStyles = {
    sm: 'text-[10px] px-2 py-0.5 font-medium',
    md: 'text-xs px-2.5 py-0.5 font-semibold',
    lg: 'text-xs px-3 py-1 font-bold'
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border tracking-wider uppercase font-mono shadow-2xs ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
    >
      {dot && (
        <span className={`w-1.5 h-1.5 rounded-full ${dotColors[variant]} animate-pulse`} />
      )}
      {children}
    </span>
  );
};

export const PriorityBadge: React.FC<{ priority: Priority | ExamPriority }> = ({ priority }) => {
  switch (priority) {
    case 'critical':
      return <Badge variant="tangerine" dot>Critical Exam</Badge>;
    case 'high':
      return <Badge variant="acid" dot>High Priority</Badge>;
    case 'medium':
      return <Badge variant="ultramarine">Medium Priority</Badge>;
    case 'low':
    default:
      return <Badge variant="silver">Low Priority</Badge>;
  }
};

export const SessionStatusBadge: React.FC<{ status: SessionStatus }> = ({ status }) => {
  switch (status) {
    case 'completed':
      return <Badge variant="mint" dot>Completed</Badge>;
    case 'missed':
      return <Badge variant="tangerine" dot>Missed</Badge>;
    case 'rescheduled':
      return <Badge variant="orchid" dot>Adapted</Badge>;
    case 'upcoming':
    default:
      return <Badge variant="ultramarine">Scheduled</Badge>;
  }
};
