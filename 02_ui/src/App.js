import React from 'react';
import './App.css';
import Slider from 'react-rangeslider'
import 'react-rangeslider/lib/index.css'

import {Header, OccupancyPopup, SearchBar} from './UIElements.js'
import { findAllInRenderedTree } from 'react-dom/test-utils';

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
          <br />
          <p>You can save your favorite locations.</p>
          <p className="createNow">Create now</p>
          <div className="clearFloat"></div>
        </div>
      </div>
    );
  }
}

class Horizontal extends React.Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      value: 0
    }
  }

  handleChange = value => {
    this.setState({
      value: value
    })
  };

  handleChangeComplete = evt => {
    if(this.state.value < 100) {
      this.setState({
        value: 0
      })
    }
  };

  render () {
    const { value } = this.state
    return (
      <div className='slider'>
        <Slider
          min={0}
          max={100}
          value={value}
          onChange={this.handleChange}
          onChangeComplete={this.handleChangeComplete}
          handleLabel={'End'}
          tooltip={false}
        />
        {/* <div className='value'>{value}</div> */}
      </div>
    )
  }
}

class EasyPark extends React.Component {
  updateSlider(evt) {
    if(evt.target.value < 100) {
      evt.target.value = 0
    }
    else {
      alert("chack pot")
    }

    console.log(evt.target.value)
  }

  render() {
    return(
      <div className="item">
        <p className="itemTitle">EasyPark</p>
        <div className="EPLocation">
          <img src="/assets/pin.png" className="pinIcon"/>
          <p>Your car is currently parked at <span className="EPLocationName">Rapperswil Bahnhof</span>.</p>
        </div>
        <div className="clearFloat"></div>

        <div className="sliderBox">
          <Horizontal />
        </div>
      </div>
    );
  }
}

class App extends React.Component {
  state = {
    occVisible: false
  };

  set_occ_visibile = val => {
    this.setState({
      occVisible: val
     });
  }

  render() {
    return (
      <div className="App">
        <Header />
        <SearchBar />
        <Spacer />
        <Locations />
        <Spacer />
        <EasyPark />
        {this.state.occVisible ? <OccupancyPopup close={this.set_occ_visibile} /> : null }
  
        <div class="btn" onClick={() => {this.set_occ_visibile(true)}}>
          <button>This is button</button>
        </div>
      </div>
    );
  }
  
}

export default App;
