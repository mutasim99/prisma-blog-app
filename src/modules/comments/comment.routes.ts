import { Router } from 'express'
import { commentController } from './comment.controller';
import auth, { UserRole } from '../../middleware/auth.middleware';

const router = Router();

/* Get comment by authorId*/
router.get("/author/:authorId", commentController.getCommentByAuthorId);
/* Get a single comment by commentId */
router.get("/:commentId", commentController.getCommentById);

/* Create comments */
router.post('/', auth(UserRole.USER, UserRole.ADMIN), commentController.createComment);

/* Update comment data */
router.patch('/:commentId', auth(UserRole.USER, UserRole.ADMIN), commentController.updateComment);
/* Update comment status */
router.patch('/:commentId/moderate', auth(UserRole.ADMIN), commentController.moderateComment);

/* Delete Comment */
router.delete('/:commentId', auth(UserRole.USER, UserRole.ADMIN), commentController.deleteComment);

export const commentRouter = router; 