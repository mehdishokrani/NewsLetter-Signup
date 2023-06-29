const express = require("express");
const bodyParser = require("body-parser");
//const request = require("request")
const https = require("https");
const { request } = require("http");
const app = express();
const port = process.env.PORT;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/SignUp.html");
});

app.post("/", (req, res) => {
  const firstName = req.body.fName;
  const lastName = req.body.lName;
  const emailAdd = req.body.email;
  const data = {
    members: [
      {
        email_address: emailAdd,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName,
        },
      },
    ],
  };
  const jsonData = JSON.stringify(data);

  const url = "https://us17.api.mailchimp.com/3.0/lists/ded589c0d7";
  const option = {
    method: "POST",
    auth: "mehdi:00a73c903de5c0c92eb0bbb7fd49eeb6-us17",
  };

  const request = https.request(url, option, (response) => {
    
    //res.sendFile()
    response.on("data", (d) => {
      var jsonData = JSON.parse(d)
      if (response.statusCode === 200 && jsonData.error_count == 0 ) {
        res.sendFile(__dirname + "/Success.html");
      } else if(jsonData.error_count == 1)  {
        console.log("You have already been added to this newsletter!!!!!")
        res.sendFile(__dirname + "/Failure.html");
        
      }
      else{
        res.sendFile(__dirname + "/Failure.html");
      }
      console.log(jsonData);
    });
  });
  request.write(jsonData);
  request.end();
});


app.post("/failure",(req,res)=>{
  res.redirect("/")
})



app.listen(port || 3000, () => {
  console.log(`Server is running on port ${port}`);
});
