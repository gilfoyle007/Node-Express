const devConfig = {
    //For Development
    MONGO_URL: 'mongodb://localhost/db_project1-dev'
};

const testConfig = {
    //For Testing
    MONGO_URL: 'mongodb://localhost/db_project1-test'
};

const prodConfig = {
    //For Production
    MONGO_URL: 'mongodb://localhost/db_project1-prod'
};

const defaultConfig = {
    PORT: process.env.PORT || 3000
};

envConfig = (env) => {
    switch (env) {
        case 'development':
            return devConfig;
        case 'test':
            return testConfig;
        default:
            return prodConfig;
    }
};

export default {
    ...defaultConfig,
    ...envConfig(process.env.NODE_ENV)
};