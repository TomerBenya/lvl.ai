'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { FriendCard, FriendCardSkeleton } from './FriendCard';
import type { User } from '@/lib/types';
import { PaperAirplaneIcon, ClockIcon } from '@heroicons/react/24/outline';

interface SentRequestsListProps {
  requests: User[];
  loading: boolean;
}

export function SentRequestsList({ requests, loading }: SentRequestsListProps) {
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
          <PaperAirplaneIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">No sent requests</h3>
          <p className="text-muted-foreground">
            You haven&apos;t sent any friend requests yet. Search for users to connect!
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
            <Badge variant="warning" size="sm" className="flex items-center gap-1">
              <ClockIcon className="h-3 w-3" />
              Pending
            </Badge>
          }
        />
      ))}
    </div>
  );
}

export default SentRequestsList;
