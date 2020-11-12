import React from 'react';
import './App.css';
import {
  BrowserRouter as Router,
  Route,
} from "react-router-dom";
import Login from "./components/Login";
import CourseView from "./components/CourseView";
import HomePage from "./components/Home";
import SearchPage from "./components/Search";
import ProfilePage from "./components/Profile";
import Registration from "./components/Registration";

export default function App() {
  return (
      <Router>
        <Route exact path="/" component={HomePage} />
        <Route exact path="/login" component={Login} />
        <Route exact path="/register" component={Registration} />
        <Route exact path="/Search" component={SearchPage} />
        <Route exact path="/Profile" component={ProfilePage} />
        <Route 
          exact path="/course_:id" 
          render={ props => {
            return <CourseView />;
          }}
          component={CourseView}
        />
      </Router>
    
  );
}
 