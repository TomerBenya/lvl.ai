'use client';

import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { FriendCard, FriendCardSkeleton } from './FriendCard';
import type { User } from '@/lib/types';
import { ShieldCheckIcon } from '@heroicons/react/24/outline';

interface BlockedUsersListProps {
  users: User[];
  loading: boolean;
  onUnblock: (userId: string) => Promise<void>;
}

export function BlockedUsersList({ users, loading, onUnblock }: BlockedUsersListProps) {
  const [processingId, setProcessingId] = useState<string | null>(null);

  const handleUnblock = async (userId: string) => {
    setProcessingId(userId);
    try {
      await onUnblock(userId);
    } finally {
      setProcessingId(null);
    }
  };

  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2].map((i) => (
          <FriendCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <ShieldCheckIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">No blocked users</h3>
          <p className="text-muted-foreground">
            You haven&apos;t blocked anyone. Users you block won&apos;t be able to send you friend
            requests.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {users.map((user) => (
        <FriendCard
          key={user._id}
          user={user}
          showLevel={false}
          actions={
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleUnblock(user._id)}
              loading={processingId === user._id}
              disabled={processingId !== null && processingId !== user._id}
            >
              Unblock
            </Button>
          }
        />
      ))}
    </div>
  );
}

export default BlockedUsersList;
