'use client';

import React, { useState, useEffect } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import ClientGuard from '@/components/ClientGuard';
import { useAuth } from '@/contexts/AuthContext';
import { apiClient } from '@/lib/api/client';
import {
  TrophyIcon,
  UserCircleIcon,
  SparklesIcon,
  CheckBadgeIcon
} from '@heroicons/react/24/outline';

interface LeaderboardEntry {
  rank: number;
  user: { _id: string; name: string; avatar?: string };
  level: number;
  xp: number;
  totalTasksCompleted: number;
  isCurrentUser: boolean;
}

export default function LeaderboardPage() {
  const { user } = useAuth();
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [currentUserRank, setCurrentUserRank] = useState<number>(0);
  const [totalUsers, setTotalUsers] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setLoading(true);
        const data = await apiClient.getLeaderboard(20);
        setLeaderboard(data.leaderboard);
        setCurrentUserRank(data.currentUserRank);
        setTotalUsers(data.totalUsers);
      } catch (err) {
        setError('Failed to load leaderboard');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  const getRankBadge = (rank: number) => {
    switch (rank) {
      case 1:
        return (
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-yellow-500 text-white font-bold">
            1
          </div>
        );
      case 2:
        return (
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-400 text-white font-bold">
            2
          </div>
        );
      case 3:
        return (
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-amber-700 text-white font-bold">
            3
          </div>
        );
      default:
        return (
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-secondary text-foreground font-medium">
            {rank}
          </div>
        );
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <ClientGuard>
      <Sidebar>
        <div className="space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
              <TrophyIcon className="h-8 w-8 text-yellow-500" />
              Leaderboard
            </h1>
            <p className="text-muted-foreground">
              See how you rank against other players
            </p>
          </div>

          {/* Current User Rank Card */}
          <Card className="border-primary/50 bg-primary/5">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary text-primary-foreground text-2xl font-bold">
                    #{currentUserRank}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-foreground">Your Rank</h2>
                    <p className="text-muted-foreground">
                      {user?.name || 'You'} - Level {user?.level || 1}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-primary">{user?.xp || 0} XP</p>
                  <p className="text-sm text-muted-foreground">
                    Top {totalUsers > 0 ? Math.round((currentUserRank / totalUsers) * 100) : 0}% of players
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Leaderboard Table */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <SparklesIcon className="h-5 w-5" />
                Top 20 Players
              </CardTitle>
              <CardDescription>Ranked by total XP earned</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : error ? (
                <div className="text-center py-12 text-error">{error}</div>
              ) : leaderboard.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  No users yet. Be the first to earn XP!
                </div>
              ) : (
                <div className="space-y-2">
                  {/* Table Header */}
                  <div className="grid grid-cols-12 gap-4 px-4 py-2 text-sm font-medium text-muted-foreground border-b">
                    <div className="col-span-1">Rank</div>
                    <div className="col-span-5">Player</div>
                    <div className="col-span-2 text-center">Level</div>
                    <div className="col-span-2 text-center">XP</div>
                    <div className="col-span-2 text-center">Tasks</div>
                  </div>

                  {/* Table Rows */}
                  {leaderboard.map((entry) => (
                    <div
                      key={entry.user._id}
                      className={`grid grid-cols-12 gap-4 px-4 py-3 rounded-lg items-center transition-colors ${
                        entry.isCurrentUser
                          ? 'bg-primary/10 border border-primary/30'
                          : 'hover:bg-secondary/50'
                      }`}
                    >
                      {/* Rank */}
                      <div className="col-span-1">
                        {getRankBadge(entry.rank)}
                      </div>

                      {/* Player Info */}
                      <div className="col-span-5 flex items-center gap-3">
                        {entry.user.avatar ? (
                          <img
                            src={entry.user.avatar}
                            alt={entry.user.name}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-foreground font-medium">
                            {getInitials(entry.user.name)}
                          </div>
                        )}
                        <div>
                          <p className="font-medium text-foreground flex items-center gap-2">
                            {entry.user.name}
                            {entry.isCurrentUser && (
                              <Badge variant="default" size="sm">You</Badge>
                            )}
                          </p>
                        </div>
                      </div>

                      {/* Level */}
                      <div className="col-span-2 text-center">
                        <Badge variant="secondary" size="sm">
                          Lvl {entry.level}
                        </Badge>
                      </div>

                      {/* XP */}
                      <div className="col-span-2 text-center">
                        <span className="font-bold text-primary">{entry.xp.toLocaleString()}</span>
                      </div>

                      {/* Tasks Completed */}
                      <div className="col-span-2 text-center flex items-center justify-center gap-1">
                        <CheckBadgeIcon className="h-4 w-4 text-success" />
                        <span>{entry.totalTasksCompleted}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Stats Summary */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            <Card>
              <CardContent className="p-6 text-center">
                <UserCircleIcon className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                <p className="text-2xl font-bold text-foreground">{totalUsers}</p>
                <p className="text-sm text-muted-foreground">Total Players</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <TrophyIcon className="h-8 w-8 mx-auto text-yellow-500 mb-2" />
                <p className="text-2xl font-bold text-foreground">#{currentUserRank}</p>
                <p className="text-sm text-muted-foreground">Your Rank</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <SparklesIcon className="h-8 w-8 mx-auto text-primary mb-2" />
                <p className="text-2xl font-bold text-foreground">{user?.xp || 0}</p>
                <p className="text-sm text-muted-foreground">Your XP</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </Sidebar>
    </ClientGuard>
  );
}
