import express from 'express';
import "./config/db";


const app = express();

//Middlewares
import appMiddlewares from './config/middlewares';
appMiddlewares(app);

//AppRoutes
const appRoutes = require('./api-routes')
appRoutes(app);

//catch 404 Errors and forward them to error handeler
app.use((req, res, next) => {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
});

//Error handler funciton
app.use((err, req, res, next) => {
    const error = app.get('env') === 'development' ? err : {};
    const status = err.status || 500;
    //Respond to  client 
    res.status(status).json({
        error: {
            message: error.message
        }
    });
});


//start the server
const port = app.get('port') || 3000;
app.listen(port, () => console.log(`Server is listening on port ${port}`));