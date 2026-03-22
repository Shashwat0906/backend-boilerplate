import { Router, Request, Response } from 'express';
import mongoose from 'mongoose';
import config from '~/config/config';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Health
 *   description: Health check endpoint
 * 
 * /api/v1/health:
 *   get:
 *     summary: Verify health
 *     description: Verify the health of the API and its connection to the database.
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: ok
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                 uptime:
 *                   type: number
 *                 database:
 *                   type: object
 *                   properties:
 *                     state:
 *                       type: number
 *                     healthy:
 *                       type: boolean
 *       503:
 *         description: Service Unavailable (Database is down)
 */
router.get('/', (req: Request, res: Response) => {
	const dbState = mongoose.connection.readyState;
	const dbHealthy = dbState === 1;
	const status = dbHealthy ? 200 : 503;

	if (config.NODE_ENV === 'production') {
		return res.status(status).json({
			status: dbHealthy ? 'ok' : 'degraded',
			timestamp: new Date().toISOString()
		});
	}

	res.status(status).json({
		status: dbHealthy ? 'ok' : 'degraded',
		timestamp: new Date().toISOString(),
		uptime: process.uptime(),
		database: {
			state: dbState,
			healthy: dbHealthy
		}
	});
});

export default router;
