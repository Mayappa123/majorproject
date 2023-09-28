const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const Listing = require("./models/listing.js");
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');

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


//index route
app.get('/listings', async(req, res) => {
    const allListings = await Listing.find({});
    res.render('./listings/index.ejs', {allListings});
});


//new route
app.get('/listings/new', (req, res) => {
    res.render('./listings/new.ejs')
});


//show route
app.get('/listings/:id', async(req, res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render('./listings/show.ejs', {listing})
});


//create route
app.post('/listings', async(req, res) => {
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    let listing = req.body.listing;
    res.redirect("/listings");
});


//edit route
app.get('/listings/:id/edit', async(req, res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render('./listings/edit.ejs', {listing})
});


//update route
app.put('/listings/:id', async(req, res) => {
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id, {...req.body.listing});
    res.redirect(`/listings/${id}`);
});


//delete route
app.delete('/listings/:id', async(req, res) => {
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect('/listings');
});


//search route
app.get('/listings/search', async (req, res) => {
    try {
      const { country } = req.query;
      const listings = await Listing.find({ country }); // Query listings by country
      res.render('./listings/search.ejs', { listings, country });
    } catch (err) {
      console.error(err);
      res.redirect('/listings');
    }
});


app.listen( 8080, () => {
    console.log("Server is running on port 8080 ");
});

