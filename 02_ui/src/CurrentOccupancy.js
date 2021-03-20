import React from 'react';
import './CurrentOccupancy.css';

import CanvasJSReact from './assets/canvasjs.react';
var CanvasJS = CanvasJSReact.CanvasJS;
var CanvasJSChart = CanvasJSReact.CanvasJSChart;

var json_text = '{"nhits": 6346, "parameters": {"dataset": "park-ride-rapperswil", "timezone": "UTC", "rows": 10, "start": 0, "format": "json", "facet": ["column_1"]}, "records": [{"datasetid": "park-ride-rapperswil", "recordid": "45ed28462795b3f8821a2d3e24e07c5c3dd56059", "fields": {"belegungsquote": 31.76100628930821, "column_1": "2020-08-01T11:00:00+00:00"}, "record_timestamp": "2021-03-18T12:51:14.328000+00:00"}, {"datasetid": "park-ride-rapperswil", "recordid": "4e8af0c8239d3b92f34e932c298766fa24b042db", "fields": {"belegungsquote": 62.89308176100633, "column_1": "2020-08-01T15:00:00+00:00"}, "record_timestamp": "2021-03-18T12:51:14.328000+00:00"}, {"datasetid": "park-ride-rapperswil", "recordid": "683bd793a45d8e2b972a1e43d19febd09d2abbf9", "fields": {"belegungsquote": 62.26415094339627, "column_1": "2020-08-01T17:00:00+00:00"}, "record_timestamp": "2021-03-18T12:51:14.328000+00:00"}, {"datasetid": "park-ride-rapperswil", "recordid": "1f2cd7c5c669a7097af46f561d8a6cddc16552b7", "fields": {"belegungsquote": 25.786163522012572, "column_1": "2020-08-02T00:00:00+00:00"}, "record_timestamp": "2021-03-18T12:51:14.328000+00:00"}, {"datasetid": "park-ride-rapperswil", "recordid": "093a789189fdf8bddc34e63c28d782c41c7c59d2", "fields": {"belegungsquote": 7.232704402515725, "column_1": "2020-08-02T02:00:00+00:00"}, "record_timestamp": "2021-03-18T12:51:14.328000+00:00"}, {"datasetid": "park-ride-rapperswil", "recordid": "50774d5c2a0f123d3c5235fad1152fd7065c05d1", "fields": {"belegungsquote": 6.289308176100626, "column_1": "2020-08-02T06:00:00+00:00"}, "record_timestamp": "2021-03-18T12:51:14.328000+00:00"}, {"datasetid": "park-ride-rapperswil", "recordid": "efbc7e37b9a9d3943be01ef561bb77e302c518db", "fields": {"belegungsquote": 23.27044025157232, "column_1": "2020-08-02T10:00:00+00:00"}, "record_timestamp": "2021-03-18T12:51:14.328000+00:00"}, {"datasetid": "park-ride-rapperswil", "recordid": "2338be63bce4127a35f8cb8554c3284ad79c5758", "fields": {"belegungsquote": 90.88050314465409, "column_1": "2020-08-02T16:00:00+00:00"}, "record_timestamp": "2021-03-18T12:51:14.328000+00:00"}, {"datasetid": "park-ride-rapperswil", "recordid": "65321127915c16b3f2acd50127ba9960fa9a1bbf", "fields": {"belegungsquote": 40.56603773584904, "column_1": "2020-08-02T18:00:00+00:00"}, "record_timestamp": "2021-03-18T12:51:14.328000+00:00"}, {"datasetid": "park-ride-rapperswil", "recordid": "829e07db5f74ae4ff35d954bf66b9ad3ef46d5fd", "fields": {"belegungsquote": 6.643356643356643, "column_1": "2020-08-03T01:00:00+00:00"}, "record_timestamp": "2021-03-18T12:51:14.328000+00:00"}], "facet_groups": [{"facets": [{"count": 4976, "path": "2020", "state": "displayed", "name": "2020"}, {"count": 1370, "path": "2021", "state": "displayed", "name": "2021"}], "name": "column_1"}]}'

var dataPoints =[];
class CurrentOccupancy extends React.Component {
    constructor (props) {
        super(props)
        this.state = {
            current_selection: 0
        }

        CanvasJS.addColorSet("single_colorset", ['#eb0000']);
    }

    updateSelectedItem = evt => {
        if(evt !== this.state.current_selection) {
            if(this.props.updateCarOccupancy) {
                
                this.props.updateCarOccupancy(evt)
            }

            this.updateChart()
        }

        this.setState({
            current_selection: evt
        })
    }

    updateChart() {
		var chart = this.chart;
		// fetch('https://canvasjs.com/data/gallery/react/nifty-stock-price.json')
        fetch('https://data.sbb.ch/api/records/1.0/search/?dataset=park-ride-rapperswil&q=&facet=column_1')
		.then(function(response) {
			return response.json();
		})
		.then(function(data) {
            if(dataPoints.length > 0)
                dataPoints = [];
			for (var i = 0; i < data['records'].length; i++) {
				dataPoints.push({
                    x: new Date(data['records'][i]['fields']['column_1']),
                    y: data['records'][i]['fields']['belegungsquote']
					// x: new Date(data[i].x),
					// y: data[i].y
				});
			}
            
			chart.render();
		});

        // var chart = this.chart;
        // var data = JSON.parse(json_text)['records']

        // if(dataPoints.length > 0)
        //     dataPoints = [];
        // for (var i = 0; i < data.length; i++) {
        //     dataPoints.push({
        //         x: new Date(data[i]['fields']['column_1']),
        //         y: data[i]['fields']['belegungsquote']
        //     });
        // }
        
        // chart.render();
	}

    componentDidMount(){
        this.updateChart()
    }

    render () {
        const options = {
            height: 300,
            width: 600,
            backgroundColor: "#f5f5f5",
            colorSet: "single_colorset",
            axisX:{
                gridThickness: 0,
                labelFontSize: 15,
                titleFontSize: 20,
                title: "Time",
            },
            axisY:{
                gridThickness: 0,
                labelFontSize: 15,
                titleFontSize: 20,
                title: "Occupancy (%)",
            },
            data: [{
				type: "column",
				xValueFormatString: "MMM YYYY",
				yValueFormatString: "$#,##0.00",
				dataPoints: dataPoints
			}]
         }

        return (
            <div className="item">
                <p className="itemTitle">Current Occupancy</p>

                <div className="EPLocation">
                    <img src="/assets/pin.png" className="pinIcon"/>
                    <p>Occupancy estimations for <span className="EPLocationName">Rapperswil Bahnhof</span>.</p>
                </div>
                <div className="clearFloat"></div>
                
                <div className="cocc-button-container">
                    <button className={this.state.current_selection === 0 ? "cocc-button-selected" : "cocc-button"} onClick={() => this.updateSelectedItem(0)}>1 Hour</button>
                    <button className={this.state.current_selection === 1 ? "cocc-button-selected" : "cocc-button"} onClick={() => this.updateSelectedItem(1)}>5 Hours</button>
                    <button className={this.state.current_selection === 2 ? "cocc-button-selected" : "cocc-button"} onClick={() => this.updateSelectedItem(2)}>1 Day</button>
                </div>

                <div className="cocc-occupancy-container">
                    <CanvasJSChart options = {options} onRef={ref => this.chart = ref}/>    
                </div>
            </div>
        )
    }
}

export  {CurrentOccupancy};