import { Router } from "express";
import mediaController from "../controllers/media.controller";

// express router instance declaration.
const router = Router();

router.route('/get-media/:filename').get(mediaController.getMedia);

export default router;