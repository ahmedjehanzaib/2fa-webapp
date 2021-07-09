import React, { useEffect, SyntheticEvent } from 'react';
import clsx from 'clsx';
import { Grid, Typography, TextField, Button, makeStyles, Theme } from '@material-ui/core';
import { SaveTwoTone } from '@material-ui/icons';
import { connectRobin } from '@simplus/robin-react';

import { robins } from '../../../robins';
import CustomizedSnackbars from '../../../components/Toast/Toast';
import { ErrorBoundary } from '../../../utils/ErrorBoundary';
import UserAvatarUpload from '../../../components/UserAvatarUpload/UserAvatarUpload';
const { SimplusAuthRobin } = robins;

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
}))

interface UserProfileState {
	name: string;
	pictureUrl: string;
	contactNo: string;
	address: string;
	twoStepVerificationEnabled: boolean;
}

//@ts-ignore
@connectRobin([SimplusAuthRobin])
const UserProfile = (props: any) => {
    const classes = useStyles(props);
    const [userProfile, setUserProfile] = React.useState<UserProfileState>({
		name: '',
		pictureUrl: '',
		contactNo: '',
		address: '',
		twoStepVerificationEnabled: false
	});

    const [loading, setLoading] = React.useState(true);
	const [notification, setNotification] = React.useState({
		toastOpen: false,
		toastVariant: undefined,
		toastMessage: undefined
	});

    // Getting loggedInUser information
	const getLoggedInUser = () => {
		return SimplusAuthRobin.getResult('loggedInUserInfo');
	}
	const loggedInUser = getLoggedInUser();
	const adminId = loggedInUser ? loggedInUser.data.id : null;

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
				twoStepVerificationEnabled: userInfo.two_step_verification_enabled
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

    const getUserAvatarUrl = (url: string) => {
        setUserProfile({ ...userProfile, pictureUrl: url });
    }

    const onCancel = () => {
		props.history.push('/');
	}

    useEffect(() => {
		getAdminInfo(adminId)
	}, [])

    return (<ErrorBoundary>
        <CustomizedSnackbars open={notification.toastOpen} variant={notification.toastVariant} message={notification.toastMessage} handleToastClose={handleToastClose}/>
        <Grid container>
            <Grid item xs={12}>
                <Typography variant='caption' display='block' gutterBottom={true}>
                    Some basic info, like your name and photo. 
                </Typography>
            </Grid>
        </Grid>
        <UserAvatarUpload userPictureUrl={userProfile.pictureUrl} getUserAvatarUrl={getUserAvatarUrl}/>
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
    </ErrorBoundary>)
}

export default UserProfile;