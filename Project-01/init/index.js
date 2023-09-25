const mongoose = require('mongoose');
const initData = require('./data.js');
const listing = require('../models/listing.js');

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main()
.then( ()=> {
    console.log('connected');
})
.catch( (err)=> {
    console.log('err to connect database');
});

async function main() {
    await mongoose.connect(MONGO_URL);
};

const initDB = async () => {
    await listing.deleteMany({});
    await listing.insertMany(initData.data);
    console.log('data initialized successfully...')
};
initDB();