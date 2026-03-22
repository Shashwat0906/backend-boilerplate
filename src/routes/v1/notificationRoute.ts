import { Router } from 'express';
import catchAsync from '~/utils/catchAsync';
import validate from '~/middlewares/validate';
import authenticate from '~/middlewares/authenticate';
import notificationValidation from '~/validations/notificationValidation';
import notificationController from '~/controllers/notificationController';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Notifications
 *   description: User notifications
 */

/**
 * @swagger
 * /api/v1/notifications:
 *   get:
 *     summary: Get notifications
 *     description: Retrieve notifications for the logged in user.
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *         description: sort by query in the form of field:desc/asc (ex. createdAt:desc)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *         default: 10
 *         description: Maximum number of notifications
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number
 *     responses:
 *       "200":
 *         description: OK
 *       "401":
 *         description: Unauthorized
 * 
 * /api/v1/notifications/read-all:
 *   patch:
 *     summary: Mark all as read
 *     description: Mark all notifications for the user as read.
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       "200":
 *         description: OK
 *       "401":
 *         description: Unauthorized
 * 
 * /api/v1/notifications/{notificationId}/read:
 *   patch:
 *     summary: Mark one as read
 *     description: Mark a specific notification as read.
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: notificationId
 *         required: true
 *         schema:
 *           type: string
 *         description: Notification id
 *     responses:
 *       "200":
 *         description: OK
 *       "401":
 *         description: Unauthorized
 *       "404":
 *         description: Not Found
 */

router.use(authenticate());

router.get(
	'/',
	validate(notificationValidation.getNotifications),
	catchAsync(notificationController.getNotifications)
);
router.patch('/read-all', catchAsync(notificationController.markAllAsRead));
router.patch(
	'/:notificationId/read',
	validate(notificationValidation.markAsRead),
	catchAsync(notificationController.markAsRead)
);

export default router;
