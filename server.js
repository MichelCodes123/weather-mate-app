const express = require("express");
const bodyParser = require("body-parser");
const fetch = require("node-fetch");
const app = express();
require('dotenv').config();
const KEY = process.env.API_KEY;
const PORT = process.env.PORT || 3000;
let query = "";
let regex = /[&=<>]/g;

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));


app.get("/", function (req, res) {
    res.sendFile(__dirname + "/index.html");
});
app.get("/not-found", function (req, res) {

    res.sendFile(__dirname + "/page-unknown.html");
})
app.post("/dashboard", sanitize, function (req, res) {

    query = req.body.cityName;
    let URL = `https://api.openweathermap.org/geo/1.0/direct?q=${query}&appid=${KEY}&limit=5`;
    let values = getWeather(getCoords(URL))

    Promise.resolve(values)
        .then(data => {

            if (data === "error") {
                res.redirect("/not-found");

            }
            else if (data === "unexpectedError")
            {
                res.render("page-misinputs")
            }
            else {

                let icons = {
                    Clear: "Images/circle-solid.png",
                    Rain: "Images/cloud-showers-heavy-solid.png",
                    Drizzle: "Images/drizzle-light.png",
                    Thunderstorm: "Images/thunder-solid.png",
                    Snow: "Images/snowflake-solid.png",
                    Clouds: "Images/cloud-solid.png",
                    Mist: "Images/other-solid.png",
                    Smoke: "Images/other-solid.png",
                    Haze: "Images/other-solid.png",
                    Dust: "Images/other-solid.png",
                    Fog: "Images/other-solid.png",
                    Sand: "Images/other-solid.png",
                    Dust: "Images/other-solid.png",
                    Ash: "Images/other-solid.png",
                    Squall: "Images/other-solid.png",
                    Tornado: "Images/other-solid.png",


                }
                let days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
                let humidity = data[0]["humidity"]
                let description = data[0]["weather"][0]['description'];


                if (description.length > 23) {
                    description = data[0]["weather"][0]['main'];
                }
                else {
                    description = toCaps(description);
                }
                let pressure = data[0]["pressure"];
                let temperature = data[0]["temp"];
                let windspeed = data[0]["wind_speed"]

                let precipitation = data[1];

                let name = data[2];
                let country = data[3];



                let time = data[7];

                res.render("dashboard", {
                    cityName: name,
                    countryCode: country,
                    item1: humidity,
                    item2: windspeed,
                    item3: (pressure / 10),
                    item4: Math.ceil((precipitation * 100)),
                    desc: description,
                    temp: Math.floor(temperature),

                    src1: icons[data[4][3]['main']],
                    alt1: data[4][3]['description'],

                    src2: icons[data[5][3]['main']],
                    alt2: data[5][3]['description'],

                    src3: icons[data[6][3]['main']],
                    alt3: data[6][3]['description'],


                    day1: days[data[4][0]],
                    day2: days[data[5][0]],
                    day3: days[data[6][0]],

                    tdyTemp: Math.floor(data[4][1]),
                    minTemp1: Math.floor(data[4][2]),
                    tmrTemp: Math.floor(data[5][1]),
                    minTemp2: Math.floor(data[5][2]),
                    nextTemp: Math.floor(data[6][1]),
                    minTemp3: Math.floor(data[6][2]),
                    times: time

                });
            }

        })


});

app.all("*", function (req, res) {
    res.sendFile(__dirname + "/page-404.html");
});

app.listen(PORT, function () {

    console.log("Server has started")

}
);


// Middleware function to sanitize request.
function sanitize(req, res, next) {

    if (req.body.cityName === undefined) {
        res.sendStatus(404);
    } else if (req.body.cityName === "") {
        res.redirect("not-found")
    }
    else if (req.body.cityName.length > 25) {
        req.body.cityName = req.body.cityName.substr(0, 25);

        next()
    }
    else if(regex.test(req.body.cityName) === true){
        req.body.cityName = req.body.cityName.replace(regex, "");
        next()
    }
    else {
        next()
    }
}

async function getCoords(URL) {

    try {
        const geoPromise = await fetch(URL);
        const geoData = await geoPromise.json();

        if (geoData.length === 0) {

            return "error";

        } else {


            let city = geoData[0];
            let coords = [city.lat, city.lon, city['name'], city['country']]
            return coords;
        }
    }
    catch (error) {
        return "unexpectedError"
    }

}

async function getWeather(coordinate) {


    // Parsing the location data from the previous getCoords() function
    let coords = await Promise.resolve(coordinate);

    if (coords === "error") {
        return "error";
    }
    else if (coords === "unexpectedError") {
        return "unexpectedError";
    }
    else {
        try {
            let newURL = `https://api.openweathermap.org/data/2.5/onecall?lat=${coords[0]}&lon=${coords[1]}&units=metric&exclude=alerts,hourly&appid=${KEY}`;
            const weatherPromise = await fetch(newURL);
            // WeatherData is holding the full parsed response from the API that I just called.
            const weatherData = await weatherPromise.json();

            let timeZone = weatherData['timezone_offset'];
            let current = weatherData["current"];
            let daily = weatherData['daily']
            let name = coords[2];
            let country = coords[3];

            let rain = weatherData["daily"][0]['pop'];

            // This is the weather data for the current day, and next two days
            let tdy = [getDay(daily[0]['dt'], timeZone), daily[0]['temp']['max'], daily[0]['temp']['min'], daily[0]['weather'][0]];
            let tmr = [getDay(daily[1]['dt'], timeZone), daily[1]['temp']['max'], daily[0]['temp']['min'], daily[1]['weather'][0]];
            let next = [getDay(daily[2]['dt'], timeZone), daily[2]['temp']['max'], daily[0]['temp']['min'], daily[2]['weather'][0]];

            // Getting the time data to show the current time of the indexed location
            let time = getTime(current['dt'], timeZone);
            let dashboard = [current, rain, name, country, tdy, tmr, next, time]

            return dashboard;
        } catch (error) {
            return "unexpectedError"
        }

    }

}

function getDay(unix, timeZ) {
    let time = new Date((unix + timeZ) * 1000);
    return time.getUTCDay();
}

function getTime(unix, timeZ) {
    let time = new Date((unix + timeZ) * 1000);
    let hour = time.getUTCHours();
    let minutes = "0" + time.getUTCMinutes();

    if (hour > 12) {
        hour = (hour - 12);
        return `${hour}:${minutes.substr(-2)} PM`;
    }
    else if (hour === 0) {
        return `12:${minutes.substr(-2)} AM`;
    }
    else {
        return `${hour}:${minutes.substr(-2)} AM`;
    }


}

function toCaps(desc) {

    let array = desc.split(" ");
    let regex = /^\w/;

    for (let i = 0; i < array.length; i++) [
        array[i] = array[i].replace(regex, (value) => value.toUpperCase())
    ]

    return array.join(" ");

}
