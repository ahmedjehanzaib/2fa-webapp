import React, { SyntheticEvent } from 'react';
// import {
// 	Link
//   } from "react-router-dom";
import { connectRobin } from '@simplus/robin-react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import { robins } from '../../robins';
import CustomizedSnackbars from '../../components/Toast/Toast';
import { ErrorBoundary } from 'src/utils/ErrorBoundary';
import { InputAdornment, IconButton } from '@material-ui/core';
import { VisibilityOff, Visibility } from '@material-ui/icons';

const { SimplusAuthRobin } = robins;

const MadeWithLove = () => {
	return (
		<Typography variant='body2' color='textSecondary' align='center'>
			{'Built with love by the '}
			<a href='https://www.simplusinnovation.com/' style={{color: 'rgba(0, 0, 0, 0.54)', textDecoration: 'none'}}>
				<b>Simplus Innovation</b>
			</a>
			{' team.'}
		</Typography>
	);
}

const useStyles = makeStyles(theme => ({
	root: {
		height: '100vh',
	},
	image: {
		backgroundImage: 'url(/src/assets/img/favicon.png)',
		backgroundRepeat: 'no-repeat',
		backgroundSize: '30%',
		backgroundPosition: 'center',
	},
	paper: {
		margin: theme.spacing(8, 4),
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
	},
	bigAvatar: {
		width: 150,
		height: 150,
	},
	form: {
		width: '100%', // Fix IE 11 issue.
		marginTop: theme.spacing(1),
	},
	submit: {
		margin: theme.spacing(3, 0, 2),
	},
}));

interface State {
	userId: string;
	password: string;
	toastOpen: boolean;
	toastVariant: 'error' | 'success' | 'info' | 'warning' | undefined;
	toastMessage: string | undefined;
	showPassword: boolean;
}

@connectRobin([SimplusAuthRobin])
const Password = (props) => {
    // Getting loggedInUser information
	const getLoggedInUser = () => {
		return SimplusAuthRobin.getResult('loggedInUserInfo');
	}
    const loggedInUser = getLoggedInUser();
    
	const classes = useStyles(props);
	const [values, setValues] = React.useState<State>({
		userId: loggedInUser.data && loggedInUser.data.id ? loggedInUser.data.id : '',
		password: '',
		toastOpen: false,
		toastVariant: undefined,
		toastMessage: undefined,
		showPassword: false,
	});

	const handleToastClose = (_event?: SyntheticEvent, reason?: string) => {
		if (reason === 'clickaway') {
			return;
		}

		setValues({...values, toastOpen: false, toastMessage: undefined});
	}

	const handleToastOpen = (toastVariant, toastMessage) => {
		setValues({...values, toastOpen: true, toastVariant: toastVariant, toastMessage: toastMessage});
	}

	const handleChange = (prop: keyof State) => (event: React.ChangeEvent<HTMLInputElement>) => {
		setValues({ ...values, [prop]: event.target.value });
	};

	const VerifyUserPassword = (event: React.FormEvent) => {
        event.preventDefault();
        const user = {
			'userId': values.userId,
			'password': values.password,
        };
        
        SimplusAuthRobin.when(SimplusAuthRobin.post('verifyUserPassword', `/users/verify-user-password`, user)).then(() => {
            const response = SimplusAuthRobin.getResult('verifyUserPassword');
            const securityViewTimePeriod = response.data.securityViewTimePeriod
            props.history.push(`/admin/user/${values.userId}/security/two-step-verification?challenge=${securityViewTimePeriod}`)
		}).catch(err => {
			handleToastOpen('error', err.response.data.message)
        })
	}

	const handleClickShowPassword = () => {
		setValues({ ...values, showPassword: !values.showPassword });
	};
	
	const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
		event.preventDefault();
    };

	return (
		<ErrorBoundary>
            {
				Object.keys(loggedInUser).length > 0 ?
                <Grid container component='main' className={classes.root}>
                    <CustomizedSnackbars open={values.toastOpen} variant={values.toastVariant} message={values.toastMessage} handleToastClose={handleToastClose}/>
                    <CssBaseline />
                    <Grid item xs={false} sm={6} md={6} className={classes.image} />
                    <Grid item xs={12} sm={6} md={6} component={Paper} elevation={6} square>
                        <div className={classes.paper}>
                            <Avatar className={classes.bigAvatar} alt={'simplus-logo'} src={loggedInUser.data.picture_url ? loggedInUser.data.picture_url : 'https://i.ibb.co/2kcsxxB/avatar.png'} />
                            <Grid container justify='center' alignItems='center'>
                                <Grid item xs={12}>
                                    <Typography align='center' variant='h5' display='block' gutterBottom={true}>
                                        Welcome, { loggedInUser.data && loggedInUser.data.name ? loggedInUser.data.name : '' }
                                    </Typography>
                                </Grid>
                                <Grid item xs={12}>
                                    <Typography align='center' variant='caption' display='block' gutterBottom={true}>
                                        To continue, first verify it’s you.
                                    </Typography>
                                </Grid>
                            </Grid>
                            <form className={classes.form} autoComplete='off' onSubmit={VerifyUserPassword}>
                                <TextField
                                    variant='outlined'
                                    margin='normal'
                                    required
                                    fullWidth
                                    name='password'
                                    label='Password'
                                    type={values.showPassword ? 'text' : 'password'}
                                    id='password'
                                    autoComplete='current-password'
                                    onChange={handleChange('password')}
                                    InputProps={{
                                        endAdornment: (
                                        <InputAdornment position='end'>
                                            <IconButton
                                            edge='end'
                                            aria-label='toggle password visibility'
                                            onClick={handleClickShowPassword}
                                            onMouseDown={handleMouseDownPassword}
                                            >
                                            {values.showPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                        ),
                                    }}
                                />
                                <Button
                                    type='submit'
                                    fullWidth
                                    variant='contained'
                                    color='primary'
                                    className={classes.submit}
                                >
                                    Next
                                </Button>
                            </form>
                            <Grid container style={{ textAlign: 'center' }}>
                                {/* <Grid item xs>
                                    <Link to='/forgot-password' style={{color: '#f50057', textDecoration: 'none'}}>
                                        Forgot password?
                                    </Link>
                                </Grid> */}
                                {/* <Grid item>
                                    <Link to="/signup" style={{color: '#f50057', textDecoration: 'none'}}>
                                        {'Dont have an account? Sign Up'}
                                    </Link>
                                </Grid> */}
                            </Grid>
                            <Box mt={5}>
                                <MadeWithLove />
                            </Box>
                        </div>
                    </Grid>
                </Grid>
            :
            'You are not logged in'
        }
		</ErrorBoundary>
	);
}

export default Password;