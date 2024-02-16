import { Router } from "express";
import multer from "multer";
import authController from "../controllers/auth.controller";
import authMiddleware from "../middlewares/auth.middlewsre";

// express router instance declaration.
const router = Router();
const upload = multer();

router.route('/send-otp').post(authController.sentOtp);

router.route('/verify-otp').post(authController.verifyOtp);

router.route('/activate-account').patch(authMiddleware, upload.single('profile'), authController.activateAccount);

router.route('/refresh-token').post(authController.refreshToken);

router.route('/logout').post(authMiddleware, authController.logout);

export default router;