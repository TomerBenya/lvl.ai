import { Router, Request, Response, NextFunction } from 'express';
import { query } from 'express-validator';
import User from '@/models/User';
import authenticate from '../middleware/auth';

const router = Router();

// @route   GET /api/leaderboard
// @desc    Get top users leaderboard ranked by XP
// @access  Private
router.get('/', authenticate, [
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100')
], async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const limit = Number(req.query['limit']) || 20;
    const currentUserId = (req as any).user['id'];

    // Get top users sorted by XP descending
    const topUsers = await User.find()
      .select('name avatar level xp totalTasksCompleted')
      .sort({ xp: -1, level: -1 })
      .limit(limit);

    // Calculate current user's rank (count users with more XP)
    const currentUser = await User.findById(currentUserId).select('xp');
    const currentUserXp = currentUser?.xp || 0;

    const usersWithMoreXp = await User.countDocuments({
      xp: { $gt: currentUserXp }
    });
    const currentUserRank = usersWithMoreXp + 1;

    // Get total user count
    const totalUsers = await User.countDocuments();

    // Build leaderboard entries with rank
    const leaderboard = topUsers.map((user, index) => ({
      rank: index + 1,
      user: {
        _id: (user._id as any).toString(),
        name: user.name,
        avatar: user.avatar
      },
      level: user.level,
      xp: user.xp,
      totalTasksCompleted: user.totalTasksCompleted,
      isCurrentUser: (user._id as any).toString() === currentUserId
    }));

    res.status(200).json({
      success: true,
      data: {
        leaderboard,
        currentUserRank,
        totalUsers
      }
    });
  } catch (error) {
    next(error);
  }
});

export default router;
