const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config();
app.use(express.json());

const port = process.env.PORT || 8000; // Set default port as 8000 if PORT environment variable is not set

// Use CORS middleware
app.use(cors());

// Import the router
const routes = require('./src/routers/router.js');

// Prefix routes with /ledger
app.use("/api", routes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});