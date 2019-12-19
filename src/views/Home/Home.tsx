import React, { useEffect, SyntheticEvent } from 'react';
const url = require('url');
import {
	makeStyles,
	Theme,
	Typography,
	Grid,
	CircularProgress
} from '@material-ui/core';
import { connectRobin } from '@simplus/robin-react';
import Avatar from '@material-ui/core/Avatar';

import { robins } from '../../robins';
import { ErrorBoundary } from 'src/utils/ErrorBoundary';
import CustomizedSnackbars from 'src/components/Toast/Toast';
const { SimplusAuthRobin } = robins;

const useStyles = makeStyles((theme: Theme) => ({
	root: {
		display: 'flex',
		justifyContent: 'center',
		flexDirection: 'column',
		'& > *': {
			// margin: theme.spacing(5),
			paddingLeft: '25px',
			paddingRight: '25px',
	},
	},
		bigAvatar: {
		width: 120,
		height: 120,
		margin: '0 auto'
	},
	progress: {
		margin: theme.spacing(2),
	},
}))

@connectRobin([SimplusAuthRobin])
const Home = (props) => {
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
	return (
		<ErrorBoundary>
			<CustomizedSnackbars open={notification.toastOpen} variant={notification.toastVariant} message={notification.toastMessage} handleToastClose={handleToastClose}/>
			<div className={classes.root}>
				<Grid container direction="row" justify="center" alignItems="center" style={{marginBottom: '3rem'}}>
					<Grid item>
						<Typography variant='h4' gutterBottom={true}>
							APPLICATIONS
						</Typography>
					</Grid>
				</Grid>
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
			</div>
		</ErrorBoundary>
	)
};

export default Home;