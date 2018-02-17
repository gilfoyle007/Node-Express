import helmet from 'helmet'
import logger from 'morgan'
import bodyParser from 'body-parser'

module.exports = app => {
    app.use(helmet());
    app.use(logger('dev'));
    app.use(bodyParser.json());
};