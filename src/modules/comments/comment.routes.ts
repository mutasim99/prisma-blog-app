import { Router } from 'express'
import { commentController } from './comment.controller';
import auth, { UserRole } from '../../middleware/auth.middleware';

const router = Router();

/* Get route */
router.get("/author/:authorId", commentController.getCommentByAuthorId);
router.get("/:commentId", commentController.getCommentById);

/* Post route */
router.post('/', auth(UserRole.USER, UserRole.ADMIN), commentController.createComment);

/* Update Route */
router.patch('/:commentId', auth(UserRole.USER, UserRole.ADMIN), commentController.updateComment);
router.patch('/:commentId/moderate', auth(UserRole.ADMIN), commentController.moderateComment);

/* Delete Route */
router.delete('/:commentId', auth(UserRole.USER, UserRole.ADMIN), commentController.deleteComment);

export const commentRouter = router; 