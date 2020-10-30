import React from 'react';
import './App.css';
import {
  BrowserRouter as Router,
  Route,
} from "react-router-dom";
import HomePage from "./components/Home";
import SearchPage from "./components/Search";
import Login from "./components/Login";

export default function App() {
  return (
      <Router>
        <Route exact path="/" component={HomePage} />
        <Route exact path="/login" component={Login} />
        <Route exact path="/Search" component={SearchPage} />
      </Router>
    
  );
}
 