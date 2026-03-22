import { Router } from 'express';
import catchAsync from '~/utils/catchAsync';
import imageController from '~/controllers/imageController';
import uploadImage from '~/middlewares/uploadImage';
import authenticate from '~/middlewares/authenticate';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Images
 *   description: Image upload
 */

/**
 * @swagger
 * /api/v1/images/upload:
 *   post:
 *     summary: Upload an image
 *     description: Upload an image file.
 *     tags: [Images]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       "200":
 *         description: OK
 *       "401":
 *         description: Unauthorized
 *       "403":
 *         description: Forbidden
 */

router.post('/upload', authenticate('image:create'), uploadImage, catchAsync(imageController.uploadImage));

export default router;
