import React from 'react';
import Button from '@material-ui/core/Button';
import { Dialog, DialogContent, DialogActions, DialogContentText, DialogTitle } from '@material-ui/core';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core/styles';
import { ErrorBoundary } from 'src/utils/ErrorBoundary';

/**
 * Confirm Modal Component
 * @param props
 */
export default function ConfirmModalComponent(props): JSX.Element {
	const { open, handleClose, heading, submit, subHeading } = props
	const theme = useTheme();
	const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

	return (
		<ErrorBoundary>
			<Dialog
				fullScreen={fullScreen}
				open={open}
				onClose={handleClose}
				aria-labelledby='responsive-dialog-title'>
				<DialogTitle id='responsive-dialog-title'>{heading}</DialogTitle>
				<DialogContent>
					<DialogContentText>
						{subHeading ?  subHeading : 'Are you sure you want to delete it?'}
					</DialogContentText>
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
