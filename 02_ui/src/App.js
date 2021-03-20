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
  constructor (props) {
    super(props)
    this.state = {
      value: 0,
      active: false,
      sliderLabel: "Start"
    }
  }

  handleChange = value => {
    this.setState({
      value: value
    })
  };

  handleChangeComplete = evt => {
    if(!this.state.active) {
      if(this.state.value < 100) {
        this.setState({
          value: 0
        })
      }
      else {
        this.setState({
          active: true,
          sliderLabel: "End"
        })
        this.props.change_park_state(true)
      }
    }
    else if(this.state.active) {
      if(this.state.value > 0) {
        this.setState({
          value: 100
        })
      }
      else {
        this.setState({
          active: false,
          sliderLabel: "Start"
        })
        this.props.change_park_state(false)
      }
    }
  };

  render () {
    const { value } = this.state
    return (
      <div className='sliderContainer'>
        <Slider
          className='slider'
          min={0}
          max={100}
          value={value}
          onChange={this.handleChange}
          onChangeComplete={this.handleChangeComplete}
          handleLabel={this.state.sliderLabel}
          tooltip={false}
        />
      </div>
    )
  }
}

class EasyPark extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      inline_text: () => {return <p>Park at <span className="EPLocationName">Rapperswil Bahnhof</span>.</p>}
    }
  }

  update_park_state = active => {
    if(active) {
      this.setState({
        inline_text: () => {return <p>Your car is currently parked at <span className="EPLocationName">Rapperswil Bahnhof</span>.</p>}
      })
    }
    else {
      this.setState({
        inline_text: () => {return <p>Park at <span className="EPLocationName">Rapperswil Bahnhof</span>.</p>}
      })

      this.props.triggerInput(true);
    }
  }
  
  render() {
    return(
      <div className="item">
        <p className="itemTitle">EasyPark</p>
        <div className="EPLocation">
          <img src="/assets/pin.png" className="pinIcon"/>
          {/* <p>{this.state.inline_text}</p> */}
          {this.state.inline_text()}
        </div>
        <div className="clearFloat"></div>

        <div className="sliderBox" data-content="Nada">
          <Horizontal change_park_state={this.update_park_state} />
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
        <EasyPark triggerInput={this.set_occ_visibile} />
        {this.state.occVisible ? <OccupancyPopup close={this.set_occ_visibile} /> : null }
  
        {/* <div class="btn" onClick={() => {this.set_occ_visibile(true)}}>
          <button>This is button</button>
        </div> */}
      </div>
    );
  }
  
}

export default App;
