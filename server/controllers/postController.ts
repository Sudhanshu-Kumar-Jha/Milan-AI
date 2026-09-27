import { Request, Response } from 'express';
import { Post } from '../models/Post';
import { Profile } from '../models/Profile';

export const postController = {
  // GET /api/posts - Fully paginated feed with batch author enrichment
  async getFeed(req: Request, res: Response) {
    try {
      const page = Math.max(1, parseInt(req.query.page as string) || 1);
      const limit = Math.min(50, Math.max(1, parseInt(req.query.limit as string) || 20));

      const [total, posts] = await Promise.all([
        Post.countDocuments(),
        Post.find()
          .sort({ createdAt: -1 })
          .skip((page - 1) * limit)
          .limit(limit)
          .lean(),
      ]);

      // Batch enrich all post authors in a single query
      const userIds = [...new Set(posts.map((p: any) => p.userId))];
      const authors = await Profile.find({ id: { $in: userIds } })
        .select('id displayName avatarUrl city verificationStatus')
        .lean();

      const authorMap = new Map(authors.map((a: any) => [a.id, a]));

      const enrichedPosts = posts.map((post: any) => {
        const author = authorMap.get(post.userId);
        return {
          ...post,
          author: author
            ? {
                id: author.id,
                displayName: author.displayName,
                avatarUrl: author.avatarUrl,
                city: author.city,
                verificationStatus: author.verificationStatus,
              }
            : {
                id: post.userId,
                displayName: 'Milan AI User',
                avatarUrl: '/avatars/user_me.jpg',
                city: '',
                verificationStatus: 'pending',
              },
        };
      });

      const totalPages = Math.ceil(total / limit);
      const meta = {
        page,
        limit,
        total,
        totalPages,
        hasMore: page * limit < total,
      };

      res.json({
        success: true,
        data: enrichedPosts,
        meta,
        timestamp: new Date().toISOString(),
      });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  // POST /api/posts - Create a new photo post
  async createPost(req: Request, res: Response) {
    try {
      const { imageUrl, caption } = req.body;

      if (!imageUrl) {
        return res.status(400).json({
          success: false,
          message: 'A photo is required to create a post.',
        });
      }

      const postId = `post_${Date.now()}`;
      const post = await Post.create({
        id: postId,
        userId: 'usr_me_01',
        imageUrl,
        caption: caption || '',
        likes: [],
      });

      res.json({
        success: true,
        data: post,
        message: 'Photo posted successfully!',
        timestamp: new Date().toISOString(),
      });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  // POST /api/posts/:postId/like - Toggle like on a post
  async toggleLike(req: Request, res: Response) {
    try {
      const { postId } = req.params;
      const userId = 'usr_me_01';

      const post = await Post.findOne({ id: postId });
      if (!post) {
        return res.status(404).json({ success: false, message: 'Post not found' });
      }

      const hasLiked = post.likes.includes(userId);
      if (hasLiked) {
        post.likes = post.likes.filter((id: string) => id !== userId);
      } else {
        post.likes.push(userId);
      }
      await post.save();

      res.json({
        success: true,
        data: { liked: !hasLiked, totalLikes: post.likes.length },
        message: hasLiked ? 'Like removed' : 'Post liked!',
        timestamp: new Date().toISOString(),
      });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  // DELETE /api/posts/:postId - Delete own post
  async deletePost(req: Request, res: Response) {
    try {
      const { postId } = req.params;
      await Post.findOneAndDelete({ id: postId, userId: 'usr_me_01' });

      res.json({
        success: true,
        message: 'Post deleted successfully',
        timestamp: new Date().toISOString(),
      });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
};
