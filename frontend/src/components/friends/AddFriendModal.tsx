'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { FriendCard, FriendCardSkeleton } from './FriendCard';
import type { User } from '@/lib/types';
import {
  XMarkIcon,
  MagnifyingGlassIcon,
  UserPlusIcon,
  CheckIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

interface AddFriendModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSendRequest: (userId: string) => Promise<void>;
  searchUsers: (query: string) => Promise<User[]>;
  friends: User[];
  sentRequests: User[];
  pendingRequests: User[];
}

export function AddFriendModal({
  isOpen,
  onClose,
  onSendRequest,
  searchUsers,
  friends,
  sentRequests,
  pendingRequests
}: AddFriendModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [searching, setSearching] = useState(false);
  const [sendingTo, setSendingTo] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Debounced search
  useEffect(() => {
    if (!searchQuery || searchQuery.length < 2) {
      setSearchResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setSearching(true);
      setError(null);
      try {
        const results = await searchUsers(searchQuery);
        setSearchResults(results);
      } catch (err) {
        console.error('Search error:', err);
        setError('Failed to search users');
        setSearchResults([]);
      } finally {
        setSearching(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, searchUsers]);

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setSearchQuery('');
      setSearchResults([]);
      setError(null);
    }
  }, [isOpen]);

  const handleSendRequest = async (userId: string) => {
    setSendingTo(userId);
    setError(null);
    try {
      await onSendRequest(userId);
      // Remove from search results after successful send
      setSearchResults((prev) => prev.filter((u) => u._id !== userId));
    } catch (err) {
      console.error('Error sending request:', err);
      // Try to get error message from axios response or use default
      const axiosError = err as { response?: { data?: { message?: string } } };
      setError(axiosError.response?.data?.message || 'Failed to send friend request');
    } finally {
      setSendingTo(null);
    }
  };

  const getUserStatus = (userId: string): 'friend' | 'pending' | 'sent' | 'none' => {
    if (friends.some((f) => f._id === userId)) return 'friend';
    if (pendingRequests.some((r) => r._id === userId)) return 'pending';
    if (sentRequests.some((r) => r._id === userId)) return 'sent';
    return 'none';
  };

  // Close on backdrop click
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-background rounded-lg max-h-[90vh] overflow-hidden w-full max-w-lg shadow-xl border">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div>
            <h2 className="text-lg font-semibold text-foreground">Add Friend</h2>
            <p className="text-sm text-muted-foreground">Search for users by name or email</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-secondary rounded-full transition-colors"
            aria-label="Close modal"
          >
            <XMarkIcon className="h-5 w-5 text-muted-foreground" />
          </button>
        </div>

        {/* Search Input */}
        <div className="p-4 border-b">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
              autoFocus
            />
          </div>
          {searchQuery && searchQuery.length < 2 && (
            <p className="text-xs text-muted-foreground mt-2">
              Enter at least 2 characters to search
            </p>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="mx-4 mt-4 p-3 bg-destructive/10 border border-destructive/30 rounded-md">
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}

        {/* Results */}
        <div className="p-4 overflow-y-auto max-h-[400px]">
          {searching ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <FriendCardSkeleton key={i} />
              ))}
            </div>
          ) : searchResults.length > 0 ? (
            <div className="space-y-3">
              {searchResults.map((user) => {
                const status = getUserStatus(user._id);
                return (
                  <FriendCard
                    key={user._id}
                    user={user}
                    showLevel={true}
                    showXp={true}
                    actions={
                      status === 'friend' ? (
                        <Badge variant="success" size="sm" className="flex items-center gap-1">
                          <CheckIcon className="h-3 w-3" />
                          Friends
                        </Badge>
                      ) : status === 'sent' ? (
                        <Badge variant="warning" size="sm" className="flex items-center gap-1">
                          <ClockIcon className="h-3 w-3" />
                          Pending
                        </Badge>
                      ) : status === 'pending' ? (
                        <Badge variant="secondary" size="sm">
                          Sent you a request
                        </Badge>
                      ) : (
                        <Button
                          size="sm"
                          onClick={() => handleSendRequest(user._id)}
                          loading={sendingTo === user._id}
                          disabled={sendingTo !== null}
                        >
                          <UserPlusIcon className="h-4 w-4 mr-1" />
                          Add
                        </Button>
                      )
                    }
                  />
                );
              })}
            </div>
          ) : searchQuery.length >= 2 ? (
            <div className="text-center py-8">
              <MagnifyingGlassIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No users found matching &quot;{searchQuery}&quot;</p>
            </div>
          ) : (
            <div className="text-center py-8">
              <UserPlusIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">
                Start typing to search for users
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AddFriendModal;
