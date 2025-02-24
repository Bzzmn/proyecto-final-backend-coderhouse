import handlebars from 'express-handlebars';
import { helpers } from '../utils/handlebars.helpers.js';

export const configureHandlebars = (app) => {
    const hbs = handlebars.create({
        helpers: helpers,
        extname: '.handlebars',
        runtimeOptions: {
            allowProtoPropertiesByDefault: true,
            allowProtoMethodsByDefault: true
        }
    });

    app.engine('handlebars', hbs.engine);
    app.set('view engine', 'handlebars');
    app.set('views', './src/views');

    return hbs;
}; 