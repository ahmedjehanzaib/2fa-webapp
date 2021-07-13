import React from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { Avatar } from '@material-ui/core';
import { ErrorBoundary } from 'src/utils/ErrorBoundary';

// const cookies = new Cookies();
const drawerWidth = 240;
const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		appBar: {
			zIndex: theme.zIndex.drawer + 1,
			transition: theme.transitions.create(['width', 'margin'], {
				easing: theme.transitions.easing.sharp,
				duration: theme.transitions.duration.leavingScreen,
			}),
		},
		appBarShift: {
			marginLeft: drawerWidth,
			width: `calc(100% - ${drawerWidth}px)`,
			transition: theme.transitions.create(['width', 'margin'], {
				easing: theme.transitions.easing.sharp,
				duration: theme.transitions.duration.enteringScreen,
			}),
		},
		menuButton: {
			marginRight: theme.spacing(2),
		},
		hide: {
			display: 'none',
		},
		inline: {
			display: 'inline',
		},
		bigAvatar: {
			margin: 10,
			width: 35,
			height: 35,
		},
	}),
);

/**
 * Header Component
 */
const Header = (_props: any) => {
	const classes = useStyles();

	return (<ErrorBoundary>
		<AppBar
			position='fixed'
		>
			<Toolbar style={{display: 'flex', justifyContent: 'space-between'}}>
				<div style={{display: 'flex', alignItems: 'center'}}>
					<a
						href='/'
						style={{ textDecoration: 'none' }}
					>
						<Avatar alt={'simplus-logo'} src={'/src/assets/img/favicon.png'} className={classes.bigAvatar} />	
					</a>
					<Typography variant='h6' noWrap>
					Two Factor Authentication Application
					</Typography>
				</div>
			</Toolbar>
		</AppBar>
	</ErrorBoundary>
	);
}

export default Header;