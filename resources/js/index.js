import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

const render = <App />;

if (document.getElementById('app')) {
  ReactDOM.render(render, document.getElementById('app'));
}
