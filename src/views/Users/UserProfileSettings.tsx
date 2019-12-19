import React, { useEffect, SyntheticEvent } from 'react';
import clsx from 'clsx';
import { SaveTwoTone } from '@material-ui/icons';
import {
	makeStyles,
	Theme,
	Grid,
	Typography,
	Box,
	AppBar,
	Tabs,
	Tab,
	TextField,
	Button,
	CircularProgress
} from '@material-ui/core';
import { } from '@material-ui/icons';
import { connectRobin } from '@simplus/robin-react';

import { robins } from '../../robins';
import CustomizedSnackbars from 'src/components/Toast/Toast';
import { ErrorBoundary } from 'src/utils/ErrorBoundary';
const { SimplusAuthRobin } = robins;


interface TabPanelProps {
	children?: React.ReactNode;
	index: any;
	value: any;
}

interface UserProfileState {
	name: string;
	pictureUrl: string;
}

const TabPanel = (props: TabPanelProps) => {
	const { children, value, index, ...other } = props;

	return (
	<Typography
		style={{ flexGrow: 1 }}
		component='div'
		role='tabpanel'
		hidden={value !== index}
		id={`scrollable-auto-tabpanel-${index}`}
		aria-labelledby={`scrollable-auto-tab-${index}`}
		{...other}
	>
		<Box p={3}>{children}</Box>
	</Typography>
	);
}

const a11yProps = (index: any) => {
	return {
		id: `scrollable-auto-tab-${index}`,
		'aria-controls': `scrollable-auto-tabpanel-${index}`,
	};
}

const useStyles = makeStyles((theme: Theme) => ({
	form: {
		width: '100%', // Fix IE 11 issue.
		marginTop: theme.spacing(1),
	},
	submit: {
		margin: theme.spacing(3, 0, 2, 2),
	},
	leftIcon: {
		marginRight: theme.spacing(1),
	},
	iconSmall: {
		fontSize: 20,
	},
	progress: {
		margin: theme.spacing(2),
	},
}))

@connectRobin([SimplusAuthRobin])
const UserProfileSettings = (props) => {
	const classes = useStyles();
	const [value, setValue] = React.useState(0);
	const [userProfile, setUserProfile] = React.useState<UserProfileState>({
		name: '',
		pictureUrl: ''
	});
	const [loading, setLoading] = React.useState(true);
	const [notification, setNotification] = React.useState({
		toastOpen: false,
		toastVariant: undefined,
		toastMessage: undefined
	});
	const adminId = (props.match && props.match.params.userId) ? props.match.params.userId : undefined;

	const getAdminInfo = (id) => {
		setLoading(true);
		SimplusAuthRobin.when(SimplusAuthRobin.get('adminUserInfo', `/users/${id}`)).then(() => {
			setLoading(false);
			const userInfo = SimplusAuthRobin.getResult('adminUserInfo').data;
			setUserProfile({
				...userProfile,
				name: userInfo.name,
				pictureUrl: userInfo.picture_url ? userInfo.picture_url : ''
			})
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

	const handleChange = (_event: React.ChangeEvent<{}>, newValue: number) => {
		setValue(newValue);
	}

	const handleFormChange = (prop: keyof UserProfileState) => (event: React.ChangeEvent<HTMLInputElement>) => {
		setUserProfile({ ...userProfile, [prop]: event.target.value });
	};


	const submitUserProfileSettings = (event: React.FormEvent) => {
		event.preventDefault();
		SimplusAuthRobin.when(SimplusAuthRobin.put('updateAdminInfo', `/users/${adminId}`, {
			name: userProfile.name,
			picture_url: userProfile.pictureUrl
		})).then(() => {
			const updatedInfo = SimplusAuthRobin.getResult('updateAdminInfo');
			handleToastOpen('success', updatedInfo.message);
		}).catch(err => {
			handleToastOpen('error', err.response.data.message)
		})
	}

	const onCancel = () => {
		getAdminInfo(adminId)
	}

	useEffect(() => {
		getAdminInfo(adminId)
	}, [])
	return (<ErrorBoundary>
		<CustomizedSnackbars open={notification.toastOpen} variant={notification.toastVariant} message={notification.toastMessage} handleToastClose={handleToastClose}/>
		<Grid container>
			<Typography variant='h5' display='block' gutterBottom={true}>
				Your Profile Settings
			</Typography>
		</Grid>
		<Grid container>
			<AppBar position='static' color='default'>
				<Tabs
				value={value}
				onChange={handleChange}
				indicatorColor='primary'
				variant='scrollable'
				scrollButtons='auto'
				aria-label='scrollable auto tabs example'
				>
					<Tab label='Profile' {...a11yProps(0)} />
				</Tabs>
			</AppBar>
		{loading ? <div style={{display: 'flex', justifyContent: 'center', width: '100%'}}><CircularProgress className={classes.progress} /></div> :
			<TabPanel value={value} index={0}>
				<form className={classes.form} autoComplete='off' onSubmit={submitUserProfileSettings}>
					<TextField
						variant='filled'
						margin='normal'
						required
						fullWidth
						id='name'
						label='Name'
						type='name'
						name='name'
						value={userProfile.name}
						autoComplete='name'
						autoFocus
						onChange={handleFormChange('name')}
					/>
					<TextField
						variant='filled'
						margin='normal'
						fullWidth
						id='pictureUrl'
						label='pictureUrl'
						type='text'
						value={userProfile.pictureUrl}
						name='pictureUrl'
						autoComplete='pictureUrl'
						onChange={handleFormChange('pictureUrl')}
					/>
					<div style={{float: 'right'}}>
						<Button
							variant='contained'
							size='medium'
							className={classes.submit}
							color='default'
							onClick={onCancel}
						>
							<SaveTwoTone className={clsx(classes.leftIcon, classes.iconSmall)} />
							Cancel
						</Button>
						<Button
							variant='contained'
							size='medium'
							className={classes.submit}
							color='primary'
							type='submit'
						>
							<SaveTwoTone className={clsx(classes.leftIcon, classes.iconSmall)} />
							Save
						</Button>
					</div>
				</form>
			</TabPanel>
		}
		</Grid>
	</ErrorBoundary>);
};

export default UserProfileSettings;