import { Router } from 'express';
import { postController } from '../controllers/postController';

export const postRouter = Router();

// Routes
postRouter.get('/', postController.getFeed);
postRouter.post('/', postController.createPost);
postRouter.post('/:postId/like', postController.toggleLike);
postRouter.delete('/:postId', postController.deletePost);
