'use client';

import React from 'react';
import { Badge } from '@/components/ui/Badge';
import type { User } from '@/lib/types';

interface FriendCardProps {
  user: User;
  actions?: React.ReactNode;
  showLevel?: boolean;
  showXp?: boolean;
  className?: string;
}

export function FriendCard({
  user,
  actions,
  showLevel = true,
  showXp = false,
  className = ''
}: FriendCardProps) {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div
      className={`flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-secondary/30 transition-colors ${className}`}
    >
      {/* User Info */}
      <div className="flex items-center gap-3">
        {/* Avatar */}
        {user.avatar ? (
          <img
            src={user.avatar}
            alt={user.name}
            className="w-12 h-12 rounded-full object-cover"
          />
        ) : (
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
            {getInitials(user.name)}
          </div>
        )}

        {/* Name and Email */}
        <div>
          <div className="flex items-center gap-2">
            <p className="font-medium text-foreground">{user.name}</p>
            {showLevel && user.level && (
              <Badge variant="secondary" size="sm">
                Lvl {user.level}
              </Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground">{user.email}</p>
          {showXp && user.xp !== undefined && (
            <p className="text-xs text-primary font-medium">{user.xp.toLocaleString()} XP</p>
          )}
        </div>
      </div>

      {/* Actions */}
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}

// Loading skeleton for FriendCard
export function FriendCardSkeleton() {
  return (
    <div className="flex items-center justify-between p-4 rounded-lg border bg-card animate-pulse">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-full bg-secondary" />
        <div>
          <div className="h-4 w-32 bg-secondary rounded mb-2" />
          <div className="h-3 w-40 bg-secondary rounded" />
        </div>
      </div>
      <div className="flex items-center gap-2">
        <div className="h-8 w-20 bg-secondary rounded" />
      </div>
    </div>
  );
}

export default FriendCard;
