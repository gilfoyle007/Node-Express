import mongoose from 'mongoose'
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/db_project3');