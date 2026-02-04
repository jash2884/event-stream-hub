import { Heart, MessageCircle, UserPlus, ShoppingCart, Share2, AtSign } from 'lucide-react';
import { Verb } from '@/types/events';
import { cn } from '@/lib/utils';

interface VerbBadgeProps {
  verb: Verb;
  showIcon?: boolean;
  className?: string;
}

const verbConfig: Record<Verb, { icon: typeof Heart; label: string; className: string }> = {
  like: { icon: Heart, label: 'Liked', className: 'verb-like' },
  comment: { icon: MessageCircle, label: 'Commented', className: 'verb-comment' },
  follow: { icon: UserPlus, label: 'Followed', className: 'verb-follow' },
  purchase: { icon: ShoppingCart, label: 'Purchased', className: 'verb-purchase' },
  share: { icon: Share2, label: 'Shared', className: 'verb-share' },
  mention: { icon: AtSign, label: 'Mentioned', className: 'verb-mention' },
};

export function VerbBadge({ verb, showIcon = true, className }: VerbBadgeProps) {
  const config = verbConfig[verb];
  const Icon = config.icon;

  return (
    <span className={cn('verb-badge inline-flex items-center gap-1', config.className, className)}>
      {showIcon && <Icon className="h-3 w-3" />}
      {config.label}
    </span>
  );
}

export function getVerbIcon(verb: Verb) {
  return verbConfig[verb].icon;
}

export function getVerbLabel(verb: Verb) {
  return verbConfig[verb].label;
}
