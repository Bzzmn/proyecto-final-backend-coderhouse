import passport from "passport";
import { generateToken, createHash } from "../utils/index.js";
import DAOFactory from "../data/DAOs/DAOFactory.js";
import { PERSISTENCE } from "../config/persistence.js";

const userRepository = DAOFactory.getRepository('USER', PERSISTENCE); 
const userDAO = DAOFactory.getRepository('USER', PERSISTENCE);

export const createUserService = async (req, res, next) => {
    passport.authenticate('register', { session: false }, (err, user, info) => {
        if (err) {
        return res.status(500).json({ message: 'Error interno del servidor' });
    }
    if (!user) {
        return res.status(400).json({ message: info.message });
    }
    const token = generateToken(user);
    res.cookie('jwt', token, { 
        httpOnly: true, 
        secure: process.env.NODE_ENV === 'production',
        maxAge: 24 * 60 * 60 * 1000 // 24 horas
    });
    res.status(201).json({ 
        status: 'success',
        message: 'Usuario registrado exitosamente',
        user: user 
    });
    })(req, res, next);
}

export const loginUserService = async (req, res, next) => {
    passport.authenticate('login', { session: false }, (err, user, info) => {
        if (err) {
            return res.status(500).json({ message: 'Error interno del servidor' });
        }
        if (!user) {
            return res.status(400).json({ message: info.message || 'Inicio de sesión fallido' });
        }
        const token = generateToken(user);
        res.cookie('jwt', token, { 
            httpOnly: true, 
            secure: process.env.NODE_ENV === 'production',
            maxAge: 24 * 60 * 60 * 1000 // 24 horas
        });
        res.json({ 
            status: 'success', 
            message: 'Inicio de sesión exitoso',
            user: user 
        });
    })(req, res, next);
}

export const logoutUserService = async (req, res) => {
    res.clearCookie('jwt');
    res.status(200).json({ message: 'Sesión cerrada exitosamente' });
}

export const restorePasswordService = async (req, res) => {
    const { email, new_password } = req.body;
    try {
        const user = await userDAO.findByEmail(email);
        if (!user) {
            return res.status(404).json({ status: 'error', message: 'Usuario no encontrado' });
        }
        const hashedPassword = createHash(new_password);
        user.password = hashedPassword;
        await user.save();
        res.json({ status: 'success', message: 'Contraseña restaurada exitosamente' });
    } catch (error) {
        console.error("Error al restaurar la contraseña:", error);
        res.status(500).json({ status: 'error', message: 'Ocurrió un error al restaurar la contraseña' });
    }
}

export const githubLoginService = (req, res, next) => {
    passport.authenticate('github', { scope: ['user:email'] })(req, res, next);
};

export const githubLoginCallbackService = (req, res, next) => {
    passport.authenticate('github', { session: false }, (err, user, info) => {
        if (err) {
            return res.status(500).json({ message: 'Error interno del servidor' });
        }
        if (!user) {
            return res.status(400).json({ message: info.message || 'GitHub authentication failed' });
        }
        const token = generateToken(user);
        res.cookie('jwt', token, { 
            httpOnly: true, 
            secure: process.env.NODE_ENV === 'production',
            maxAge: 24 * 60 * 60 * 1000 // 24 hours
        });
        res.redirect('/'); // Redirect to home page after successful login
    })(req, res, next);
};

export const currentUserService = async (req, res) => {
    passport.authenticate('jwt', { session: false })(req, res, () => {
        if (req.user) {
        res.json({
            status: 'success',
            user : {
                _id: req.user._id,
                first_name: req.user.first_name,
                last_name: req.user.last_name,
                email: req.user.email,
                age: req.user.age,
                role: req.user.role
            }
        });
    } else {
        res.status(401).json({ status: 'error', message: 'No autorizado' });
        }
    })(req, res);
}

export const getCurrentUserService = async (userId) => {
    const user = await userRepository.findCurrentById(userId);
    if (!user) {
        throw new Error('User not found');
    }
    return user;
}

