import userModel from "../models/users.model.js";
import { 
    createUserService,
    loginUserService,
    logoutUserService, 
    restorePasswordService, 
    githubLoginService,
    githubLoginCallbackService,
    currentUserService,
    getCurrentUserService
} from "../services/users.service.js";

export const createUserController = async (req, res, next) => {
    try {
        createUserService(req, res, next);
    } catch (error) {
        console.error('Error al registrar el usuario:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
}

export const loginUserController = async (req, res, next) => {
    try {
        loginUserService(req, res, next);
    } catch (error) {
        console.error('Error al iniciar sesión:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
}

export const logoutUserController = async (req, res) => {
    try {
        logoutUserService(req, res);
    } catch (error) {
        console.error('Error al cerrar sesión:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
}

export const restorePasswordController = async (req, res) => {
    try {
        restorePasswordService(req, res);
    } catch (error) {
        console.error('Error al restaurar la contraseña:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
}

export const githubLoginController = async (req, res, next) => {
    try {
        githubLoginService(req, res, next);
    } catch (error) {
        console.error('Error al iniciar sesión con GitHub:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
}

export const githubLoginCallbackController = async (req, res, next) => {
    try {
        githubLoginCallbackService(req, res, next);
    } catch (error) {
        console.error('Error al iniciar sesión con GitHub:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
}

export const currentUserController = async (req, res) => {
    try {
        currentUserService(req, res);
    } catch (error) {
        console.error('Error al obtener el usuario actual:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
}

export const getCurrentUserController = async (req, res) => {
    try {
        const user = await getCurrentUserService(req.user._id);
        res.render('currentUser', { user: user, title: 'Perfil de usuario' });
    } catch (error) {
        console.error('Error al obtener el usuario actual:', error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
};
