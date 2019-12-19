import React from 'react';
import Button from '@material-ui/core/Button';
import { Dialog, DialogContent, DialogActions, DialogTitle, makeStyles, Theme, DialogContentText } from '@material-ui/core';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core/styles';
import { ErrorBoundary } from 'src/utils/ErrorBoundary';

const useStyles = makeStyles((theme: Theme) => ({
	form: {
		width: '100%', // Fix IE 11 issue.
		marginTop: theme.spacing(1),
	},
	submit: {
		margin: theme.spacing(3, 0, 2, 2),
	}
}))

/**
 * Modal Component
 * @param props
 */

export default function ModalComponent(props: any): JSX.Element {
	const { open, handleClose, heading, formFields, submit, subHeading, fullWidth } = props
	const classes = useStyles();
	const theme = useTheme();
	const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

	return (
		<ErrorBoundary>
			<Dialog
				fullScreen={fullScreen}
				fullWidth={ fullWidth || false }
        		maxWidth={'md'}
				open={open}
				onClose={handleClose}
				aria-labelledby='responsive-dialog-title'>
				<DialogTitle id='responsive-dialog-title'>{heading}</DialogTitle>
				<DialogContent>
					<DialogContentText>
						{subHeading}
					</DialogContentText>
					<form className={classes.form} autoComplete='off'>
						{formFields}
					</form>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleClose} color='primary'>
						Cancel
					</Button>
					<Button onClick={submit} color='primary' autoFocus>
						OK
					</Button>
				</DialogActions>
			</Dialog>
		</ErrorBoundary>
	);
}
