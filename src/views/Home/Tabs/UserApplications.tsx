import React, { SyntheticEvent, useEffect } from 'react';
import {
    Grid,
    Typography,
    CircularProgress,
    makeStyles,
	Theme
} from '@material-ui/core';
import { connectRobin } from '@simplus/robin-react';
const url = require('url');

import { robins } from '../../../robins';
import CustomizedSnackbars from '../../../components/Toast/Toast';
import { ErrorBoundary } from '../../../utils/ErrorBoundary';
const { SimplusAuthRobin } = robins;

const useStyles = makeStyles((theme: Theme) => ({
	progress: {
		margin: theme.spacing(2),
	},
}))

//@ts-ignore
@connectRobin([SimplusAuthRobin])
const UserApplications = () => {
    const classes = useStyles();
    const [loading, setLoading] = React.useState(false);
    const [applications, setApplications] = React.useState<any>([]);
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

    // Getting loggedInUser information
	const getLoggedInUser = () => {
		return SimplusAuthRobin.getResult('loggedInUserInfo');
	}
	const loggedInUser = getLoggedInUser();
	const userId = loggedInUser ? loggedInUser.data.id : null;

    const fetchUserApplications = (userId: (string | null)) => {
		setLoading(true);
		SimplusAuthRobin.when(SimplusAuthRobin.get('UserApplications', `/users/${userId}/applications`)).then(() => {
			setLoading(false);
			const applications = SimplusAuthRobin.getResult('UserApplications').data;
			setApplications(applications)
		}).catch(err => {
			setLoading(false);
			handleToastOpen('error', err.response.data.message)
		})
	}

    useEffect(() => {
		fetchUserApplications(userId)
	}, [])

    return (<ErrorBoundary>
        <CustomizedSnackbars open={notification.toastOpen} variant={notification.toastVariant} message={notification.toastMessage} handleToastClose={handleToastClose}/>
        {loading ? <div style={{display: 'flex', justifyContent: 'center', width: '100%'}}><CircularProgress className={classes.progress} /></div> :
        <Grid container direction="row" justify="center" alignItems="center" spacing={10}>
            {
                applications && applications.map((app, index) => {
                    if (app.client_name !== 'DAC') {
                        let applicationUrl = app && app.redirect_uris ? url.parse(app.redirect_uris.split(',')[0], true) : '/';
                        return (
                            <Grid item sm={3} key={index}>
                                <a href={`${applicationUrl.protocol}//${applicationUrl.host}`} style={{ textDecoration: 'none' }}>
                                    <div style={{textAlign: 'center'}}>
                                        <img style={{  width: '100px'}} src={app && app.logo_url ? app.logo_url: "/src/assets/img/simplus-logo.png"}/>
                                        {/* <Avatar alt="Remy Sharp" src={app && app.logo_url ? app.logo_url: "/src/assets/img/simplus-logo.png"} className={classes.bigAvatar} /> */}
                                        <Typography variant="subtitle1" display="block" gutterBottom>
                                            {app.client_name}
                                        </Typography>
                                    </div>
                                </a>
                            </Grid>
                        )
                    }
                })
            }
        </Grid>
        }
    </ErrorBoundary>)
}

export default UserApplications;