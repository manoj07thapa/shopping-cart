import React, { Fragment } from 'react';
import { Route, Switch } from 'react-router-dom';
import Home from './components/Home';
function App() {
	return (
		<Fragment className="App">
			<Switch>
				<Route path="/" component={Home} />
			</Switch>
		</Fragment>
	);
}

export default App;
