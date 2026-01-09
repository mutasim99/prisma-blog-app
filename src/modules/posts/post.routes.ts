import express, { Router } from 'express'
import { postController } from './post.controller';
import auth, { UserRole } from '../../middleware/auth.middleware';

const router = express.Router();

/* Get all post */
router.get('/', postController.getAllPost);
/* Get my post */
router.get('/my-posts', auth(UserRole.ADMIN, UserRole.USER),postController.getMyPost);
/* Get post by Id */
router.get('/:id', postController.getPostById);
/* Update my post */
router.patch('/my-posts/:postId', auth(UserRole.ADMIN, UserRole.USER), postController.updateMyPost);
/* Create post */
router.post('/', auth(UserRole.USER, UserRole.ADMIN), postController.createPost);

export const postRouter: Router = router