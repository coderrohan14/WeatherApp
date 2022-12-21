const dotenv = require("dotenv");
const express = require("express");
const app = express();
const https = require("https");
const bodyParser = require("body-parser");

dotenv.config({ path: "./config.env" });

app.use(bodyParser.urlencoded({ encoded: true }));

app.get("/", function (req, res) {
    res.sendFile(__dirname + "/index.html");
})

app.post("/", function (req, res) {
    const query = req.body.cityName;
    const apiKey = process.env.API_KEY;
    const unit = "metric";
    const url = "https://api.openweathermap.org/data/2.5/weather?q=" + query + "&appid=" + apiKey + "&units=" + unit;
    https.get(url, function (response) {
        console.log(response.statusCode);
        response.on("data", function (data) {
            {
                const weatherData = JSON.parse(data);
                const temp = weatherData.main.temp;
                const desc = weatherData.weather[0].description;
                const icon = weatherData.weather[0].icon;
                const imageURL = `http://openweathermap.org/img/wn/${icon}@2x.png`;
                res.write(`<h1>The current temperature in ${query} is: ${temp} degrees Celcius.</h1>`);
                res.write(`<p> ${desc} </p>`);
                res.write(`<img src=${imageURL}>`);
                res.send();

            }
        })
    })
})


let PORT = process.env.PORT;

if (PORT == null || PORT == "") {
    PORT = 3000;
}

app.listen(PORT, function () {
    console.log(`Server is running on ${PORT}`);
})