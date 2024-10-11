import { Router } from "express";
import { 
    createUserController,
    loginUserController, 
    logoutUserController,
    restorePasswordController,
    githubLoginController,
    githubLoginCallbackController, 
    currentUserController
} from "../controllers/users.controller.js";

const router = Router();

router.post('/register', createUserController);
router.post('/login', loginUserController);
router.post('/logout', logoutUserController);
router.post('/restore-password', restorePasswordController);
router.get('/github', githubLoginController);
router.get('/github/callback', githubLoginCallbackController);
router.get('/current', currentUserController);

export default router;
