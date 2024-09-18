import { Router } from "express";
import userModel from "../models/users.model.js";
import { createHash, generateToken } from "../utils.js";
import passport from "passport";
import { passportCall } from "../utils.js";
const router = Router();

router.post('/register', (req, res, next) => {
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
});

router.post('/login', (req, res, next) => {
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
});

router.get('/logout', (req, res) => {
    res.clearCookie('jwt');
    res.redirect('/');
});

router.post('/restore-password', async (req, res) => {
    const { email, new_password } = req.body;
    try {
        const user = await userModel.findOne({ email });
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
});

router.get('/github', passport.authenticate('github', { scope: ['user:email'] }));

router.get('/github/callback', passport.authenticate('github', { session: false }), (req, res) => {
    const token = generateToken(req.user);
    res.cookie('jwt', token, { 
        httpOnly: true, 
        secure: process.env.NODE_ENV === 'production',
        maxAge: 24 * 60 * 60 * 1000 // 24 horas
    });
    res.redirect('/');
});

router.get('/current', passport.authenticate('jwt', { session: false }), (req, res) => {
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
});

export default router;
