if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}
// console.log(process.env.SECRET);

const express = require("express");
const app = express();
const path = require("path")
const mongoose = require("mongoose");
// const Listing = require("./models/listing");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
// const ExpressError = require("./utils/ExpressError.js");
const {listingSchema , reviewSchema} = require("./schema.js");
const Review = require("./models/review");
const session = require("express-session");                        // sessions
const MongoStore = require("connect-mongo").default;                     // store sessions in mongoDB
const flash = require("connect-flash");                              // flash messages
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");


const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");
// const reviewRouter = require("./models/review");

app.set("view engine" , "ejs");
app.set("views" , path.join(__dirname , "/views"));

app.use(express.urlencoded({ extended: true }));  
app.use(methodOverride("_method"));

app.engine("ejs" , ejsMate);
app.use(express.static(path.join(__dirname , "/public")))

// let MONGO_URL = mongoose.connect('mongodb://127.0.0.1:27017/phipoli');

const dbUrl = process.env.ATLASDB_URL;

main()
    .then(()=>{
        console.log("Connected Successfully")
    })
    .catch((err)=>{
        console.log(err);
    })

async function main(){
    await mongoose.connect(dbUrl);
}

const port = 8080 ;

app.listen(port , (req,res)=>{
    console.log(`Lisening on port:${port}`);
})


const store = MongoStore.create({
  mongoUrl: dbUrl,
  crypto: {
    secret: process.env.SECRET,
  },
  touchAfter: 24 * 3600,
});

store.on("error", function (e) {
  console.log("SESSION STORE ERROR", e);
});


//session

const sessionOptions = {
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialised: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000, // 1 week
        maxAge: 7 * 24 * 60 * 60 * 1000, // 1 week
        httpOnly: true
    }
};

// app.get("/" , (req,res)=>{
//     res.send("Welcome to Home Page");
// })

app.use(session(sessionOptions));
app.use(flash());

//passport config
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currentUser = req.user;
    next();
});

app.use("/listings",listingRouter);
app.use("/listings/:id/reviews",reviewRouter);
// app.use("/users", userRouter);
app.use("/", userRouter);



