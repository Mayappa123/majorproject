const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const Listing = require("./models/listing.js");
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const WrapAsync = require('./utils/WrapAsync.js');
const ExpressError = require('./utils/ExpressError.js')
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
const {listingSchema} = require("./schema.js");

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


const ValidateListing = (req, res, next) => {
    let {error} = listingSchema.validate(req.body);
     
    if(error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } 
    else {
        next();
    }
}

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
app.get('/listings/:id',  
    WrapAsync(async(req, res) => {
        let {id} = req.params;
        const listing = await Listing.findById(id);
        res.render('./listings/show.ejs', {listing})
    })
);


//create route
app.post('/listings', ValidateListing,
    WrapAsync(async(req, res, next) => {
        const newListing = new Listing(req.body.listing);
        await newListing.save();
        let listing = req.body.listing;
        res.redirect("/listings");
    })
);


//edit route
app.get('/listings/:id/edit',
WrapAsync(async(req, res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render('./listings/edit.ejs', {listing})
}));


//update route
app.put('/listings/:id', ValidateListing,  
    WrapAsync(async(req, res) => {
        let {id} = req.params;
        await Listing.findByIdAndUpdate(id, {...req.body.listing});
        res.redirect(`/listings/${id}`);
    })
);


//delete route
app.delete('/listings/:id',  
    WrapAsync(async(req, res) => {
        let {id} = req.params;
        let deletedListing = await Listing.findByIdAndDelete(id);
        console.log(deletedListing);
        res.redirect('/listings');
    })
);


//search route
app.get('/listings/:country', (req, res) => {
    const country = req.params.country;

    // Use the Mongoose model to find listings by country
    Listing.find({ country })
        .then(listings => {
            res.render('search.ejs', listings, { country});
        })
        .catch(err => {
            console.error('Error fetching listings:', err);
            res.status(500).json({ error: 'An error occurred while fetching listings' });
        });
});


app.all("*", (req, res, next) => {
    next(new ExpressError( 404, 'Page Not Found'));
});

app.use((err, req, res, next) => {
    let {StatusCode=500, Message='Something went wrong...'} = err;
    res.status(StatusCode).render('error.ejs', {Message});
    // res.status(StatusCode).send(Message);
})


app.listen( 8080, () => {
    console.log("Server is running on port 8080 ");
});

