// @flow

import express from 'express';
import { VideoController } from './controllers';

const router = express.Router();

router.post('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});
router.get('/api/recent', VideoController.getRecent);
router.get('/api/most-viewed', VideoController.getMostViewed);
router.get('/api/short', VideoController.getShort);
router.get('/api/videos/:techTalkVideoId', VideoController.getVideo);

export default router;
