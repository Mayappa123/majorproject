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
    initData.data = initData.data.map((obj) => ({ ...obj, owner: "65314e6e7e66fc9c10aad327" }));
    await listing.insertMany(initData.data);
    console.log('data initialized successfully...')
};
initDB();