import React from 'react';
import './App.css';
import {
  BrowserRouter as Router,
  Route,
} from "react-router-dom";
import Home from "./components/Home"
import Login from "./components/Login"
import CourseView from "./components/CourseView"

export default function App() {
  return (
      <Router>
        <Route 
          exact path="/" 
          component={Home} 
        />
        <Route 
          exact path="/login" 
          component={Login} 
        />
        <Route 
          exact path="/course" 
          component={CourseView}
        />
      </Router>
    
  );
}
 