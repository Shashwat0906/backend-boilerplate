import { Router, Request, Response } from 'express';
import passport from 'passport';
import catchAsync from '~/utils/catchAsync';
import validate from '~/middlewares/validate';
import authenticate from '~/middlewares/authenticate';
import authRateLimiter from '~/middlewares/authRateLimiter';
import authValidation from '~/validations/authValidation';
import authController from '~/controllers/authController';
import config from '~/config/config';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication
 */

/**
 * @swagger
 * /api/v1/auth/signup:
 *   post:
 *     summary: Register as user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *                 description: must be unique
 *               password:
 *                 type: string
 *                 format: password
 *                 minLength: 8
 *                 description: At least one number and one letter
 *             example:
 *               name: fake name
 *               email: fake@example.com
 *               password: password1
 *     responses:
 *       "201":
 *         description: Created
 *       "400":
 *         description: Bad Request
 *
 * /api/v1/auth/signin:
 *   post:
 *     summary: Login
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *             example:
 *               email: fake@example.com
 *               password: password1
 *     responses:
 *       "200":
 *         description: OK
 *       "401":
 *         description: Incorrect email or password
 * 
 * /api/v1/auth/signout:
 *   post:
 *     summary: Logout
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refreshToken
 *             properties:
 *               refreshToken:
 *                 type: string
 *     responses:
 *       "204":
 *         description: No content
 *       "404":
 *         description: Not found
 * 
 * /api/v1/auth/refresh-tokens:
 *   post:
 *     summary: Refresh auth tokens
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refreshToken
 *             properties:
 *               refreshToken:
 *                 type: string
 *     responses:
 *       "200":
 *         description: OK
 *       "401":
 *         description: Unauthorized
 */

router.use(authRateLimiter);

router.get(
	'/google',
	(req: Request, res: Response, next: () => void) => {
		if (!config.GOOGLE_CLIENT_ID || !config.GOOGLE_CLIENT_SECRET) {
			res.status(501).json({ success: false, message: 'Google sign-in is not configured' });
			return;
		}
		next();
	},
	passport.authenticate('google', { scope: ['profile', 'email'] })
);
router.get('/google/callback', passport.authenticate('google', { session: false }), catchAsync(authController.googleCallback));

router.post('/signup', validate(authValidation.signup), catchAsync(authController.signup));
router.post('/signin', validate(authValidation.signin), catchAsync(authController.signin));
router.get('/current', authenticate(), catchAsync(authController.current));
router.get('/me', authenticate(), catchAsync(authController.getMe));
router.put('/me', authenticate(), validate(authValidation.updateMe), catchAsync(authController.updateMe));
router.post('/signout', validate(authValidation.signout), catchAsync(authController.signout));
router.post('/refresh-tokens', validate(authValidation.refreshTokens), catchAsync(authController.refreshTokens));
router.post('/send-verification-email', authenticate(), catchAsync(authController.sendVerificationEmail));
router.post('/verify-email', validate(authValidation.verifyEmail), catchAsync(authController.verifyEmail));
router.post('/forgot-password', validate(authValidation.forgotPassword), catchAsync(authController.forgotPassword));
router.post('/reset-password', validate(authValidation.resetPassword), catchAsync(authController.resetPassword));

export default router;
