import React from 'react';
import './UIElements.css';
import 'react-rangeslider/lib/index.css'
import {OccupancyCar, OccupancySlider} from './Occupancy.js'

class Header extends React.Component {
    constructor(props) {
        super(props)
    }

    service_clicked = val => {
        if(this.props.go_to_service)
            this.props.go_to_service(val)
    }

    render() {
        if(this.props.go_to_service) {
            return (
                <div className="header">
                    <button className="header_back" onClick={() => this.service_clicked(0)}><img src={"/assets/back_symbol_2.png"} /></button>
                    <p>P+Rail</p>
                    <img src="/assets/SBB_Logo.png" className="logo" alt="logo" />
                </div>
            );
        }
        else {
            return (
                <div className="header">
                    <p>P+Rail</p>
                    <img src="/assets/SBB_Logo.png" className="logo" alt="logo" />
                </div>
            );
        }
    }
}

function Spacer() {
    return (
      <div className="spacer">
      </div>
    );
}

class Locations extends React.Component {
    render() {
        return(
            <div className="item">
            <p className="itemTitle">My P+Rail locations</p>
            <div>
                <p className="loc_p">You can save your favorite locations.</p>
                <a className="createNow">Create now</a>
                <div className="clearFloat"></div>
            </div>
            </div>
        );
    }
  }

function shuffle(array) {
    var curIdx = array.length;
    var tmp, rndIdx;

    while (0 !== curIdx) {
        rndIdx = Math.floor(Math.random() * curIdx);
        curIdx -= 1;

        tmp = array[curIdx];
        array[curIdx] = array[rndIdx];
        array[rndIdx] = tmp;
    }

    return array;
}

class OccupancyPopup extends React.Component {
    state = {
        submitted: false,
        color: "green",
        positions: shuffle([0,1,2,3,4]),
        visibilities: [false, false, false, false, false]
    }

    onSliderEvt = val => {
        switch(val) {
            case 0:
                this.setState({
                    color: "green",
                    positions: shuffle(this.state.positions),
                    visibilities: [false, false, false, false, false]
                });
                break;

            case 20:
                this.setState({
                    color: "green",
                    visibilities: [true, false, false, false, false]
                });
                break;

            case 40:
                this.setState({
                    color: "lightgreen",
                    visibilities: [true, true, false, false, false]
                });
                break;

            case 60:
                this.setState({
                    color: "orange",
                    visibilities: [true, true, true, false, false]
                });
                break;

            case 80:
                this.setState({
                    color: "lightred",
                    visibilities: [true, true, true, true, false]
                });
                break;

            case 100:
                this.setState({
                    color: "red",
                    visibilities: [true, true, true, true, true]
                });
                break;
        }

        
    }

    submit = () => {
        this.setState({submitted: true});
        this.closeSubmit();
    }

    close = () => {
        this.props.close(false);
    }

    closeSubmit = () => {
        setTimeout(() => {
            this.close()
          }, 4000);
    }

    render() {
        return(
            <div className="occContainer">
                <div className="occWindow">
                { this.state.submitted ?

                    <div>
                        <span className="occClose" onClick={this.close}>&times;</span>
                        <p>Thank you for your feedback.</p>
                        <br />
                        <p>You earned 10 points!</p>
                    </div>

                    :

                    <div>
                        <span className="occClose" onClick={this.close}>&times;</span>
                        <p>How full was your parking today?</p>
                        <div className="occParking">
                            <OccupancyCar color={this.state.color} visible={this.state.visibilities[this.state.positions[0]]} />
                            <OccupancyCar color={this.state.color} visible={this.state.visibilities[this.state.positions[1]]} />
                            <OccupancyCar color={this.state.color} visible={this.state.visibilities[this.state.positions[2]]} />
                            <OccupancyCar color={this.state.color} visible={this.state.visibilities[this.state.positions[3]]} />
                            <OccupancyCar color={this.state.color} visible={this.state.visibilities[this.state.positions[4]]} />
                        </div>

                        <Spacer />
                        <br />
                        <OccupancySlider callback={this.onSliderEvt}/>
                        <div className="occSubmit" onClick={() => this.submit()}>
                            <p>Submit</p>
                        </div>
                    </div>
                    
                }

                </div>
            </div>
        );
    }
}

class SearchBar extends React.Component {
    render() {
        return(
        <div className="searchbar">
            <img src="/assets/search.png" className="searchIcon"/>
            <p>Search for P+Rail Location</p>
        </div>
        );
    }
}

export  {Header, Spacer, Locations, OccupancyPopup, SearchBar};
