import React, { useEffect, SyntheticEvent } from 'react';
import { CheckCircleTwoTone, CancelTwoTone } from '@material-ui/icons';
import {
	makeStyles,
	Theme,
	Paper,
	Typography,
	Grid,
	Avatar,
	CircularProgress
} from '@material-ui/core';
import { connectRobin } from '@simplus/robin-react';

import { robins } from '../../robins';
import CustomizedSnackbars from 'src/components/Toast/Toast';
import { ErrorBoundary } from 'src/utils/ErrorBoundary';
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
}))

interface UserState {
	name: string,
	email: string,
	emailVerifed: boolean,
	pictureUrl: string
}

@connectRobin([SimplusAuthRobin])
const UserProfile = ({...props}) => {
	const classes = useStyles();
	const [notification, setNotification] = React.useState({
		toastOpen: false,
		toastVariant: undefined,
		toastMessage: undefined
	});
	const [loading, setLoading] = React.useState(true);
	const [user, setUser] = React.useState<UserState>({
		name: '',
		email: '',
		emailVerifed: false,
		pictureUrl: ''
	})
	const adminId = (props.match && props.match.params.userId) ? props.match.params.userId : undefined;

	const handleToastClose = (_event?: SyntheticEvent, reason?: string) => {
		if (reason === 'clickaway') {
			return;
		}

		setNotification({...notification, toastOpen: false, toastMessage: undefined});
	}

	const handleToastOpen = (toastVariant, toastMessage) => {
		setNotification({...notification, toastOpen: true, toastVariant: toastVariant, toastMessage: toastMessage});
	}

	useEffect(() => {
		setLoading(true);
		SimplusAuthRobin.when(SimplusAuthRobin.get('adminUserInfo', `/users/${adminId}`)).then(() => {
			setLoading(false);
			const userInfo = SimplusAuthRobin.getResult('adminUserInfo').data;
			setUser({
				...user,
				name: userInfo.name,
				email: userInfo.email,
				emailVerifed: userInfo.email_verified,
				pictureUrl: userInfo.picture_url
			})
		}).catch(err => {
			handleToastOpen('error', err.response.data.message)
		})
	}, [])

	return (
		<ErrorBoundary>
			<Grid container direction='column'>
				<CustomizedSnackbars open={notification.toastOpen} variant={notification.toastVariant} message={notification.toastMessage} handleToastClose={handleToastClose}/>
				<Grid item xs>
					<Typography variant='h5' display='block' gutterBottom={true}>
						Your Profile
					</Typography>
				</Grid>
				{loading ? <div style={{display: 'flex', justifyContent: 'center', width: '100%'}}><CircularProgress className={classes.progress} /></div> :
				<Grid item xs>
					<Paper className={classes.root}>
						<Grid container>
							<Grid item xs={12} sm={12} md={4} lg={4}>
							<Avatar alt={user.name ? user.name : 'simplus-logo'} src={user.pictureUrl ? user.pictureUrl : '/src/assets/img/simplus-logo.png'} className={classes.bigAvatar} />
							</Grid>
							<Grid item xs={12} sm={12} md={8} lg={8}>
								<Grid container>
									<Grid item xs>
										<Grid container direction='column' justify='center' spacing={3}>
											<Grid item xs>
												<Typography variant='caption'>NAME</Typography>
												<Typography variant='h6'>{user.name ? user.name : ''}</Typography>
											</Grid>
											<Grid item xs>
												<Typography variant='caption'>EMAIL</Typography>
												<Typography variant='h6'>{user.email ? user.email : ''}</Typography>
											</Grid>
											<Grid item xs style={{ display: 'flex', flexDirection: 'column'}}>
												<Typography variant='caption'>Email Verified</Typography>
												{
													user.emailVerifed ?
													<CheckCircleTwoTone style={{ color: 'green'}}></CheckCircleTwoTone>
													:
													<CancelTwoTone style={{ color: 'red'}}></CancelTwoTone>
												}
											</Grid>
										</Grid>
									</Grid>
								</Grid>
							</Grid>
						</Grid>
					</Paper>
				</Grid>
				}	
			</Grid>
		</ErrorBoundary>
	)
};

export default UserProfile;