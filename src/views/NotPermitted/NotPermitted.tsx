import React from 'react';
import {
	makeStyles,
	Typography,
    Card,
    Theme,
	CardContent,
	Button,
    CardActions,
    IconButton,
    CardMedia
} from '@material-ui/core';
import { connectRobin } from '@simplus/robin-react';

import { robins } from '../../robins';
import { ErrorBoundary } from '../../utils/ErrorBoundary';
const { SimplusAuthRobin } = robins;

const useStyles = makeStyles((theme: Theme) => ({
	root: {
		flexGrow: 1,
		marginTop: '20px'
	},
	card: {
        display: 'flex',
    },
    details: {
        display: 'flex',
        flexDirection: 'column',
    },
    content: {
        flex: '1 0 auto',
    },
    cover: {
        width: 151,
    },
    controls: {
        display: 'flex',
        alignItems: 'center',
        paddingLeft: theme.spacing(1),
        paddingBottom: theme.spacing(1),
    },
    playIcon: {
        height: 38,
        width: 38,
    },
}))

@connectRobin([SimplusAuthRobin])
const NotPermitted = (props: any) => {
	const classes = useStyles();

	// Getting selected organization functionality
	// const getLoggedInUser = () => {
	// 	return SimplusAuthRobin.getResult('loggedInUserInfo');
	// }
	// const loggedInUser = getLoggedInUser();
	// const userId = loggedInUser ? loggedInUser.data.id : null;

    const gotoHome = () => {
		props.history.push('/');
    }
    
    const goBack = () => {
		props.history.goBack();
	}

	return (
		<ErrorBoundary>
			<div className={classes.root}>
                <Card className={classes.card}>
                    <CardMedia
                        className={classes.cover}
                        image={`/src/assets/img/oops.png`}
                        title="not-permitted"
                    />
                    <div className={classes.details}>
                        <CardContent className={classes.content}>
                            <Typography component="h5" variant="h5">
                                Not Permitted. :-(
                            </Typography>
                            <Typography variant="subtitle1" color="textSecondary">
                                The page you are looking for has been restricted. If you want to get access. Kindly contact to system Administrator.
                            </Typography>
                        </CardContent>
                        <br />
                        <div className={classes.controls}>
                            <Button size="small" onClick={() => goBack()}>Go Back</Button>
                            <Button size="small" onClick={() => gotoHome()}>Go to Home</Button>
                        </div>
                    </div>
                </Card>
			</div>
		</ErrorBoundary>
	)
};

export default NotPermitted;