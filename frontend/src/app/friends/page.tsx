'use client';

import React, { useState } from 'react';
import * as Tabs from '@radix-ui/react-tabs';
import { Sidebar } from '@/components/layout/Sidebar';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import ClientGuard from '@/components/ClientGuard';
import { useFriends } from '@/hooks/useFriends';
import {
  FriendsList,
  FriendRequestsList,
  SentRequestsList,
  BlockedUsersList,
  AddFriendModal,
  FriendsLeaderboard
} from '@/components/friends';
import {
  UserGroupIcon,
  UserPlusIcon,
  InboxIcon,
  PaperAirplaneIcon,
  NoSymbolIcon,
  ExclamationCircleIcon
} from '@heroicons/react/24/outline';

export default function FriendsPage() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const {
    friends,
    pendingRequests,
    sentRequests,
    blockedUsers,
    friendsLoading,
    pendingLoading,
    sentLoading,
    blockedLoading,
    error,
    refetch,
    sendFriendRequest,
    acceptRequest,
    declineRequest,
    removeFriend,
    blockUser,
    unblockUser,
    searchUsers
  } = useFriends();

  return (
    <ClientGuard>
      <Sidebar>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
                <UserGroupIcon className="h-8 w-8 text-primary" />
                Friends
              </h1>
              <p className="text-muted-foreground">
                Manage your friends and connect with other users
              </p>
            </div>
            <Button onClick={() => setIsAddModalOpen(true)} className="flex items-center gap-2">
              <UserPlusIcon className="h-4 w-4" />
              Add Friend
            </Button>
          </div>

          {/* Error Message */}
          {error && (
            <Card className="border-destructive">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <ExclamationCircleIcon className="h-5 w-5 text-destructive flex-shrink-0" />
                  <div className="flex-1">
                    <h3 className="text-sm font-medium text-destructive">Error loading data</h3>
                    <p className="text-sm text-destructive/80 mt-1">{error}</p>
                    <Button variant="outline" size="sm" className="mt-3" onClick={refetch}>
                      Try Again
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Friends Leaderboard */}
          <FriendsLeaderboard friends={friends} loading={friendsLoading} />

          {/* Tabs */}
          <Tabs.Root defaultValue="friends" className="w-full">
            <Tabs.List className="flex border-b mb-6">
              <Tabs.Trigger
                value="friends"
                className="flex items-center gap-2 px-4 py-3 text-sm font-medium text-muted-foreground border-b-2 border-transparent hover:text-foreground transition-colors data-[state=active]:text-primary data-[state=active]:border-primary"
              >
                <UserGroupIcon className="h-4 w-4" />
                Friends
                {friends.length > 0 && (
                  <Badge variant="secondary" size="sm">
                    {friends.length}
                  </Badge>
                )}
              </Tabs.Trigger>

              <Tabs.Trigger
                value="requests"
                className="flex items-center gap-2 px-4 py-3 text-sm font-medium text-muted-foreground border-b-2 border-transparent hover:text-foreground transition-colors data-[state=active]:text-primary data-[state=active]:border-primary"
              >
                <InboxIcon className="h-4 w-4" />
                Requests
                {pendingRequests.length > 0 && (
                  <Badge variant="warning" size="sm">
                    {pendingRequests.length}
                  </Badge>
                )}
              </Tabs.Trigger>

              <Tabs.Trigger
                value="sent"
                className="flex items-center gap-2 px-4 py-3 text-sm font-medium text-muted-foreground border-b-2 border-transparent hover:text-foreground transition-colors data-[state=active]:text-primary data-[state=active]:border-primary"
              >
                <PaperAirplaneIcon className="h-4 w-4" />
                Sent
                {sentRequests.length > 0 && (
                  <Badge variant="secondary" size="sm">
                    {sentRequests.length}
                  </Badge>
                )}
              </Tabs.Trigger>

              <Tabs.Trigger
                value="blocked"
                className="flex items-center gap-2 px-4 py-3 text-sm font-medium text-muted-foreground border-b-2 border-transparent hover:text-foreground transition-colors data-[state=active]:text-primary data-[state=active]:border-primary"
              >
                <NoSymbolIcon className="h-4 w-4" />
                Blocked
                {blockedUsers.length > 0 && (
                  <Badge variant="error" size="sm">
                    {blockedUsers.length}
                  </Badge>
                )}
              </Tabs.Trigger>
            </Tabs.List>

            <Tabs.Content value="friends">
              <FriendsList
                friends={friends}
                loading={friendsLoading}
                onRemove={removeFriend}
                onBlock={blockUser}
              />
            </Tabs.Content>

            <Tabs.Content value="requests">
              <FriendRequestsList
                requests={pendingRequests}
                loading={pendingLoading}
                onAccept={acceptRequest}
                onDecline={declineRequest}
              />
            </Tabs.Content>

            <Tabs.Content value="sent">
              <SentRequestsList requests={sentRequests} loading={sentLoading} />
            </Tabs.Content>

            <Tabs.Content value="blocked">
              <BlockedUsersList
                users={blockedUsers}
                loading={blockedLoading}
                onUnblock={unblockUser}
              />
            </Tabs.Content>
          </Tabs.Root>
        </div>

        {/* Add Friend Modal */}
        <AddFriendModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onSendRequest={sendFriendRequest}
          searchUsers={searchUsers}
          friends={friends}
          sentRequests={sentRequests}
          pendingRequests={pendingRequests}
        />
      </Sidebar>
    </ClientGuard>
  );
}
