const express = require('express');
const path = require('path');
const connection = require('./js/db');  // Import the db connection
const routeRecipe = require('./routes/routeRecipe');

const app = express();
const port = 3000;
var startPage = "recipes.html";

app.use(express.static(path.join(__dirname, 'public')));

app.use(express.json());

// Route to serve the start page at the root path
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', startPage));
});
// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(bodyParser.json());
routeRecipe.routeRecipe(app);

function gotoIndex(req, res) {
  res.sendFile(__dirname + "/" + startPage);
}

app.get("/" + startPage, gotoIndex);

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
