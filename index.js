require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

const bodyParser = require('body-parser');
const dns = require('node:dns');
const { URL } = require('node:url');


// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());
const options = {
    all:true,
};
  

// body parsing middleware to handle the POST requests.
app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json())


app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});


//Empty array for origianl url
const original_url = []

//Empty array for short url
const short_url = []

app.post('/api/shorturl', function(req, res) {

  //request body for post url
  const url = req.body.url

//  const newUrl = new URL('http://example.com/', url);


  //variable for url in arrays
  const foundurl = original_url.indexOf(url)

  
// lookup the hostname passed as argument
dns.lookup('https://google.com', options, (err, address) => {
  
  // if an error occurs, eg. the hostname is incorrect!
  if (err) {
    console.error(err.message);
  } else {
    // if no error exists
    console.log('addresses: %j', address);
  }
});

  //If you pass an invalid URL that doesn't follow the valid, it retuns invalid
  if(!url.includes('https://') && !url.includes('http://')) {
    return res.json({ error: 'invalid url' })
  }

  //If array is less than zero
  if(foundurl < 0) {
    
    //push url into array 
    original_url.push(url)
    
    //push length of url also which is zero
    short_url.push(short_url.length)
  
    
  return res.json({
    original_url: url,
    short_url: short_url.length - 1
  })
}

  return res.json({
    original_url: url,
     short_url: short_url[foundurl]
  })
})

//When you visit /api/shorturl/<short_url>, you will be redirected to the original URL
app.get('/api/shorturl/:short_url', function(req, res) {

  // parse in the length as an interger
  const shorturl = parseInt(req.params.short_url)

//search the empty array for the length and return the first index at which a given element can be found in the array.
 const foundIndex = short_url.indexOf(shorturl)

//if the foundindex is less than 0
  if(foundIndex < 0) {
      return res.json({
      error: "No short URL found for the given input"
    })
}

//redirect to the property of the given short_url length
  res.redirect(original_url[foundIndex])
})

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
