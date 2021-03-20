import React from 'react';
import logo from './SBB_Logo.png';
import lupe from './search.png';
import pin from './pin.png';
import './App.css';
import Slider from 'react-rangeslider'
import 'react-rangeslider/lib/index.css'

class Header extends React.Component {
  render() {
    return (
      <div className="header">
        <p>P+Rail</p>
        <img src={logo} className="logo" alt="logo" />
      </div>
    );
  }
}

class SearchBar extends React.Component {
  render() {
    return(
      <div className="searchbar">
        <img src={lupe} className="searchIcon"/>
        <p>Search for P+Rail Location</p>
      </div>
    );
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
          <img src={pin} className="pinIcon"/>
          <p>Your car is currently parked at <span className="EPLocationName">Rapperswil Bahnhof</span>.</p>
        </div>
        <div className="clearFloat"></div>

        <div className="sliderBox">
          <Horizontal />
        </div>

        {/* <input className="endSlider" type="range" min="1" max="100" defaultValue={0}
        onMouseUp={evt => this.updateSlider(evt)}
        onTouchEnd={evt => this.updateSlider(evt)} /> */}

        

        {/* <p>Search for P+Rail Location</p> */}
      </div>
    );
  }
}

function App() {
  return (
    <div className="App">
      <Header />
      <SearchBar />
      <Spacer />
      <Locations />
      <Spacer />
      <EasyPark />
    </div>
    //   <header className="App-header">
    //     <img src={logo} className="App-logo" alt="logo" />
    //     <p>
    //       Edit <code>src/App.js</code> and save to reload.
    //     </p>
    //     <a
    //       className="App-link"
    //       href="https://reactjs.org"
    //       target="_blank"
    //       rel="noopener noreferrer"
    //     >
    //       Learn React
    //     </a>
    //   </header>
    // </div>
  );
}

export default App;
