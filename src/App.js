import React, { Component } from 'react';
import './styles/foundation.min.css';
import './styles/custom.css';
import Routes from './routes';
import Header from './components/Header/Header';

class App extends Component {

  constructor(){
    super();
    this.state={
      appName: "Google Drive Client"
    }
  }

  render() {
    return (
      <div className="off-canvas-wrapper">
        <div className="off-canvas-wrapper-inner" data-off-canvas-wrapper>
          <div className="off-canvas-content" data-off-canvas-content>
            {/* For Header */}
            <Header name={this.state.appName}/>
            {/* For Routing */}
            <Routes/>
            <hr/>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
