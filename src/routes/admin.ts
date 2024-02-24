import express from 'express';
import { addproducts, editproducts } from '../controller/admin';
const router = express.Router();

/* GET home page. */
router.post("/upload", addproducts);
router.post("/edit", editproducts);
// router.post("/contactUs", contactUsController);

export default router;
