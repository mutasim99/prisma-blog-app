import express, { Router } from 'express'
import { postController } from './post.controller';
import auth, { UserRole } from '../../middleware/auth.middleware';

const router = express.Router();

/* Get my post */
router.get('/my-posts', auth(UserRole.ADMIN, UserRole.USER),postController.getMyPost);
/* Get al post */
router.get('/', postController.getAllPost);
/* Get post by Id */
router.get('/:id', postController.getPostById);
/* Create post */
router.post('/', auth(UserRole.USER, UserRole.ADMIN), postController.createPost);

export const postRouter: Router = router