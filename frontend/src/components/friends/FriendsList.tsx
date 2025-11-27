'use client';

import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { FriendCard, FriendCardSkeleton } from './FriendCard';
import type { User } from '@/lib/types';
import { UserGroupIcon, TrashIcon, NoSymbolIcon } from '@heroicons/react/24/outline';

interface FriendsListProps {
  friends: User[];
  loading: boolean;
  onRemove: (userId: string) => Promise<void>;
  onBlock: (userId: string) => Promise<void>;
}

export function FriendsList({ friends, loading, onRemove, onBlock }: FriendsListProps) {
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [confirmRemoveId, setConfirmRemoveId] = useState<string | null>(null);
  const [confirmBlockId, setConfirmBlockId] = useState<string | null>(null);

  const handleRemove = async (userId: string) => {
    setProcessingId(userId);
    try {
      await onRemove(userId);
    } finally {
      setProcessingId(null);
      setConfirmRemoveId(null);
    }
  };

  const handleBlock = async (userId: string) => {
    setProcessingId(userId);
    try {
      await onBlock(userId);
    } finally {
      setProcessingId(null);
      setConfirmBlockId(null);
    }
  };

  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <FriendCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (friends.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <UserGroupIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">No friends yet</h3>
          <p className="text-muted-foreground">
            Search for users and send friend requests to connect with others!
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {friends.map((friend) => (
        <FriendCard
          key={friend._id}
          user={friend}
          showLevel={true}
          showXp={true}
          actions={
            <div className="flex items-center gap-2">
              {confirmRemoveId === friend._id ? (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setConfirmRemoveId(null)}
                    disabled={processingId === friend._id}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleRemove(friend._id)}
                    loading={processingId === friend._id}
                  >
                    Confirm
                  </Button>
                </>
              ) : confirmBlockId === friend._id ? (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setConfirmBlockId(null)}
                    disabled={processingId === friend._id}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleBlock(friend._id)}
                    loading={processingId === friend._id}
                  >
                    Block
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setConfirmRemoveId(friend._id)}
                    disabled={processingId !== null}
                  >
                    <TrashIcon className="h-4 w-4 mr-1" />
                    Remove
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setConfirmBlockId(friend._id)}
                    disabled={processingId !== null}
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <NoSymbolIcon className="h-4 w-4" />
                  </Button>
                </>
              )}
            </div>
          }
        />
      ))}
    </div>
  );
}

export default FriendsList;
