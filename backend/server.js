const app = require("./app");
const dotenv = require("dotenv");
const connectDataBase = require("./config/database");
const cloudinary = require("cloudinary");
const cors = require('cors');

// SRIJAN
const PORT = process.env.PORT || 9000;

// Handling Uncaught Exception
process.on("uncaughtException", (err) => {
    console.log(`Error: ${err.message}`);
    console.log("Shutting down the server due to Uncaught Exception");
    process.exit(1);
})


// Config
dotenv.config({
    path: "backend/config/config.env",
})

// Connecting to Database (make sure to call only setting config file)
connectDataBase();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
})

app.use(cors({
    origin: '*'
}));

const server = app.listen(process.env.PORT, () => {
    console.log(`Server is working on http://localhost:${process.env.PORT}`);
})

// Unhandled Promise Rejection
process.on("unhandledRejection", err => {
    console.log(`Error: ${err.message}`);
    console.log("Shutting down the server due to Unhandled Promise Rejection");

    server.close(()=> {
        process.exit(1);
    });
})