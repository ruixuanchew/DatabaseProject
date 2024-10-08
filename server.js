const express = require('express');
const path = require('path');
const connection = require('./js/db');  // Import the db connection
const routeRecipe = require('./routes/routeRecipe');
const routePlanner = require('./routes/routePlanner');
const routeUser = require('./routes/routeUser');
const routeNutrition = require('./routes/routeNutrition');

const app = express();
const port = 3000;
var startPage = "recipes.html";

// Session for login
const session = require('express-session');

app.use(session({
    secret: 'your_secret_key',  // Use a strong secret key for production
    resave: false,              // Don't save session if it hasn't been modified
    saveUninitialized: false,   // Don't create session until something stored
    cookie: { secure: false }   // Set true if using HTTPS; set false for HTTP
}));

app.use(express.static(path.join(__dirname, 'public')));

app.use(express.json());

// Route to serve the start page at the root path
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', startPage));
});
// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(bodyParser.json());
routeRecipe.routeRecipe(app);
routePlanner.routePlanner(app)
routeUser.routeUser(app)
routeNutrition.routeNutrition(app)

function gotoIndex(req, res) {
  res.sendFile(__dirname + "/" + startPage);
}

app.get("/" + startPage, gotoIndex);

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
