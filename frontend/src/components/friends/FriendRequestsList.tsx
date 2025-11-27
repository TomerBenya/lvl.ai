'use client';

import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { FriendCard, FriendCardSkeleton } from './FriendCard';
import type { User } from '@/lib/types';
import { InboxIcon, CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface FriendRequestsListProps {
  requests: User[];
  loading: boolean;
  onAccept: (userId: string) => Promise<void>;
  onDecline: (userId: string) => Promise<void>;
}

export function FriendRequestsList({
  requests,
  loading,
  onAccept,
  onDecline
}: FriendRequestsListProps) {
  const [processingId, setProcessingId] = useState<string | null>(null);

  const handleAccept = async (userId: string) => {
    setProcessingId(userId);
    try {
      await onAccept(userId);
    } finally {
      setProcessingId(null);
    }
  };

  const handleDecline = async (userId: string) => {
    setProcessingId(userId);
    try {
      await onDecline(userId);
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

  if (requests.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <InboxIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">No pending requests</h3>
          <p className="text-muted-foreground">
            You don&apos;t have any friend requests waiting for your response.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {requests.map((request) => (
        <FriendCard
          key={request._id}
          user={request}
          showLevel={true}
          actions={
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDecline(request._id)}
                disabled={processingId !== null}
              >
                <XMarkIcon className="h-4 w-4 mr-1" />
                Decline
              </Button>
              <Button
                size="sm"
                onClick={() => handleAccept(request._id)}
                loading={processingId === request._id}
                disabled={processingId !== null && processingId !== request._id}
              >
                <CheckIcon className="h-4 w-4 mr-1" />
                Accept
              </Button>
            </div>
          }
        />
      ))}
    </div>
  );
}

export default FriendRequestsList;
