import React, { useEffect, SyntheticEvent } from 'react';
import {
	makeStyles,
	Theme,
	Paper,
	Typography,
	Grid,
	FormControlLabel,
	Switch,
	Divider,
	List,
	ListItem,
	ListItemIcon,
	ListItemSecondaryAction,
	ListItemText,
	IconButton
} from '@material-ui/core';
import { connectRobin } from '@simplus/robin-react';
const queryString = require('query-string');

import { robins } from '../../robins';
import CustomizedSnackbars from '../../components/Toast/Toast';
import { ErrorBoundary } from '../../utils/ErrorBoundary';
import { CheckCircleTwoTone, CancelTwoTone, EmailOutlined, ArrowBackOutlined } from '@material-ui/icons';
const { SimplusAuthRobin } = robins;

const useStyles = makeStyles((theme: Theme) => ({
	root: {
		padding: theme.spacing(3, 2),
	},
	bigAvatar: {
		margin: 10,
		width: 150,
		height: 150,
	},
	progress: {
		margin: theme.spacing(2),
	},
	chip: {
		margin: theme.spacing(1),
	},
	backArrowButton: {
		marginRight: theme.spacing(2),
	},
}))

@connectRobin([SimplusAuthRobin])
const TwoStepVerification = ({...props}) => {
	const classes = useStyles(props);
	const [notification, setNotification] = React.useState({
		toastOpen: false,
		toastVariant: undefined,
		toastMessage: undefined
	});
	const [loading, setLoading] = React.useState(true);
	const [twoStepVerificationSwitch, setTwoStepVerificationSwitch] = React.useState({
		checked: false,
	});
	const [twoStepVerificationTypes, setTwoStepVerificationTypes] = React.useState({
		viaEmail: false,
		viaSms: false,
		viaAuthenticatorApp: false
	})
	const [userInfo, setUserInfo] = React.useState({
		email: ''
	})
	const userId = (props.match && props.match.params.userId) ? props.match.params.userId : undefined;
	
	const handleChange = (event) => {
		setTwoStepVerificationSwitch({ ...twoStepVerificationSwitch, [event.target.name]: event.target.checked });
		const parsed = queryString.parse(props.history.location.search);
		if (parsed.challenge) {
			SimplusAuthRobin.when(SimplusAuthRobin.post('userTwoStepVerificationSwitch', `/users/security/two-step-verification/toggle`, {
				"userId": userId,
				"twoStepVerificationSwitch": event.target.checked,
				"securityViewTimePeriod": parsed.challenge
			})).then(() => {
				const response = SimplusAuthRobin.getResult('userTwoStepVerificationSwitch').data;
				handleToastOpen('success', 'Two step verification setting has been updated!');
				getAdminInfo(userId)
			}).catch(err => {
				if (err.response.status == 400 && err.response.data.error.name == 'TokenExpiredError') {
					handleToastOpen('warning', 'Enter your password again to verify you!')
					setTimeout(() => {
						props.history.push(`/challenge/pwd`)
					}, 2000)
				} else {
					handleToastOpen('error', err.response.data.message)
				}
			})
		} else {
			handleToastOpen('error', 'Invalid request!');
			setTimeout(() => {
				props.history.push(`/challenge/pwd`)
			}, 2000)
		}
	};

	const handleChangeTwoStepVerificationTypes = (event) => {
		setTwoStepVerificationTypes({ ...twoStepVerificationTypes, [event.target.name]: event.target.checked })
		
		SimplusAuthRobin.when(SimplusAuthRobin.post('userTwoStepVerificationTypes', `/users/security/two-step-verification-types/toggle`, {
			"userId": userId,
			"twoStepVerificationTypes": {
				"twoStepVerificationViaSms": twoStepVerificationTypes.viaSms,
				"twoStepVerificationViaEmail": event.target.name == 'viaEmail' ? event.target.checked : false,
				"twoStepVerificationViaAuthenticationApp": twoStepVerificationTypes.viaAuthenticatorApp
			}
		})).then(() => {
			SimplusAuthRobin.getResult('userTwoStepVerificationTypes').data;
			getAdminInfo(userId)
			handleToastOpen('success', 'Two step verification types setting has been updated!');
		}).catch(err => {
			handleToastOpen('error', err.response.data.message)
		})
	}

	const handleToastClose = (_event?: SyntheticEvent, reason?: string) => {
		if (reason === 'clickaway') {
			return;
		}

		setNotification({...notification, toastOpen: false, toastMessage: undefined});
	}

	const handleToastOpen = (toastVariant, toastMessage) => {
		setNotification({...notification, toastOpen: true, toastVariant: toastVariant, toastMessage: toastMessage});
	}

	const handleBackClick = () => {
		props.history.push(`/admin/home`);
	}

	const getAdminInfo = (id: string) => {
		setLoading(true);
		SimplusAuthRobin.when(SimplusAuthRobin.get('adminUserInfo', `/users/${id}`)).then(() => {
			setLoading(false);
			const userInfo = SimplusAuthRobin.getResult('adminUserInfo').data;
			setTwoStepVerificationSwitch({
				checked: userInfo.two_step_verification_enabled ? userInfo.two_step_verification_enabled :  false
			})
			setTwoStepVerificationTypes({
				...twoStepVerificationTypes, viaEmail: userInfo.two_step_verification_via_email ? userInfo.two_step_verification_via_email : false
			})
			setUserInfo({
				email: userInfo.email ? userInfo.email : ''
			})
		}).catch(err => {
			handleToastOpen('error', err.response.data.message)
		})
	}

	useEffect(() => {
		getAdminInfo(userId)
	}, [])

	return (
		<ErrorBoundary>
			{/* {loading ? <div style={{display: 'flex', justifyContent: 'center', width: '100%'}}><CircularProgress className={classes.progress} /></div> : */}
			<Grid container direction='column'>
				<CustomizedSnackbars open={notification.toastOpen} variant={notification.toastVariant} message={notification.toastMessage} handleToastClose={handleToastClose}/>				
				<Grid container justify='center' alignItems='center'>
					<Grid item xs={12}>
						<IconButton edge='start' onClick={handleBackClick} className={classes.backArrowButton} color='inherit' aria-label='menu'>
							<ArrowBackOutlined />
						</IconButton>
						<Typography align='center' variant='h5' display='block' gutterBottom={true}>
							2 Step Verification
						</Typography>
					</Grid>
					<Grid item xs={12} style={{ textAlign: 'center'}}>
						<FormControlLabel
							control={
							<Switch
								checked={twoStepVerificationSwitch.checked}
								onChange={handleChange}
								name="checked"
								color="primary"
							/>
							}
							label={twoStepVerificationSwitch.checked ? 'ON' : 'OFF'}
						/>
					</Grid>
				</Grid>
				{ twoStepVerificationSwitch.checked ? 
				<Grid item xs>
					<Paper className={classes.root}>
						<Grid container>
							<Grid container justify='center' alignItems='center'>
								<Grid item xs={12}>
									<Typography align='center' variant='h5' display='block' gutterBottom={true}>
										Available Second Steps
									</Typography>
								</Grid>
								<Grid item xs={12}>
									<Typography align='center' variant='caption' display='block' gutterBottom={true}>
										A second step verifies its you signing in after entering your password.
									</Typography>
								</Grid>
								<Divider />
								<Grid item xs={12}>
									<Grid container justify='center' alignItems='center'>
										<Grid item xs></Grid>
										<Grid item xs={6}>
											<Paper variant="outlined" elevation={2}>
												<List component="nav">
													<ListItem>
														<ListItemIcon>
															<EmailOutlined/>
														</ListItemIcon>
														<ListItemText
															primary={
																<div>
																	<Typography variant='h5' display='block' gutterBottom={true}>
																		Via Email (Default)
																	</Typography>
																	{
																		true ?
																		<div style={{ display: 'flex' }}>
																			<div style={{ marginRight: '5px'}}>{userInfo.email}</div>
																			<div><CheckCircleTwoTone style={{ color: 'green'}}></CheckCircleTwoTone></div>
																		</div>
																		:
																		<div style={{ display: 'flex' }}>
																			<div style={{ marginRight: '5px'}}>{userInfo.email}</div>
																			<div><CancelTwoTone style={{ color: 'red'}}></CancelTwoTone></div>
																		</div>
																	}
																</div>
															}
															secondary="Verification codes will sent by email."
														/>
														<ListItemSecondaryAction>
															<FormControlLabel
																control={
																<Switch
																	disabled
																	checked={twoStepVerificationTypes.viaEmail}
																	onChange={handleChangeTwoStepVerificationTypes}
																	name="viaEmail"
																	color="primary"
																/>
																}
																label={twoStepVerificationTypes.viaEmail ? 'ON' : 'OFF'}
															/>
														</ListItemSecondaryAction>
													</ListItem>
												</List>
											</Paper>
										</Grid>
										<Grid item xs></Grid>
									</Grid>		
								</Grid>
							</Grid>
						</Grid>
					</Paper>
				</Grid>
				:
				null
				}
			</Grid>
		{/* } */}
		</ErrorBoundary>
	)
};

export default TwoStepVerification;