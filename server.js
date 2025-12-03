/* 
Preconditions:
- User enters a book title into the search bar
- Front end sends this title to the server using a GET request to /booktitle

Post conditions:
- Console prints:
      "Starting GET to /booktitle!"
      "User searched for the book title: <title>"
- Server returns:
      {
        message: "Backend received the book title.",
        receivedTitle: "<title>"
      }
*/


'use strict';
// import Express 
const express = require('express');   
const app = express();
const port = 8080;                    

//route
app.get('/booktitle', (req, res) => {

  console.log("Starting GET to /booktitle!");

  // Get the book title from the URL
  let title = req.query.title;
  console.log("User searched for the book title:", title);
  // send the response to the client	
  let replyObject = {
    message: "Backend received the book title.",
    receivedTitle: title
  };
  // Allow the browser to access this data 
  res.header("Access-Control-Allow-Origin", "*");
  // Send the response to the front end
  res.send(JSON.stringify(replyObject));
});

//listen 
app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
});
