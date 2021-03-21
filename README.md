# Start Hack 2021

Code bits coming soon – Follow [starthack.eu](https://www.starthack.eu/program) for more information of the event.

## Live Demo
[Link to Demo](https://park-and-rail.azurewebsites.net/)


## Authors:
- [Yvan Bosshard](https://https://www.linkedin.com/in/yvan-bosshard/), ETH Zurich
- [Tiago Salzmann](https://www.linkedin.com/in/tiago-salzmann-888818164/), ETH Zurich
- [Achilleas Mitrotasios](https://www.linkedin.com/in/achilleas-mitrotasios/), University College London
- [Christopher Kindl](https://www.linkedin.com/in/kindl/), University College London

<br><br>
# Project Description

## Application Architecture

The core of the application is a web API that provides the user with predictions about the expected occupancy of a given P+Rail parking facility at a given date and time, as well as allowing the system to become more accurate over time. Given some base model, a web service instance pulls data from the SBB data API in order to run an inference and returns the result to the user in JSON format. On the frontend (currently implemented in React), the data is visualised for different time windows. In style of the EasyRide functionality in the SBB Mobile app, the user of the P+Rail app is given the opportunity to start and stop his/her parking interval with the use of a slider. Using this functionality can be motivated through reductions in parking fares (pay per use) or through technological means (e.g. requiring the user by service agreement to register the vehicle upon arrival). Once the user stops the parking interval, a pop-up asks the user to enter the current occupancy of the facility in an easy, fast-to-use way, which he/she will be rewarded for by loyalty points (that could be used for discounts or other amenities). This user input is fed back through the API, where the data is collected and regularly used to reinforce the model by retraining it with the most recent data and the user inputs.

Through the use of a data-driven approach it is easy to schedule retraining with a multitude of parameters. For example retraining can be triggered excluding or including certain input parameters (such as day of week, weather, season, etc.) and the resulting accuracies compared. In this way, not only is the model accuracy improving over time, yielding higher value of the service for customers and the SBB, it is also possible to narrow down potential variables affecting the occupancy of a certain facility and factor out others playing only a minor role.

The forecast of the predicted occupancy over the next twelve hours.             |  The EasyPark slider engaged during parking at Rapperswil Bahnhof.         
:-------------------------:|:-------------------------:
![](./ui_3.png)  |  ![](./ui_1.png)

<br><br>
## ML–Model

In order to construct a predictive model we formed the hypothesis that the true occupancy rate of the parking spaces can be approximated by the weighted sum of the ticket sales and the user input which we aim to collect. The user inputs will be averaged for a given timeslot.

If the solution is implemented in real life, the weight values can be computed by collecting user input for the parking spaces where the occupancy rate is already being tracked (i.e. Rapperswil) as a first stage and comparing the outputs in terms of correlation or similar.

Since at this point we do not have user inputs to work with, simulated it by artificially adding noise to the occupancy rate (Rapperswil) dataset.

We then trained a time series model on a the weighted ticket sales data and the simulated user input and finally computed a forecast on an hourly basis.

The prediction seem to accurately depict the real occupancy rates, indicating that the assumptions we made are realtively valid.