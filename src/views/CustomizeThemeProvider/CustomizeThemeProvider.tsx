import React, { useEffect } from 'react';
import { connectRobin } from '@simplus/robin-react';
import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import { Switch, Route, Redirect } from 'react-router';
import { ErrorBoundary } from 'src/utils/ErrorBoundary';

import Admin from '../../layouts/Admin';
import { robins } from '../../robins';

const { SimplusAuthRobin } = robins; 

@connectRobin([SimplusAuthRobin])
const CustomizeThemeProvider = () => {
    
    useEffect(() => {
	}, [])
    
    return(
        <ErrorBoundary>
                <ThemeProvider theme={createMuiTheme({})}>
                    <Switch>
                        <Route path='/admin' component={Admin} />
                        <Redirect from='/' 
                            to={'/admin/home'}
                        />
                    </Switch>
            </ThemeProvider>                
		</ErrorBoundary>
    )
}

export default CustomizeThemeProvider;