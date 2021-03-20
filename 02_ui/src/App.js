import React from 'react';
import './App.css';
import 'react-rangeslider/lib/index.css'

import {Header, Spacer, Locations, OccupancyPopup, SearchBar} from './UIElements.js'
import {EasyPark} from './EasyPark.js'
import {CurrentOccupancy} from './CurrentOccupancy.js'

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

        <Spacer />
        <CurrentOccupancy />

  
        {/* <div class="btn" onClick={() => {this.set_occ_visibile(true)}}>
          <button>This is button</button>
        </div> */}
      </div>
    );
  }
  
}

export default App;
