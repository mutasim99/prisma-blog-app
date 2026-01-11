import express, { Router } from 'express'
import { postController } from './post.controller';
import auth, { UserRole } from '../../middleware/auth.middleware';

const router = express.Router();

/* Get all post */
router.get('/', postController.getAllPost);
/* Get my post */
router.get('/my-posts', auth(UserRole.ADMIN, UserRole.USER),postController.getMyPost);
/* Get stats */
router.get('/stats', auth(UserRole.ADMIN),postController.getStats);
/* Get post by Id */
router.get('/:id', postController.getPostById);
/* Update my post */
router.patch('/my-posts/:postId', auth(UserRole.ADMIN, UserRole.USER), postController.updateMyPost);
/* Create post */
router.post('/', auth(UserRole.USER, UserRole.ADMIN), postController.createPost);
/* delete post */
router.delete('/:postId', auth(UserRole.USER, UserRole.ADMIN), postController.deletePost);

export const postRouter: Router = router