const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const ExpressError = require('./utils/ExpressError.js');

const listings = require("./routes/listing.js");
const reviews = require('./routes/review.js');

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main()
.then( ()=> {
    console.log('connected')
})
.catch( (err)=> {
    console.log('err to connect database')
});

async function main() {
    await mongoose.connect(MONGO_URL);
};

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, '/public')));

app.get( '/', (req, res)=> {
    res.send('root is working')
});

app.use('/listings', listings);
app.use('/listings/:id/reviews', reviews);


app.all("*", (req, res, next) => {
    next(new ExpressError( 404, 'Page Not Found'));
});

app.use((err, req, res, next) => {
    let {StatusCode=500, Message='Something went wrong...'} = err;
    res.status(StatusCode).render('error.ejs', {Message});
});

app.listen( 8080, () => {
    console.log("Server is running on port 8080 ");
});

