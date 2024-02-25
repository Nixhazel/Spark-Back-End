import express from 'express';
import { addproducts, editproducts, getOneProduct } from '../controller/admin';
import { authenticate } from '../middleware/auth';
const router = express.Router();

/* GET home page. */
router.post("/upload", authenticate, addproducts);
router.put("/edit/:prodId", authenticate, editproducts);
router.get("/getOneProd/:prodId", authenticate, getOneProduct);

export default router;
