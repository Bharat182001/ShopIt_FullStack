const dotenv = require("dotenv");
dotenv.config({ path: "backend/config/config.env" });

const app = require("./app");
const connectDataBase = require("./config/database");
const cloudinary = require("cloudinary");

const PORT = process.env.PORT || 9000;

// Handling Uncaught Exception
process.on("uncaughtException", (err) => {
    console.log(`Error: ${err.message}`);
    console.log("Shutting down the server due to Uncaught Exception");
    process.exit(1);
})


cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
})

let server;
const startServer = async () => {
    await connectDataBase();
    server = app.listen(PORT, "0.0.0.0", () => {
        console.log(`Server is listening on port ${PORT}`);
    });
};

startServer().catch((err) => {
    console.error("Unable to start the API:", err.message);
    process.exit(1);
});

// Unhandled Promise Rejection
process.on("unhandledRejection", err => {
    console.log(`Error: ${err.message}`);
    console.log("Shutting down the server due to Unhandled Promise Rejection");

    if (!server) {
        process.exit(1);
        return;
    }
    server.close(()=> {
        process.exit(1);
    });
})
