import React from 'react';
import './App.css';
import 'react-rangeslider/lib/index.css'

import {Header, Spacer, Locations, OccupancyPopup, SearchBar} from './UIElements.js'
import {EasyPark} from './EasyPark.js'
import {CurrentOccupancy} from './CurrentOccupancy.js'
import {ServiceSelector} from './ServiceSelector.js'
import {ExistingFeature} from './ExistingFeature.js'
import {StartPage} from './StartPage.js'

class App extends React.Component {
  state = {
    current_page: 0,
    occVisible: false,
    started: false
  };

  set_occ_visibile = val => {
    this.setState({
      occVisible: val
     });
  }

  change_page = page => {
    this.setState({
      current_page: page
    });
  }

  close_tutorial = () => {
    this.setState({
      started: true
    });
  }

  render() {
    if(this.state.current_page === 0)
    {
      return (
        <div>
          <div className="App">
            <Header />
            {/* <SearchBar /> */}
            <Spacer />
            <ServiceSelector go_to_service={this.change_page} />
            <Spacer />
            <Locations />
            <Spacer />
            <EasyPark triggerInput={this.set_occ_visibile} />
            {this.state.occVisible ? <OccupancyPopup close={this.set_occ_visibile} /> : null }
    
            <Spacer />
            <CurrentOccupancy />
          </div>

          {this.state.started ? null : <StartPage callback={this.close_tutorial} />}
        </div>
      );
    }
    else if(this.state.current_page === 1) {
      // EasyPark
      return ( 
        <div className="App">
          <Header go_to_service={this.change_page} />
          {/* <SearchBar /> */}
          <Spacer />
          <EasyPark triggerInput={this.set_occ_visibile} />
          {this.state.occVisible ? <OccupancyPopup close={this.set_occ_visibile} /> : null }
        </div>
      );
    }
    else if(this.state.current_page === 2) {
      // Occupancy Estimation
      return ( 
        <div className="App">
          <Header go_to_service={this.change_page} />
          {/* <SearchBar /> */}
          <Spacer />
          <CurrentOccupancy />
        </div>
       );
    }
    else if(this.state.current_page === 3) {
      // Existing Feature
      return ( 
        <div className="App">
          <Header go_to_service={this.change_page} />
          <Spacer />
          <ExistingFeature />
        </div>
       );
    }
  }
  
}

export default App;
