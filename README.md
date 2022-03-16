# Weathermate - Simple Weather Website #

# Overview #
I decided to create a simple full stack weather app to test my skills.


# Learning Objectives #
Some of my learning objetives with this include: 
* Creating a responsive and nicely designed weather app
* Utilizing API's to receive external weather data
* Creating an express server to receive GET and POST requests. 
* Understanding the fetch() API, and how asnchronicity works in Javascript
* Dynamic website templating using EJS
* Using SASS to improve my CSS structure and readability.( REally using SASS for the first time was pretty fun, and I enjoyed the nesting capabilities)
* Utilizing npm scripts to automate task such as live compiling sass code
* Input validation (Front and Backend) and utilizing server middleware.

# Roadblocks/ Issues Faced #
* Initially I had tried seperating my API calls into regular functions, and called them synchronously. I was using the built in https module to make the get requests from the backend. When my data was being returned as "undefined", I was confused as to why I wasnt receiving the data as requested. This led to to learning about the world of asynchronicity, promises and also anschronous functions with async and await. This made the entire process much easier and sped up my coding time.

* I was confused about how to convert unix time stamps (returned by the weather API) to a readable UTC format. I thought I would need to call another API for this, before realizing that Javascript had the built in data object and subsequent functions to handle this conversion.



# Results #
The weather app came out great and I learned alot during the process.


# Future Improvements #
* It would be useful to include a "suggested cities" section in the main dashboard, after the user enters their first city.
* Live suggestions for cities when the user starts typing in their query 
* Adding a minutely or hourly forecast on the main dashboard would be very useful