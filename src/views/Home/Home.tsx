import React, { useState, SyntheticEvent } from 'react';
import clsx from 'clsx';
import {
	Button,
	CircularProgress,
	Grid,
	makeStyles,
	TextField,
	Theme,
	Typography
} from '@material-ui/core';

import { robins } from '../../robins';
import { ErrorBoundary } from 'src/utils/ErrorBoundary';
import { SaveOutlined } from '@material-ui/icons';
import CustomizedSnackbars from 'src/components/Toast/Toast';
import CancelPresentationOutlinedIcon from '@material-ui/icons/CancelPresentationOutlined';
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
	progress: {
		margin: theme.spacing(2),
	},
}))

//@ts-ignore
@connectRobin([SimplusAuthRobin])
const Home = (props: any) => {
	const classes = useStyles();
	const [loading, setLoading] = React.useState(false);
	const [notification, setNotification] = React.useState({
		toastOpen: false,
		toastVariant: undefined,
		toastMessage: undefined
	});
	const [phoneNumber, setPhoneNumber] = useState('')

	const handleToastClose = (_event?: SyntheticEvent, reason?: string) => {
		if (reason === 'clickaway') {
			return;
		}

		setNotification({...notification, toastOpen: false, toastMessage: undefined});
	}

	const handleToastOpen = (toastVariant, toastMessage) => {
		setNotification({...notification, toastOpen: true, toastVariant: toastVariant, toastMessage: toastMessage});
	}

	const handleFormChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setPhoneNumber(event.target.value);
	};

	const sendAndGenrateCode = (event: React.FormEvent) => {
		setLoading(true);
		event.preventDefault();
		SimplusAuthRobin.when(SimplusAuthRobin.post('generateAndSendOTPCode', `/two-factor-authentication/generate-code`, {
			phone_number: phoneNumber
		})).then(() => {
			setLoading(false);
			const updatedInfo = SimplusAuthRobin.getResult('generateAndSendOTPCode');
			handleToastOpen('success', updatedInfo.message);
			console.log(updatedInfo)
			props.history.push(`/admin/verify?token=${updatedInfo.data}`)
			
		}).catch(err => {
			setLoading(false);
			handleToastOpen('error', err.response.data.message)
		})
	}

	const onCancel = () => {
		props.history.push('/')
	}
	

	return (
		<ErrorBoundary>
			<CustomizedSnackbars open={notification.toastOpen} variant={notification.toastVariant} message={notification.toastMessage} handleToastClose={handleToastClose}/>
			<Grid container justify='center' alignItems='center'>
				<Grid item xs={12}>
					<Typography variant='h5' display='block' gutterBottom={true} style={{ textAlign: 'center'}}>
						2FA Code Generation
					</Typography>
				</Grid>
				<Grid item xs={12}>
					<Typography variant='caption' display='block' gutterBottom={true} style={{ textAlign: 'center'}}>
						Generate 6 digit OTP and send it your phone number. 
					</Typography>
				</Grid>
			</Grid>
			<Grid container justify='center' alignItems='center'>
			{loading ? <div style={{display: 'flex', justifyContent: 'center', width: '100%'}}><CircularProgress className={classes.progress} /></div> :
			<form className={classes.form} autoComplete='off' onSubmit={sendAndGenrateCode}>
				<TextField
					variant='outlined'
					margin='normal'
					required
					fullWidth
					id='phone_number'
					label='Enter your phone number'
					name='phone_number'
					value={phoneNumber}
					autoFocus
					onChange={handleFormChange}
				/>
				<div style={{float: 'right'}}>
					<Button
						variant='contained'
						size='medium'
						className={classes.submit}
						color='default'
						onClick={onCancel}
					>
						<CancelPresentationOutlinedIcon className={clsx(classes.leftIcon, classes.iconSmall)} />
						Cancel
					</Button>
					<Button
						variant='contained'
						size='medium'
						className={classes.submit}
						color='primary'
						style={{ color: 'white'}}
						type='submit'
					>
						<SaveOutlined className={clsx(classes.leftIcon, classes.iconSmall)} />
						Send OTP
					</Button>
				</div>
			</form>
			}
			</Grid>
		</ErrorBoundary>
	)
};

export default Home;