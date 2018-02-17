module.exports = (app) => {
    //Routers
   
    app.use('/users', require('./routes/user'));
    app.use('/locations', require('./routes/location'));
    app.use('/connections', require('./routes/connections'));
    app.use('/status', require('./routes/status'));
    app.use('/chat', require('./routes/chat'));

};