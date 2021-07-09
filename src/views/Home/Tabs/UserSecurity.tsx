import React, { useEffect } from 'react';
import { Grid, Typography, Paper, List, ListItem, ListItemIcon, ListItemText, ListItemSecondaryAction, IconButton } from '@material-ui/core';
import { SecurityOutlined, CheckCircleTwoTone, CancelTwoTone, ChevronRightOutlined } from '@material-ui/icons';

import { robins } from '../../../robins';
import { ErrorBoundary } from '../../../utils/ErrorBoundary';
const { SimplusAuthRobin } = robins;

//@ts-ignore
@connectRobin([SimplusAuthRobin])
const UserApplications = (props: any) => {
    const [userProfile, setUserProfile] = React.useState<{twoStepVerificationEnabled: boolean}>({
		twoStepVerificationEnabled: false
	});

    // Getting loggedInUser information
	const getLoggedInUser = () => {
		return SimplusAuthRobin.getResult('loggedInUserInfo');
	}
	const loggedInUser = getLoggedInUser();
	const adminId = loggedInUser ? loggedInUser.data.id : null;

    const getAdminInfo = (id) => {
		SimplusAuthRobin.when(SimplusAuthRobin.get('adminUserInfo', `/users/${id}`)).then(() => {
			const userInfo = SimplusAuthRobin.getResult('adminUserInfo').data;
			setUserProfile({
				...userProfile,
				twoStepVerificationEnabled: userInfo.two_step_verification_enabled
			})
		}).catch(err => {
            console.log(err.response.data.message)
		})
	}

    const goTo = (path: string) => {
		props.history.push(path);
	}

    useEffect(() => {
		getAdminInfo(adminId)
	}, [])

    return (<ErrorBoundary>
        <Grid container>
            <Grid item xs={12}>
                <Typography variant='caption' display='block' gutterBottom={true}>
                    Settings and recommendations to help you keep your account secure. 
                </Typography>
            </Grid>
        </Grid>
        <Paper variant="outlined" elevation={2}>
            <Grid container>
                <Grid item xs={12}>
                    <Typography variant='h5' display='block' gutterBottom={true} style={{ padding: '15px'}}>
                        Signing in to Leza
                    </Typography>
                </Grid>
                <Grid item xs={12}>
                    <List component="nav">
                        <ListItem button onClick={() => goTo(`/challenge/pwd`)}>
                            <ListItemIcon>
                                <SecurityOutlined/>
                            </ListItemIcon>
                            <ListItemText
                                primary="2 Step Verification"
                            />
                            <ListItemText
                                primary={
                                    userProfile.twoStepVerificationEnabled ?
                                    <div style={{ display: 'flex' }}>
                                        <div style={{ marginRight: '5px', fontWeight: 'bolder'}}>ON</div>
                                        <div><CheckCircleTwoTone style={{ color: 'green'}}></CheckCircleTwoTone></div>
                                    </div>
                                    :
                                    <div style={{ display: 'flex' }}>
                                        <div style={{ marginRight: '5px', fontWeight: 'bolder'}}>OFF</div>
                                        <div><CancelTwoTone style={{ color: 'red'}}></CancelTwoTone></div>
                                    </div>
                                }
                            />
                            <ListItemSecondaryAction>
                                <IconButton edge="end" aria-label="select" onClick={() => goTo(`/challenge/pwd`)}>
                                    <ChevronRightOutlined />
                                </IconButton>
                            </ListItemSecondaryAction>
                        </ListItem>
                    </List>
                </Grid>
            </Grid>
        </Paper>
    </ErrorBoundary>)
}

export default UserApplications;