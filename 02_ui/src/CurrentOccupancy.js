import React from 'react';
import './CurrentOccupancy.css';

import CanvasJSReact from './assets/canvasjs.react';
var CanvasJS = CanvasJSReact.CanvasJS;
var CanvasJSChart = CanvasJSReact.CanvasJSChart;

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