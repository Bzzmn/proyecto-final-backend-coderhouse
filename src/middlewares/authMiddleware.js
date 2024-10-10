import passport from 'passport';
import jwt from 'jsonwebtoken';

export const auth = (role) => {
    return (req, res, next) => {
        
        if (req.path === '/api/carts/quantity' && req.method === 'GET') {
            return next();
        }

        passport.authenticate('jwt', { session: false }, (err, user, info) => {
            if (err) {
                return next(err);
            }
            if (!user) {
                return res.status(401).json({ message: 'Unauthorized' });
            }
            if (role && user.role !== role) {
                return res.status(403).json({ message: 'Forbidden' });
            }
            req.user = user;
            next();
        })(req, res, next);
    };
};

export const attachUser = (req, res, next) => {
    const token = req.cookies.jwt;
    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decoded.user;
            res.locals.user = req.user;
        } catch (error) {
            req.user = null;
            res.locals.user = null;
        }
    } else {
        req.user = null;
        res.locals.user = null;
    }
    next();
};