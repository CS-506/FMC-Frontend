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
  const [loginStat, setLoginStat] = React.useState("WAIT");
  const [userData, setUserData] = React.useState(null);

  function authenticate(loginUser) {
    setLoginStat("LOGGED_IN");
    setUserData(loginUser);
    localStorage.setItem("locLoginStat", "LOGGED_IN");
    localStorage.setItem("locUser", JSON.stringify(loginUser));
  }

  function logout() {
    localStorage.clear("locLoginStat");
    localStorage.clear("locUser");
    setLoginStat("NOT_LOGGED_IN");
    setUserData(null);
  }

  React.useEffect(() => {
    const locLoginStat = localStorage.getItem("locLoginStat");
    const locUser = localStorage.getItem("locUser");
    if (!locLoginStat) {
      setLoginStat("NOT_LOGGED_IN");
    } else if (locLoginStat === "LOGGED_IN") {
      setLoginStat(locLoginStat);
      setUserData(JSON.parse(locUser));
    }
  }, [])

  return (
    <Router>
      <Route 
        exact path="/login"
        render={ props => ( <Login {...props}
            loginStat={loginStat}
            user={userData}
            auth={authenticate}
            logout={logout}
          />
        )}
      />
      <Route 
        exact path="/register"
        render={ props => (
          <Registration {...props}
            loginStat={loginStat}
            user={userData}
            auth={authenticate}
            logout={logout}
          />
        )}
      />
      <Route 
        exact path="/Search"
        render={ props => (
          <SearchPage {...props}
            loginStat={loginStat}
            user={userData}
            auth={authenticate}
            logout={logout}
          />
        )}
      />
      <Route 
        exact path="/Profile"
        render={ props => (
          <ProfilePage {...props}
            loginStat={loginStat}
            user={userData}
            auth={authenticate}
            logout={logout}
          />
        )}
      />
      <Route 
        exact path="/course_:id" 
        render={ props => (
          <CourseView {...props}
            loginStat={loginStat}
            user={userData}
            auth={authenticate}
            logout={logout}
          />
        )}
      />
      <Route 
        exact path="/" 
        render={ props => (
          <HomePage {...props}
            loginStat={loginStat}
            user={userData}
            auth={authenticate}
            logout={logout}
          />
        )} />
    </Router>
  );
}
 