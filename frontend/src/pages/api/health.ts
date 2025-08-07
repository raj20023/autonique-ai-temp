import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // Simple health check endpoint
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'autonique-frontend',
    version: '1.0.0'
  });
}
