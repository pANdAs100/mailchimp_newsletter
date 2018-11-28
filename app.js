const express = require("express");
const request = require('request');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();

//Body-parser Middleware to accept form data
app.use(bodyParser.urlencoded({ extended: true }));

//static folder
app.use(express.static(path.join(__dirname, 'public')));

//signup route
app.post('/signup', (req,res) =>{
    const { firstName, lastName, email } = req.body;
    //make sure fields are filled
    if(!firstName || !lastName, !email){
        res.redirect('/fail.html');
        return;//otherwise we get a header message
    }

    //construct request data
    const data = {
        members: [
            {
                email_address: email,
                status: 'subscribed',
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    }

  const postData = JSON.stringify(data);

  const options = {
    url: 'https://us19.api.mailchimp.com/3.0/lists/9ad23a4144',
    method: 'POST',
    headers: {
        Authorization: 'auth f8336fdc0dd3d107f74ffcb5a8a93243-us19'
    },
    body: postData
  };

  request(options, (err, response, body) => {
    if(err){
        res.redirect('/fail.html');
    } else {
      if(response.statusCode === 200){
        res.redirect('/success.html');
      } else {
        res.redirect('/fail.html');
      }
    }
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server started on ${PORT}`));