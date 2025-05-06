require('dotenv').config();
const express = require('express');
const axios = require('axios');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// Custom object config
const HUBSPOT_API_URL = `https://api.hubapi.com/crm/v3/objects/${process.env.OBJECT_TYPE_ID}`;
const HEADERS = {
  Authorization: `Bearer ${process.env.PRIVATE_APP_TOKEN}`,
  'Content-Type': 'application/json'
};

// Home route - list custom objects
app.get('/', async (req, res) => {
  try {
    const response = await axios.get(`${HUBSPOT_API_URL}?properties= player_name,jersey_number,batting_style`, {
      headers: HEADERS,
    });
    res.render('index', { games: response.data.results });
  } catch (error) {
    res.send('Error fetching records: ' + error.message);
  }
});

// GET form to create object

// GET form to create object
app.get('/update-object', (req, res) => {
    res.render('update');
  });

app.post('/update-object', async (req, res) => {
    const { player_name, jersey_number, batting_style } = req.body;
  
    const payload = {
      properties: {
        player_name,
        jersey_number,
        batting_style
      }
    };
  
    console.log("Payload being sent:", payload);
  
    try {
      await axios.post(HUBSPOT_API_URL, payload, {
        headers: HEADERS
      });
      res.redirect('/');
    } catch (error) {
      console.error("Error from HubSpot API:", error.response?.data || error.message);
      res.send('Error creating object: ' + JSON.stringify(error.response?.data || error.message));
    }
  });



app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });