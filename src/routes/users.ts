import express from 'express';
import { authenticate } from '../middleware/auth';
var router = express.Router();

/* GET users listing. */
router.get('/',  function(req, res, next) {
  res.send('respond with a resource');
});

// router.post("/signup", register);
// router.post("/login", loginController);

export default router;
