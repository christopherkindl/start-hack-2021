import React from 'react';
import Slider from 'react-rangeslider'
import 'react-rangeslider/lib/index.css'
import './Occupancy.css';

class OccupancyCar extends React.Component {
    render() {
        return(
            <div className="occCar" id={this.props.color}>
                {this.props.visible ? <img src={"/assets/car_" + this.props.color + ".png"} /> : null}
            </div>
        );
    }
}

class OccupancySlider extends React.Component {
    state = {
        value: 0
    }
    
    valChanged = val => {
        this.setState({
            value: val
        });

        this.props.callback(val);
    };

    render() {
        const labels = {
            0:  '0%',
            20: '20%',
            40: '40%',
            60: '60%',
            80: '80%',
            100: '100%'
          }

        return(
            <div className="occSlider">
                <Slider
                    min={0}
                    max={100}
                    step={20}
                    value={this.state.value}
                    onChange={this.valChanged}
                    onChangeComplete={this.handleChangeComplete}
                    tooltip={false}
                    labels={labels}
                />
            </div>
        );
    }

}

export {OccupancyCar, OccupancySlider};
