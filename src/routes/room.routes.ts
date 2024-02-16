import { Router } from "express";
import authMiddleware from "../middlewares/auth.middlewsre";
import roomController from "../controllers/room.controller";

// express router instance declaration.
const router = Router();

router.route('/create-room').post(authMiddleware, roomController.createRoom);

router.route('/get-rooms').get(authMiddleware, roomController.getAllRooms);

router.route('/get-room/:id').get(authMiddleware, roomController.getRoom);

router.route('/join-room').post(authMiddleware, roomController.joinRoom);

router.route('/leave-room').post(authMiddleware, roomController.leaveRoom);

router.route('/delete-room/:id').delete(authMiddleware, roomController.deleteRoom);

export default router;