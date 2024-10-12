import { Router } from "express";
import { getCurrentUserController } from "../controllers/users.controller.js";

const router = Router();

router.get('/', getCurrentUserController);

export default router;