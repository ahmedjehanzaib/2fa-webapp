import React, { useEffect, SyntheticEvent } from 'react';
import clsx from 'clsx';
import axios from 'axios';
import * as uuidv4 from 'uuid/v4';
import { SaveTwoTone, PhotoCamera } from '@material-ui/icons';
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
	CircularProgress,
	Badge,
	IconButton,
	Avatar
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
	contactNo: string;
	address: string;
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
	input: {
		display: 'none',
	},
	bigAvatar: {
		width: 150,
		height: 150,
	},
	fabProgress: {
		position: 'absolute',
		top: 12,
		left: 12,
		zIndex: 1,
	},
}))

@connectRobin([SimplusAuthRobin])
const UserProfileSettings = (props) => {
	const classes = useStyles();
	const [value, setValue] = React.useState(0);
	const [userProfile, setUserProfile] = React.useState<UserProfileState>({
		name: '',
		pictureUrl: '',
		contactNo: '',
		address: ''
	});
	const [loading, setLoading] = React.useState(true);
	const [notification, setNotification] = React.useState({
		toastOpen: false,
		toastVariant: undefined,
		toastMessage: undefined
	});
	const [fileUploading, setfileUploading] = React.useState(false);
	const adminId = (props.match && props.match.params.userId) ? props.match.params.userId : undefined;

	const getAdminInfo = (id) => {
		setLoading(true);
		SimplusAuthRobin.when(SimplusAuthRobin.get('adminUserInfo', `/users/${id}`)).then(() => {
			setLoading(false);
			const userInfo = SimplusAuthRobin.getResult('adminUserInfo').data;
			setUserProfile({
				...userProfile,
				name: userInfo.name,
				pictureUrl: userInfo.picture_url ? userInfo.picture_url : '',
				contactNo: userInfo.meta_data && Object.keys(userInfo.meta_data).length > 0 ? userInfo.meta_data.contact_no : '',
				address: userInfo.meta_data && Object.keys(userInfo.meta_data).length > 0 ? userInfo.meta_data.address : '',
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
			picture_url: userProfile.pictureUrl,
			meta_data: {
				contact_no: userProfile.contactNo,
				address: userProfile.address
			}
		})).then(() => {
			const updatedInfo = SimplusAuthRobin.getResult('updateAdminInfo');
			handleToastOpen('success', updatedInfo.message);
		}).catch(err => {
			handleToastOpen('error', err.response.data.message)
		})
	}

	const onfilechange = (e) => {
		setfileUploading(true);
		const formData = new FormData()
		formData.append('file', e.target.files[0] as any)
		formData.append('public_id', uuidv4())
		formData.append('upload_preset', 'p4f97hzq')
		axios({
			url : '/v1_1/dfprwegge/upload',
			method : 'POST',
			headers : {
				'Content-Type' : 'application/x-www-form-urlencoded'
			},
			baseURL: 'https://api.cloudinary.com',
			data : formData
		}).then( (res) => {
			setUserProfile({ ...userProfile, pictureUrl: res.data.secure_url });
			setfileUploading(false);
		}).catch( () => {
			setfileUploading(false);
			handleToastOpen('error', 'Error in uploading your photo!')
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
		<Grid container justify='center' alignItems='center'>
			<Grid item>
				<Badge
					overlap='circle'
					anchorOrigin={{
						vertical: 'bottom',
						horizontal: 'right',
					}}
					badgeContent={
						<div>
							<input accept="image/*" className={classes.input} id="icon-button-file" type="file" onChange= {onfilechange} />
							<label 
								htmlFor="icon-button-file"
							>
								<IconButton color="default" aria-label="upload picture" component="span">
									<PhotoCamera />
									{fileUploading && <CircularProgress size={24} color="secondary" className={classes.fabProgress} />}
								</IconButton>
							</label>
						</div>
					}
				>
					<Avatar alt={'simplus-logo'} src={userProfile.pictureUrl ? userProfile.pictureUrl : 'https://i.ibb.co/2kcsxxB/avatar.png'} className={classes.bigAvatar}/>
				</Badge>
			</Grid>
		</Grid>
		<Grid container>
			<Grid item xs={12}>
				<Typography variant='h5' display='block' gutterBottom={true}>
					Personal Information
				</Typography>
			</Grid>
			<Grid item xs={12}>
				<Typography variant='caption' display='block' gutterBottom={true}>
					Some basic info, like your name and photo. 
				</Typography>
			</Grid>
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
					{/* <TextField
						variant='filled'
						margin='normal'
						fullWidth
						id='pictureUrl'
						label='Photo'
						type='text'
						value={userProfile.pictureUrl}
						name='Photo'
						autoComplete='pictureUrl'
						onChange={handleFormChange('pictureUrl')}
					/> */}
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
						id='phone'
						label='Phone'
						type='text'
						value={userProfile.contactNo}
						name='Phone'
						autoComplete='Phone'
						onChange={handleFormChange('contactNo')}
					/>
					<TextField
						variant='filled'
						margin='normal'
						fullWidth
						id='address'
						label='Address'
						type='text'
						value={userProfile.address}
						name='address'
						autoComplete='Address'
						onChange={handleFormChange('address')}
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