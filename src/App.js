/**
 * FMC-frontend/src/App.js
 * 
 * Manages mapping from url address to page components.
 * 
 * Author(s):
 * 		Jerry Yu, Roxin Liu
 */

import React from "react";
import {
	BrowserRouter as Router,
	Route,
} from "react-router-dom";

import HomeView from "./components/HomeView"

export default function App() {
	return (
		<Router>
			<Route
				exact path="/"
				render={ props => {
					return <HomeView />;
				}}
			/>
		</Router>
	);
}
