from django.shortcuts import render
from django.views import generic
from django.http import JsonResponse
import json
import pg8000

class PredictionViewSet(generic.View):

    def get_predictions(self, date, time):
        conn = pg8000.connect(user="postgres", password="p5my2ndc684k7zw84k7zw!Cariniliapippr2t0qdni6md",database="postgres", host="db-group1.crhso94tou3n.eu-west-2.rds.amazonaws.com")
        cursor = conn.cursor()

        # use hardcoded date and time as times were lost during import
        # 
        # Does the input (date, time) need to be sanitized?
        print("Requested {} {}.".format(date, time))

        s = """SELECT * FROM sbb.prediction WHERE date > '20210220' ORDER BY date ASC LIMIT 12"""
        cursor.execute(s)
        results = cursor.fetchall()

        payload = []
        hour = 13

        for row in results:
            date, occ = row
            print(date)
            print(date.strftime("%Y-%m-%d"))
            payload.append({
                "date": date.strftime("%Y-%m-%d") + " {}:00".format(hour),
                "occupancy": occ
                })
            hour += 1

        conn.commit()

        return JsonResponse(payload, safe=False)

    def get(self, request, *args, **kwargs):
        return self.get_predictions(request.GET.get('date', ''), request.GET.get('time', ''))


        
