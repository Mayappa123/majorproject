//----------------------------------------------Basic Set up----------------------------------------------
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js")
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js")
const ExpressError = require("./utils/ExpressError.js")
const {listingSchema} = require("./schema.js")

const MONGO_URL ="mongodb://127.0.0.1:27017/wanderlust";

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"/public/")));

main()
    .then(()=>{
        console.log("connected to DB");
    })
    .catch(err => console.log(err));

async function main() {
  await mongoose.connect(MONGO_URL);
}

app.listen(8080,()=>{
    console.log("server is listening to port 8080");
});
app.get("/",(req,res)=>{
    res.send("Hi, I am root");
})

const validateListing = (req,res,next)=>{
    let {error} = listingSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el)=>el.message).join(",");
        console.log(error);
        console.log(errMsg);
        throw new ExpressError ( 400, errMsg);
    }else{
        next();
    }
}

//----------------------------------------------Index Route----------------------------------------------
app.get("/listings",wrapAsync(async(req,res,next)=>{
    let allListing = await Listing.find();
    // console.log(allListing);
    res.render("listings/index.ejs",{allListing});
}));
//----------------------------------------------CREATE (New & Create Route)----------------------------------------------
app.get("/listings/new",(req,res)=>{
    res.render("listings/new.ejs");
})

app.post("/listings",validateListing,wrapAsync( async(req,res,next)=>{      
    const newListing = new Listing(req.body.listing);       
    await newListing.save();
    res.redirect("/listings");

    })
);
//----------------------------------------------READ (Show Route)----------------------------------------------
app.get("/listings/:id",wrapAsync(async(req,res,next)=>{
    let {id} = req.params;                     
    let listing = await Listing.findById(id);
    if(!listing){
        throw new ExpressError(400,"Listing not found")
    }
    console.log(listing);
    res.render("listings/show.ejs",{listing});
}));

//----------------------------------------------UPDATE (Edit & Update Route)----------------------------------------------
app.get("/listings/:id/edit",wrapAsync(async(req,res,next)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
    res.render("listings/edit.ejs",{listing});
}));

app.put("/listings/:id",validateListing,wrapAsync(async(req,res,next)=>{
    let {id} = req.params;
    let updateListing = req.body.listing;  
    await Listing.findByIdAndUpdate(id,updateListing);
    res.redirect(`/listings/${id}`)
}));

//----------------------------------------------DELETE (Delete Route)----------------------------------------------
app.delete("/listings/:id",wrapAsync(async(req,res,next)=>{
    let {id} = req.params;
    let deleteListing =await Listing.findByIdAndDelete(id);
    console.log(deleteListing);
    console.log("delete")
    res.redirect("/listings");
}));

//all other route req ---------
app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"Page Not Found!"));
})

//error handling midlleware---------
app.use((err,req,res,next)=>{
    // res.send("something went wrong");
    let {statusCode =500 , message = "Something went wrong!"} = err;
    res.status(statusCode).render("listings/error.ejs",{message})

});