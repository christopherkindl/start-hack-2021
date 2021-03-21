from django.shortcuts import render
from django.views import generic
from django.http import JsonResponse

import json

class PredictionViewSet(JsonResponse):
    def predict(self):
        return JsonResponse([
            {
                "date": "2021-11-02 13:00",
                "occupancy": 0.8
            },{
                "date": "2021-11-02 14:00",
                "occupancy": 0.6
            },{
                "date": "2021-11-02 15:00",
                "occupancy": 0.4
            },{
                "date": "2021-11-02 16:00",
                "occupancy": 0.3
            },{
                "date": "2021-11-02 17:00",
                "occupancy": 0.7
            },{
                "date": "2021-11-02 18:00",
                "occupancy": 0.8
            },{
                "date": "2021-11-02 19:00",
                "occupancy": 0.9
            },{
                "date": "2021-11-02 20:00",
                "occupancy": 1.0
            },{
                "date": "2021-11-02 21:00",
                "occupancy": 0.9
            },{
                "date": "2021-11-02 22:00",
                "occupancy": 0.8
            },{
                "date": "2021-11-02 23:00",
                "occupancy": 0.3
            },{
                "date": "2021-11-02 24:00",
                "occupancy": 0.1
            }
        ], safe=False)
