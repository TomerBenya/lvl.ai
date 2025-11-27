'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { FriendsAPI } from '@/lib/api';
import { UserAPI } from '@/lib/api/users';
import type { User } from '@/lib/types';

interface UseFriendsReturn {
  // Data
  friends: User[];
  pendingRequests: User[];
  sentRequests: User[];
  blockedUsers: User[];

  // Loading states
  loading: boolean;
  friendsLoading: boolean;
  pendingLoading: boolean;
  sentLoading: boolean;
  blockedLoading: boolean;

  // Error state
  error: string | null;

  // Actions
  refetch: () => Promise<void>;
  refetchFriends: () => Promise<void>;
  refetchPending: () => Promise<void>;
  refetchSent: () => Promise<void>;
  refetchBlocked: () => Promise<void>;

  // Friend actions
  sendFriendRequest: (userId: string) => Promise<void>;
  acceptRequest: (userId: string) => Promise<void>;
  declineRequest: (userId: string) => Promise<void>;
  removeFriend: (userId: string) => Promise<void>;
  blockUser: (userId: string) => Promise<void>;
  unblockUser: (userId: string) => Promise<void>;

  // Search
  searchUsers: (query: string) => Promise<User[]>;
}

export function useFriends(): UseFriendsReturn {
  const { user } = useAuth();

  // Data state
  const [friends, setFriends] = useState<User[]>([]);
  const [pendingRequests, setPendingRequests] = useState<User[]>([]);
  const [sentRequests, setSentRequests] = useState<User[]>([]);
  const [blockedUsers, setBlockedUsers] = useState<User[]>([]);

  // Loading states
  const [friendsLoading, setFriendsLoading] = useState(true);
  const [pendingLoading, setPendingLoading] = useState(true);
  const [sentLoading, setSentLoading] = useState(true);
  const [blockedLoading, setBlockedLoading] = useState(true);

  // Error state
  const [error, setError] = useState<string | null>(null);

  // Fetch friends
  const refetchFriends = useCallback(async () => {
    if (!user) return;
    try {
      setFriendsLoading(true);
      const data = await FriendsAPI.getFriends();
      setFriends(data);
    } catch (err) {
      console.error('Error fetching friends:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch friends');
    } finally {
      setFriendsLoading(false);
    }
  }, [user]);

  // Fetch pending requests
  const refetchPending = useCallback(async () => {
    if (!user) return;
    try {
      setPendingLoading(true);
      const data = await FriendsAPI.getPendingRequests();
      setPendingRequests(data);
    } catch (err) {
      console.error('Error fetching pending requests:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch pending requests');
    } finally {
      setPendingLoading(false);
    }
  }, [user]);

  // Fetch sent requests
  const refetchSent = useCallback(async () => {
    if (!user) return;
    try {
      setSentLoading(true);
      const data = await FriendsAPI.getSentRequests();
      setSentRequests(data);
    } catch (err) {
      console.error('Error fetching sent requests:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch sent requests');
    } finally {
      setSentLoading(false);
    }
  }, [user]);

  // Fetch blocked users
  const refetchBlocked = useCallback(async () => {
    if (!user) return;
    try {
      setBlockedLoading(true);
      const data = await FriendsAPI.getBlockedUsers();
      setBlockedUsers(data);
    } catch (err) {
      console.error('Error fetching blocked users:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch blocked users');
    } finally {
      setBlockedLoading(false);
    }
  }, [user]);

  // Refetch all data
  const refetch = useCallback(async () => {
    setError(null);
    await Promise.all([
      refetchFriends(),
      refetchPending(),
      refetchSent(),
      refetchBlocked()
    ]);
  }, [refetchFriends, refetchPending, refetchSent, refetchBlocked]);

  // Initial fetch
  useEffect(() => {
    if (user) {
      refetch();
    }
  }, [user, refetch]);

  // Send friend request
  const sendFriendRequest = useCallback(async (userId: string) => {
    try {
      await FriendsAPI.sendFriendRequest(userId);
      await refetchSent();
    } catch (err) {
      console.error('Error sending friend request:', err);
      throw err;
    }
  }, [refetchSent]);

  // Accept friend request
  const acceptRequest = useCallback(async (userId: string) => {
    try {
      await FriendsAPI.acceptFriendRequest(userId);
      await Promise.all([refetchFriends(), refetchPending()]);
    } catch (err) {
      console.error('Error accepting friend request:', err);
      throw err;
    }
  }, [refetchFriends, refetchPending]);

  // Decline friend request
  const declineRequest = useCallback(async (userId: string) => {
    try {
      await FriendsAPI.declineFriendRequest(userId);
      await refetchPending();
    } catch (err) {
      console.error('Error declining friend request:', err);
      throw err;
    }
  }, [refetchPending]);

  // Remove friend
  const removeFriend = useCallback(async (userId: string) => {
    try {
      await FriendsAPI.removeFriend(userId);
      await refetchFriends();
    } catch (err) {
      console.error('Error removing friend:', err);
      throw err;
    }
  }, [refetchFriends]);

  // Block user
  const blockUser = useCallback(async (userId: string) => {
    try {
      await FriendsAPI.blockUser(userId);
      await Promise.all([refetchFriends(), refetchBlocked(), refetchPending(), refetchSent()]);
    } catch (err) {
      console.error('Error blocking user:', err);
      throw err;
    }
  }, [refetchFriends, refetchBlocked, refetchPending, refetchSent]);

  // Unblock user
  const unblockUser = useCallback(async (userId: string) => {
    try {
      await FriendsAPI.unblockUser(userId);
      await refetchBlocked();
    } catch (err) {
      console.error('Error unblocking user:', err);
      throw err;
    }
  }, [refetchBlocked]);

  // Search users
  const searchUsers = useCallback(async (query: string): Promise<User[]> => {
    if (!query || query.length < 2) {
      return [];
    }
    try {
      return await UserAPI.searchUsers(query);
    } catch (err) {
      console.error('Error searching users:', err);
      throw err;
    }
  }, []);

  // Combined loading state
  const loading = friendsLoading || pendingLoading || sentLoading || blockedLoading;

  return {
    // Data
    friends,
    pendingRequests,
    sentRequests,
    blockedUsers,

    // Loading states
    loading,
    friendsLoading,
    pendingLoading,
    sentLoading,
    blockedLoading,

    // Error
    error,

    // Refetch methods
    refetch,
    refetchFriends,
    refetchPending,
    refetchSent,
    refetchBlocked,

    // Actions
    sendFriendRequest,
    acceptRequest,
    declineRequest,
    removeFriend,
    blockUser,
    unblockUser,
    searchUsers
  };
}

export default useFriends;
