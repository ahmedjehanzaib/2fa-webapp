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
import { Container, CssBaseline, Avatar, Typography, Button, CircularProgress, makeStyles, Theme } from '@material-ui/core';

const { SimplusAuthRobin } = robins; 

const useStyles = makeStyles((theme: Theme) => ({
	progress: {
		margin: theme.spacing(2),
	}
}));

@connectRobin([SimplusAuthRobin])
const CustomizeThemeProvider = () => {
    const classes = useStyles({});

    const [userInfo, setUserInfo] = React.useState({});
    const [loading, setLoading] = React.useState(false);
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
        setLoading(true);
		SimplusAuthRobin.when(SimplusAuthRobin.get('loggedInUserInfo', `/users/info/with-organization`)).then(() => {
            setLoading(false);
            const userInfo = SimplusAuthRobin.getResult('loggedInUserInfo');
            setUserInfo({
                ...userInfo.data
            })
		}).catch(err => {
            setLoading(false);
			handleToastOpen('error', err.response.data.message)
		})
	}

    const handleLogout = () => {
        window.location.replace(`${window.location.origin}/auth/logout`)
    }
    
    useEffect(() => {
		fetchLoggedInUser()
	}, [])
    
    return(
        <ErrorBoundary>
            <CustomizedSnackbars open={notification.toastOpen} variant={notification.toastVariant} message={notification.toastMessage} handleToastClose={handleToastClose}/>
            {
                loading ? <div style={{display: 'flex', justifyContent: 'center', width: '100%'}}><CircularProgress className={classes.progress} /></div> :
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
                <Container component="main" fixed style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                    <CssBaseline />
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                        <Avatar alt='403' variant='square' src='/src/assets/img/403.png' style={{ width: 'auto', height: '300px'}} />
                        <Typography component='h5' variant='h5' style={{marginTop: '1rem'}}>
                                403
                        </Typography>
                        <Typography variant='subtitle1' color='textSecondary' style={{margin: '1rem 0'}}>
                            Sorry, the page you are looking for has been restricted. If you want to get access, kindly contact system administrator.
                        </Typography>
                        <Button variant='contained' color='primary' size='medium' onClick={handleLogout}>Logout</Button>
                    </div>
                </Container>
            }                
		</ErrorBoundary>
    )
}

export default CustomizeThemeProvider;