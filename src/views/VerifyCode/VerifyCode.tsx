import React, { useState, SyntheticEvent } from 'react';
import clsx from 'clsx';
const queryString = require('query-string');
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
import { ErrorBoundary } from '../../utils/ErrorBoundary';
import { SaveOutlined } from '@material-ui/icons';
import CustomizedSnackbars from '../../components/Toast/Toast';
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
const VerifyCode = (props: any) => {
	const classes = useStyles(props);
	const [loading, setLoading] = React.useState(false);
	const [notification, setNotification] = React.useState({
		toastOpen: false,
		toastVariant: undefined,
		toastMessage: undefined
	});
	const [otpCode, setOtpCode] = useState('')

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
		setOtpCode(event.target.value);
	};

	const verifyCode = (event: React.FormEvent) => {
        event.preventDefault();
        const parsed = queryString.parse(props.history.location.search);
        setLoading(true);
		SimplusAuthRobin.when(SimplusAuthRobin.post('verifyOTPCode', `/two-factor-authentication/verify-code`, {
			code: otpCode,
            token: parsed.token
		})).then(() => {
			setLoading(false);
			const updatedInfo = SimplusAuthRobin.getResult('verifyOTPCode');
			console.log(updatedInfo)
			handleToastOpen('success', updatedInfo.message);
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
						2FA Code Verification
					</Typography>
				</Grid>
				<Grid item xs={12}>
					<Typography variant='caption' display='block' gutterBottom={true} style={{ textAlign: 'center'}}>
						Verify your 6 digit OTP code. 
					</Typography>
				</Grid>
			</Grid>
            <Grid container justify='center' alignItems='center'>
			{loading ? <div style={{display: 'flex', justifyContent: 'center', width: '100%'}}><CircularProgress className={classes.progress} /></div> :
			<form className={classes.form} autoComplete='off' onSubmit={verifyCode}>
				<TextField
					variant='outlined'
					margin='normal'
					required
					fullWidth
					id='code'
					label='Enter your OTP code'
					name='code'
					value={otpCode}
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
						Verify OTP
					</Button>
				</div>
			</form>
			}
			</Grid>
		</ErrorBoundary>
	)
};

export default VerifyCode;