import React, { Component } from 'react';

class Header extends Component {
  render() {
    return (
        <div className="callout primary" id="Header">
        <div className="row column">
          {/* Name of the app is getting displayed from here. */}
          <h1>{this.props.name}</h1>
        </div>
      </div>
    );
  }
}

export default Header;
