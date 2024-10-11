import passport from 'passport';
import local from 'passport-local';
import { createHash, isValidPassword } from '../utils/index.js';
import GitHubStrategy from 'passport-github2';
import jwt from 'passport-jwt';
import DAOFactory from '../daos/DAOFactory.js';
import { PERSISTENCE } from './persistence.js';

const userDAO = DAOFactory.getDAO('USER', PERSISTENCE);

const LocalStrategy = local.Strategy;
const JWTStrategy = jwt.Strategy;
const ExtractJWT = jwt.ExtractJwt;

const initializePassport = () => {

    passport.use('register', new LocalStrategy({
        passReqToCallback: true,
        usernameField: 'email'
    }, async (req, email, password, done) => {
        try {
            const { first_name, last_name, age } = req.body;
            
            if (!first_name || !last_name || !email || !age || !password) {
                return done(null, false, { message: 'Todos los campos son obligatorios' });
            }

            const user = await userDAO.findByEmail(email);
            if (user) {
                return done(null, false, { message: 'El correo electrónico ya está registrado' });
            }

            const hashedPassword = createHash(password);
            const newUser = await userDAO.create({
                first_name,
                last_name,
                email,
                age,
                password: hashedPassword
            });

            return done(null, newUser);
        } catch (error) {
            return done(error);
        }
    }))

    passport.use('login', new LocalStrategy({
        usernameField: 'email'
    }, async (email, password, done) => {
        try {
            const user = await userDAO.findByEmail(email);
            if (!user) {
                return done(null, false, { message: 'Usuario no encontrado' });
            }
            if (!isValidPassword(user, password)) {
                return done(null, false, { message: 'Contraseña incorrecta' });
            }
            return done(null, user);
        } catch (error) {
            return done(error);
        }
    }))

    passport.use('github', new GitHubStrategy({
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: process.env.GITHUB_CALLBACK_URL
    }, async (accessToken, refreshToken, profile, done) => {
        try {
            const user = await userDAO.findByEmail(profile.emails[0].value);
            if (!user) {
        
                const [first_name, last_name] = profile.displayName.split(' ');
                
                const newUser = {
                    first_name: first_name || profile.username, 
                    last_name: last_name || 'Usuario de GitHub', 
                    email: profile.emails[0].value,
                    password: createHash(accessToken), 
                    age: 18, 
                    githubId: profile.id 
                }
                const result = await userDAO.create(newUser);
                return done(null, result);
            }
            return done(null, user);
        } catch (error) {
            return done(error);
        }
    }))

    passport.use('jwt', new JWTStrategy({
        jwtFromRequest: ExtractJWT.fromExtractors([
            ExtractJWT.fromAuthHeaderAsBearerToken(),
            req => req.cookies['jwt']
        ]),
        secretOrKey: process.env.JWT_SECRET
    }, async (jwt_payload, done) => {
        try {
            const user = await userDAO.findById(jwt_payload.user._id);
            if (user) {
                return done(null, user);
            } else {
                return done(null, false, { message: 'Usuario no encontrado' });
            }
        } catch (error) {
            return done(error);
        }
    }))

    passport.serializeUser((user, done) => {
        done(null, user._id);
    });

    passport.deserializeUser(async (id, done) => {
        try {
            const user = await userDAO.findById(id);
            done(null, user);
        } catch (error) {
            done(error);
        }
    });
}

export default initializePassport;

