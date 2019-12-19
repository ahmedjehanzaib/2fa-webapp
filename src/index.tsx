import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import { BrowserRouter as Router } from 'react-router-dom';

import CustomizeThemeProvider from './views/CustomizeThemeProvider/CustomizeThemeProvider';
// Robin methods
import { robins } from 'src/robins'
import { RobinProvider } from '@simplus/robin'
import RobinReact from '@simplus/robin-react'
import { ErrorBoundary } from './utils/ErrorBoundary';
const provider = new RobinProvider(robins);
RobinReact.setProvider(provider);


ReactDOM.render(
	<ErrorBoundary>
		<Router>
			<CustomizeThemeProvider />	
		</Router>
	</ErrorBoundary>,
	document.getElementById('my-awesome-app')
);