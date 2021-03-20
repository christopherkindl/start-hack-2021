import React from 'react';
import './CurrentOccupancy.css';

class CurrentOccupancy extends React.Component {
    constructor (props) {
        super(props)
        this.state = {
            current_selection: 0
        }
    }

    updateSelectedItem = evt => {
        if(evt !== this.state.current_selection) {
            if(this.props.updateCarOccupancy) {
                this.props.updateCarOccupancy(evt)
            }
        }

        this.setState({
            current_selection: evt
        })
    }

    render () {
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
                <div className="cocc-occupancy-container"> This be occupancy </div>
            </div>
        )
    }
}

export  {CurrentOccupancy};