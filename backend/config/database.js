// file for connecting to database (we can also do that in server.js but it will increase unnecessary code)

const mongoose = require("mongoose");

const connectDataBase = () => {
    const databaseUri = process.env.DB_URI;
    if (!databaseUri) {
        return Promise.reject(new Error("DB_URI is not configured"));
    }

    // The Render secret still points at the retired Atlas host. Normalize only
    // that exact host to the active cluster, without exposing or rewriting its credentials.
    const activeDatabaseUri = databaseUri.replace(
        "@ecommerce.exqwglr.mongodb.net",
        "@cluster0.sktpjlw.mongodb.net"
    );

    return mongoose.connect(activeDatabaseUri)
    .then((data)=>{
        console.log(`MongoDB connected with server: ${data.connection.host}`);    
        return data;
    })
}

module.exports = connectDataBase;
