const mongoose = require("mongoose");
const listing = require("../models/listing.js")
const initData = require("./data.js")

let MONGO_URL = mongoose.connect('mongodb://127.0.0.1:27017/phipoli');

main()
    .then(()=>{
        console.log("Connected Successfully")
    })
    .catch((err)=>{
        console.log(err);
    })

async function main(){
    await MONGO_URL ;
}

const initDB = async ()=>{
    await listing.deleteMany({});
    initData.data = initData.data.map((obj) => ({
    ...obj,
    owner: "696252302bb57d2e0ee88293",
}));

    await listing.insertMany(initData.data)
    console.log("Database inilisation Successful");
}

initDB();