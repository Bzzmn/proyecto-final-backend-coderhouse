import { fileURLToPath } from 'url';
import path from 'path';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import passport from 'passport';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const srcDir = path.join(__dirname, '..');
export { srcDir as __dirname };

export const createHash = (password) => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
};

export const isValidPassword = (user, password) => {
    return bcrypt.compareSync(password, user.password);
};

export const generateToken = (user) => {
    return jwt.sign({ 
        user: {
            _id: user._id,
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            role: user.role
        }
     }, process.env.JWT_SECRET, { expiresIn: '24h' });
};

export const authToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    const token = authHeader.split(' ')[1];
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Forbidden' });
        }
        req.user = credentials.user;
        next();
    });
};

export const passportCall = (strategy) => {
    return async (req, res, next) => {
        passport.authenticate(strategy, { session: false }, (err, user, info) => {
            if (err) {
                return next(err);
            }
            if (!user) {
                if (info && info.name === 'JsonWebTokenError') {
                    return res.status(401).json({ error: 'Invalid token' });
                } else {
                    return res.status(401).json({ error: 'No auth token' });
                }
            }
            req.user = user;
            next();
        })(req, res, next);
    };
};
