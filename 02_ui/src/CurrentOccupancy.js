import React from 'react';
import './CurrentOccupancy.css';
import "react-datetime/css/react-datetime.css";
import Datetime from "react-datetime";

import CanvasJSReact from './assets/canvasjs.react';
var CanvasJS = CanvasJSReact.CanvasJS;
var CanvasJSChart = CanvasJSReact.CanvasJSChart;


var dataPoints =[];
class CurrentOccupancy extends React.Component {
    constructor (props) {
        super(props)
        this.state = {
            current_selection: 0,
            req_date: null,
            max_items: 1
        }

        CanvasJS.addColorSet("single_colorset", ['#eb0000']);
    }

    updateSelectedItem = (evt, redraw) => {

        console.log("Event triggered " + evt);

        this.setState({
            current_selection: evt
        })

        if(evt !== this.state.current_selection || redraw) {
            if(this.props.updateCarOccupancy) {
                
                this.props.updateCarOccupancy(evt)
            }

            this.updateChart(evt)
        }   
    }

    updateChart = nelem => {

        console.log("Update triggered " + nelem);

        var chart = this.chart;

        if( this.state.req_date ) {
            var uri = "https://park-and-rail-api.azurewebsites.net/?date=" + this.state.req_date;
            fetch(uri, {mode: 'cors'})
            .then(response => response.json())
            // .then(function(response) {
            //     console.log(response);
            //     return '[{"date": "2021-11-02 13:00","occupancy": 0.8}]';
            //     // return JSON.parse(response.json());
            // })
            .then(data => {

                var max_items = data.length;

                if( nelem != null ) {
                    if( nelem == 0 ) {
                        max_items = 1;
                    }
                    else if( nelem == 1 ) {
                        max_items = 5;
                    }
                    if( nelem == 2 ) {
                        max_items = 12;
                    }
                }
                else {
                    max_items = 1;
                }

                if(dataPoints.length > 0)
                    dataPoints = [];

                console.log(max_items);
                console.log(data);

                for(var i = 0; i < max_items; ++i) {
                    dataPoints.push({
                        x: new Date(data[i]['date']),
                        y: data[i]['occupancy']/100
                    });
                }

                chart.render();
                this.render();
            });

        }
        else {
            var arr = '[{"date": "2021-11-02 13:00","occupancy": 0.8},{"date": "2021-11-02 14:00","occupancy": 0.6},{"date": "2021-11-02 15:00","occupancy": 0.4},{"date": "2021-11-02 16:00","occupancy": 0.3},{"date": "2021-11-02 17:00","occupancy": 0.7},{"date": "2021-11-02 18:00","occupancy": 0.8},{"date": "2021-11-02 19:00","occupancy": 0.9},{"date": "2021-11-02 20:00","occupancy": 1.0},{"date": "2021-11-02 21:00","occupancy": 0.9},{"date": "2021-11-02 22:00","occupancy": 0.8},{"date": "2021-11-02 23:00","occupancy": 0.3},{"date": "2021-11-02 24:00","occupancy": 0.1}]';
            var data = JSON.parse(arr)

            if(dataPoints.length > 0)
                dataPoints = [];

            var max_items = data.length;
            if( nelem == 0 ) {
                max_items = 1;
            }
            else if( nelem == 1 ) {
                max_items = 5;
            }
            if( nelem == 2 ) {
                max_items = 12;
            }

            for(var i = 0; i < max_items; ++i) {
                dataPoints.push({
                    x: new Date(data[i]['date']),
                    y: data[i]['occupancy']
                });
            }    

            chart.render();
        }

        





        
        

        
        // // console.log(JSON.parse(arr));


		

        // if( this.state.req_date ) {
        //     fetch('https://park-and-rail-api.azurewebsites.net/?date={0}', this.state.req_date)
        //     .then(function(response) {
		// 	// return response.json();
            
		// })
		// .then(function(data) {
        //     if(dataPoints.length > 0)
        //         dataPoints = [];

        //     var max_items = data.length;
        //     if( nelem == 0 ) {
        //         max_items = 1;
        //     }
        //     else if( nelem == 1 ) {
        //         max_items = 5;
        //     }
        //     if( nelem == 2 ) {
        //         max_items = 12;
        //     }
		// 	for(var i = 0; i < max_items; ++i) {
        //         dataPoints.push({
        //             x: new Date(data[i]['date']),
        //             y: data[i]['occupancy']
        //         });
        //     }
            
		// 	chart.render();
		// });

        // }
		// fetch('https://canvasjs.com/data/gallery/react/nifty-stock-price.json')
        // fetch('https://data.sbb.ch/api/records/1.0/search/?dataset=park-ride-rapperswil&q=&facet=column_1')
        // fetch('http://localhost:8000/pred_api')
		// .then(function(response) {
		// 	// return response.json();
        //     return JSON.parse(response);
		// })
		// .then(function(data) {
        //     if(dataPoints.length > 0)
        //         dataPoints = [];
		// 	for (var i = 0; i < data['records'].length; i++) {
		// 		dataPoints.push({
        //             // x: new Date(data['records'][i]['fields']['column_1']),
        //             // y: data['records'][i]['fields']['belegungsquote']
		// 			x: new Date(data[i].date),
		// 			y: data[i].occupancy
		// 		});
		// 	}
            
		// 	chart.render();
		// });

	}

    componentDidMount(){
        this.setState({
            current_selection: 0
        })
        this.updateChart(0)
    }

    date_changed = (evt) => {

        var arg = "";

        var day = evt._d.getDate();
        arg = ("{0}", day) + arg;
        if( day < 10 ) {
            arg = "0" + arg;
        }
        
        var month = evt._d.getMonth();
        arg = ("{0}", month+1) + arg;
        if( month < 10 ) {
            arg = "0" + arg;
        }

        var year = evt._d.getFullYear();
        arg = ("{0}", year) + arg;
        
        this.setState({req_date: arg})
        this.setState({
            current_selection: 0
        })

        this.updateSelectedItem(0, true);

        // this.updateChart(0)
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
                    <button className={this.state.current_selection === 0 ? "cocc-button-selected" : "cocc-button"} onClick={() => this.updateSelectedItem(0, false)}>1 Hour</button>
                    <button className={this.state.current_selection === 1 ? "cocc-button-selected" : "cocc-button"} onClick={() => this.updateSelectedItem(1, false)}>5 Hours</button>
                    <button className={this.state.current_selection === 2 ? "cocc-button-selected" : "cocc-button"} onClick={() => this.updateSelectedItem(2, false)}>12 Hours</button>
                </div>

                <div className="cocc-occupancy-container">
                    <CanvasJSChart options = {options} onRef={ref => this.chart = ref}/>    
                </div>

                <Datetime onChange={this.date_changed} />
            </div>
        )
    }
}

export  {CurrentOccupancy};