import React, { SyntheticEvent } from 'react';
import { Grid, Badge, IconButton, CircularProgress, Avatar, makeStyles, Theme } from '@material-ui/core';
import { PhotoCamera } from '@material-ui/icons';
import * as uuidv4 from 'uuid/v4';
import axios from 'axios';

import { ErrorBoundary } from '../../utils/ErrorBoundary';
import CustomizedSnackbars from '../../components/Toast/Toast';

// Styling
const useStyles = makeStyles((theme: Theme) => ({
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

// Component
const UserAvatarUpload = (props: any) => {
    const classes = useStyles(props);
    const { getUserAvatarUrl, userPictureUrl } = props;
    const [fileUploading, setfileUploading] = React.useState(false);
    const [notification, setNotification] = React.useState({
		toastOpen: false,
		toastVariant: undefined,
		toastMessage: undefined
	});

    const handleToastClose = (_event?: SyntheticEvent, reason?: string) => {
		if (reason === 'clickaway') {
			return;
		}

		setNotification({...notification, toastOpen: false, toastMessage: undefined});
	}

	const handleToastOpen = (toastVariant, toastMessage) => {
		setNotification({...notification, toastOpen: true, toastVariant: toastVariant, toastMessage: toastMessage});
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
			getUserAvatarUrl(res.data.secure_url)
			setfileUploading(false);
		}).catch( () => {
			setfileUploading(false);
			handleToastOpen('error', 'Error in uploading your photo!')
		})
	}



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
					<Avatar alt={'simplus-logo'} src={userPictureUrl ? userPictureUrl : 'https://i.ibb.co/2kcsxxB/avatar.png'} className={classes.bigAvatar}/>
				</Badge>
			</Grid>
		</Grid>
    </ErrorBoundary>)
}

// Exporting
export default UserAvatarUpload;