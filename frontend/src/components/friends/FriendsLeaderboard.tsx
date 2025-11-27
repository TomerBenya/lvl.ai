'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import type { User } from '@/lib/types';
import { TrophyIcon, SparklesIcon } from '@heroicons/react/24/outline';
import { useAuth } from '@/contexts/AuthContext';

interface FriendsLeaderboardProps {
  friends: User[];
  loading: boolean;
}

export function FriendsLeaderboard({ friends, loading }: FriendsLeaderboardProps) {
  const { user: currentUser } = useAuth();

  // Sort friends by XP (descending) and take top 5
  const sortedFriends = [...friends]
    .sort((a, b) => (b.xp || 0) - (a.xp || 0))
    .slice(0, 5);

  // Calculate current user's rank among friends
  const getCurrentUserRank = () => {
    if (!currentUser) return null;

    // Create a list including the current user
    const allUsers = [...friends, currentUser as User];
    const sorted = allUsers.sort((a, b) => (b.xp || 0) - (a.xp || 0));
    const rank = sorted.findIndex((u) => u._id === currentUser._id) + 1;
    return rank;
  };

  const currentUserRank = getCurrentUserRank();

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getRankBadge = (rank: number) => {
    switch (rank) {
      case 1:
        return (
          <div className="flex items-center justify-center w-6 h-6 rounded-full bg-yellow-500 text-white text-xs font-bold">
            1
          </div>
        );
      case 2:
        return (
          <div className="flex items-center justify-center w-6 h-6 rounded-full bg-gray-400 text-white text-xs font-bold">
            2
          </div>
        );
      case 3:
        return (
          <div className="flex items-center justify-center w-6 h-6 rounded-full bg-amber-700 text-white text-xs font-bold">
            3
          </div>
        );
      default:
        return (
          <div className="flex items-center justify-center w-6 h-6 rounded-full bg-secondary text-foreground text-xs font-medium">
            {rank}
          </div>
        );
    }
  };

  if (loading) {
    return (
      <Card className="animate-pulse">
        <CardHeader>
          <div className="h-6 w-40 bg-secondary rounded" />
          <div className="h-4 w-60 bg-secondary rounded mt-2" />
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-secondary" />
                <div className="w-8 h-8 rounded-full bg-secondary" />
                <div className="flex-1">
                  <div className="h-4 w-24 bg-secondary rounded" />
                </div>
                <div className="h-4 w-16 bg-secondary rounded" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (friends.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrophyIcon className="h-5 w-5 text-yellow-500" />
            Friends Leaderboard
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-4">
            Add friends to see how you rank against them!
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrophyIcon className="h-5 w-5 text-yellow-500" />
          Friends Leaderboard
        </CardTitle>
        <CardDescription className="flex items-center gap-2">
          <SparklesIcon className="h-4 w-4" />
          Your rank among friends: #{currentUserRank || '-'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {sortedFriends.map((friend, index) => (
            <div
              key={friend._id}
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-secondary/50 transition-colors"
            >
              {/* Rank */}
              {getRankBadge(index + 1)}

              {/* Avatar */}
              {friend.avatar ? (
                <img
                  src={friend.avatar}
                  alt={friend.name}
                  className="w-8 h-8 rounded-full object-cover"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-semibold">
                  {getInitials(friend.name)}
                </div>
              )}

              {/* Name and Level */}
              <div className="flex-1 min-w-0">
                <p className="font-medium text-foreground truncate">{friend.name}</p>
              </div>

              {/* Level Badge */}
              <Badge variant="secondary" size="sm">
                Lvl {friend.level || 1}
              </Badge>

              {/* XP */}
              <span className="font-bold text-primary text-sm">
                {(friend.xp || 0).toLocaleString()} XP
              </span>
            </div>
          ))}
        </div>

        {friends.length > 5 && (
          <p className="text-xs text-muted-foreground text-center mt-4">
            Showing top 5 of {friends.length} friends
          </p>
        )}
      </CardContent>
    </Card>
  );
}

export default FriendsLeaderboard;
