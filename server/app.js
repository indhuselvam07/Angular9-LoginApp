   // Import express
   const express = require('express'),
    path = require('path'),
    // Import Body parser
    bodyParser = require('body-parser'),
    cors = require('cors'),
    // Import Mongoose
    mongoose = require('mongoose'),
    // Connect to Mongoose and set connection variable
    config = require('./DB');
     // Import routes
    const loginRoute = require('./routes/login.routes');
    // Added check for DB connection
    mongoose.Promise = global.Promise;
    mongoose.connect(config.DB, { useNewUrlParser: true }).then(
      () => {console.log('Database is connected') },
      err => { console.log('Can not connect to the database'+ err)}
    );
    
     // Initialise the app
    const app = express();
    // Configure bodyparser to handle post requests
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());
    app.use(cors());
    // Send message for default URL
    app.get('/', (req, res) => res.send('Hello World with Express'));
    // Use Api routes in the App
    app.use('/api', loginRoute);
    // Setup server port
    const port = process.env.PORT || 4000;
    // Launch app to listen to specified port
    const server = app.listen(port, function(){
     console.log('Listening on port ' + port);
    });