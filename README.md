# Case winner of Start Hack 2021: Predictive models for car parking space occupancy for the Swiss federal railways (SBB)

**Challenge**\
With more than 29.000 car parking lots distributed across 600 locations, the SBB is one of the largest parking space owner in Switzerland. For a pilot study, the SBB has equipped two parking sites with sensors to measure and collect parking occupancy rates. Based on this data, the task during the hackathon was to create predictive models to better forecast parking occupancy rates. 

**Solution**\
This repository features the winning solution created during the hackathon and the subsequent research paper for deeper analysis of the proposed machine learning models. The solution is based on a XGBoost model that considers the following data sources:

  * Time-related features
  * Past parking occupancy (lag features)
  * Ticket sales data
  * Weather and public holidays information

The model was tested on real-world data from two parking sites. For a 3-month forecast of each parking site, the model including all features achieved a high accuracy with a mean absolute error of **2.34** and **4.27**, respectively. The hackathon solutions includes consideration on how enduser feedback can be collected and used to calibrate the predictive model.

**Authors**
- [Yvan Bosshard](https://https://www.linkedin.com/in/yvan-bosshard/), ETH Zurich
- [Tiago Salzmann](https://www.linkedin.com/in/tiago-salzmann-888818164/), ETH Zurich
- [Achilleas Mitrotasios](https://www.linkedin.com/in/achilleas-mitrotasios/), University College London
- [Christopher Kindl](https://www.linkedin.com/in/kindl/), University College London


The hackathon was hosted by [startglobal](https://www.startglobal.org/)

## Table of contents
   * [Solution submitted during hackathon](#Solution-submitted-during-hackathon)
      * [Concept](#concept)
      * [Resources](#resources)
   * [Research paper](#research-paper)
      * [Dependencies and installation](#dependencies)
      * [Data pre-processing](#preprocessing)
      * [Feature extraction](#feature-extraction)
      * [Baseline model](#baseline-model)
      * [Advanced model](#advanced-model)



# Solution submitted during hackathon
### Concept

![alt text](https://github.com/christopherkindl/start-hack-2021/blob/main/img/Architecture.png)

The core of the application is a web API that provides the user with predictions about the expected occupancy of a given P+Rail parking site at a given hour, as well as allowing the system to give feedback of the perceived parking occupancy once users started their parking sessions. Given some base model, a web service instance pulls data from the SBB data API in order to run an inference and returns the result to the user in JSON format. In the front-end (implemented in React), the data is visualized for different time windows. In style of the EasyRide functionality in the SBB Mobile app, the users of the P+Rail app are given the opportunity to start and stop his/her parking interval with the help of a data input slider. Nudging can be applied to increase user contribution, such as reductions in parking fares (pay per use) or through technological means (e.g. requiring the user by service agreement to register the vehicle upon arrival). Once users finish a parking session, a pop-up asks the user to enter the perceived occupancy of the facility in a convenient manner. which he/she will be rewarded for by loyalty points (that could be used for discounts or other amenities). This user input is fed back through the API, where the data is collected and regularly used to reinforce the model by retraining it with the most recent data and the user inputs.

Through the use of a data-driven approach it is easy to schedule retraining with a multitude of parameters. For example retraining can be triggered excluding or including certain input parameters (such as day of week, weather, season, etc.) and the resulting accuracies compared. In this way, not only is the model accuracy improving over time, yielding higher value of the service for customers and the SBB, it is also possible to narrow down potential variables affecting the occupancy of a certain facility and factor out others playing only a minor role.

The forecast of the predicted occupancy over the next twelve hours.             |  The EasyPark slider engaged during parking at Rapperswil Bahnhof.         
:-------------------------:|:-------------------------:
![](./ui_3.png)  |  ![](./ui_1.png)

<br><br>
## ML–Model


### Model evaluation:

- [jupyter notebook holt-winters time-series model](https://github.com/christopherkindl/start-hack-2021/blob/main/01_ml/model_training_achi.ipynb)
- [jupyter notebook Facebook-Prophet time-series model](https://github.com/christopherkindl/start-hack-2021/blob/main/01_ml/model_training_chris.ipynb)

In order to construct a predictive model we formed the hypothesis that the true occupancy rate of the parking spaces can be approximated by the weighted sum of the ticket sales and the user input which we aim to collect. The user inputs will be averaged for a given timeslot.

If the solution is implemented in real life, the weight values can be computed by collecting user input for the parking spaces where the occupancy rate is already being tracked (i.e. Rapperswil) as a first stage and comparing the outputs in terms of correlation or similar.

Since at this point we do not have user inputs to work with, simulated it by artificially adding noise to the occupancy rate (Rapperswil) dataset.

We then trained a time series model on a the weighted ticket sales data and the simulated user input and finally computed a forecast on an hourly basis.

The prediction seem to accurately depict the real occupancy rates, indicating that the assumptions we made are realtively valid.

We achieved a mean squared error of **0.0295** for the occupancy rate.

![](./Model.png)
