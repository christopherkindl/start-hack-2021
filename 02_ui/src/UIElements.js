import React from 'react';
import './UIElements.css';


class Header extends React.Component {
    render() {
        return (
            <div className="header">
                <p>P+Rail</p>
                <img src="/assets/SBB_Logo.png" className="logo" alt="logo" />
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

export  {Header, SearchBar};
