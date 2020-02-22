import React from 'react';
import './App.css';
import Home from './home/Home';
import DefaultView from './defaultView/default'
import {Route} from 'react-router-dom';
function App() {
  return (
 <main>
   <Route path='/' exact component={Home} />
   <Route path='/home' exact component={Home} />
  
  <Route path='/defaultView' exact component={DefaultView} />
  </main>
  );
}

export default App;
