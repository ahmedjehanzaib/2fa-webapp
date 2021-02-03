import React, { useEffect, SyntheticEvent } from 'react';
import { connectRobin } from '@simplus/robin-react';
import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import { Switch, Route, Redirect } from 'react-router';
import { ErrorBoundary } from 'src/utils/ErrorBoundary';

import Admin from '../../layouts/Admin';
import Password from '../VerifyUser/Password';
import { robins } from '../../robins';
import CustomizedSnackbars from 'src/components/Toast/Toast';

const { SimplusAuthRobin } = robins; 


@connectRobin([SimplusAuthRobin])
const CustomizeThemeProvider = () => {
    const [userInfo, setUserInfo] = React.useState({});
    const [notification, setNotification] = React.useState({
		toastOpen: false,
		toastVariant: undefined,
		toastMessage: undefined
    });
    
    const handleToastClose = (_event?: SyntheticEvent, reason?: string) => {
		if (reason === 'clickaway') {
			return;
		}

		setNotification({...notification, toastOpen: false, toastMessage: undefined});
	}

	const handleToastOpen = (toastVariant, toastMessage) => {
		setNotification({...notification, toastOpen: true, toastVariant: toastVariant, toastMessage: toastMessage});
	}

    const fetchLoggedInUser = () => {
		SimplusAuthRobin.when(SimplusAuthRobin.get('loggedInUserInfo', `/users/info/with-organization`)).then(() => {
            const userInfo = SimplusAuthRobin.getResult('loggedInUserInfo');
            setUserInfo({
                ...userInfo.data
            })
		}).catch(err => {
			handleToastOpen('error', err.response.data.message)
		})
	}
    
    useEffect(() => {
		fetchLoggedInUser()
	}, [])
    
    return(
        <ErrorBoundary>
            <CustomizedSnackbars open={notification.toastOpen} variant={notification.toastVariant} message={notification.toastMessage} handleToastClose={handleToastClose}/>
            {
                Object.keys(userInfo).length > 0 ? 
                <ThemeProvider theme={createMuiTheme({})}>
                        <Switch>
                            <Route path={`/challenge/pwd`} render={(props) => <Password {...props} />} />
                            <Route path='/admin' component={Admin} />
                            <Redirect from='/' 
                                to={'/admin/home'}
                            />
                        </Switch>
                </ThemeProvider> 
                :
                null
            }                
		</ErrorBoundary>
    )
}

export default CustomizeThemeProvider;