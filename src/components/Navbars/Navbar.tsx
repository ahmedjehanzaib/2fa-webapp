import React from 'react';
import { connectRobin } from '@simplus/robin-react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import { AccountCircleTwoTone, SettingsApplicationsTwoTone, PowerSettingsNewTwoTone } from '@material-ui/icons';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
// import Cookies from 'universal-cookie';
import { Divider, ListItemAvatar, ListItemText, Avatar, ListItemIcon } from '@material-ui/core';
import { robins } from '../../robins';
import { ErrorBoundary } from 'src/utils/ErrorBoundary';

const { SimplusAuthRobin } = robins;
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
			width: 50,
			height: 50,
		},
	}),
);

/**
 * Header Component
 */
@connectRobin([SimplusAuthRobin])
const Header = ({...props}) => {
	const classes = useStyles();
	const { userInfo  } = props;
	const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
	const open = Boolean(anchorEl);

	const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
		setAnchorEl(event.currentTarget);
	}

	const handleClose = () => {
		setAnchorEl(null);
	}

	const handleLogout = () => {
		window.location.replace(`${window.location.origin}/auth/logout`)
	}
 
	const handleMenuItemClick = (redirectTo) => {
		handleClose()
		props.history.push(redirectTo);
	}

	return (<ErrorBoundary>
		<AppBar
			color='primary'
			position='fixed'
		>
			<Toolbar style={{display: 'flex', justifyContent: 'space-between'}}>
				<div style={{display: 'flex', alignItems: 'center'}}>
					<a
						href='/'
						style={{ textDecoration: 'none' }}
					>
						<Avatar alt={'simplus-logo'} src={'/src/assets/img/simplus-logo.png'} className={classes.bigAvatar} />	
					</a>
					<Typography variant='h6' noWrap>
						AUTH
					</Typography>
				</div>
				<div>
					<IconButton
						aria-label='Account of current user'
						aria-controls='menu-appbar'
						aria-haspopup='true'
						onClick={handleMenu}
						color='inherit'
					>
						<AccountCircleTwoTone />
					</IconButton>
					<Menu
						id='menu-appbar'
						anchorEl={anchorEl}
						anchorOrigin={{
							vertical: 'top',
							horizontal: 'right',
						}}
						keepMounted
						transformOrigin={{
							vertical: 'top',
							horizontal: 'right',
						}}
						open={open}
						onClose={handleClose}
					>
						<MenuItem onClick={() => handleMenuItemClick(`/admin/profile/${userInfo ? userInfo.id : undefined}`)}>
								<ListItemAvatar>
									<Avatar
										alt={'admin name'}
										src={userInfo ? userInfo.picture_url : '/src/assets/img/simplus-logo.png'}
									/>
								</ListItemAvatar>
								<ListItemText
									primary={'Ahmed jehanzaib'}
									secondary={
									<React.Fragment>
										View profile
									</React.Fragment>
									}
								/>
						</MenuItem>
						<Divider light={true} />
						<MenuItem onClick={() => handleMenuItemClick(`/admin/profile/${userInfo ? userInfo.id : undefined}/settings`)}>
							<ListItemIcon>
								<SettingsApplicationsTwoTone />
							</ListItemIcon>
							<ListItemText primary='Account Settings' />
						</MenuItem>
						<Divider light={true} />
						<MenuItem onClick={handleLogout}>
							<ListItemIcon>
								<PowerSettingsNewTwoTone />
							</ListItemIcon>
							<ListItemText primary='Logout' />
						</MenuItem>
					</Menu>
				</div>
			</Toolbar>
		</AppBar>
	</ErrorBoundary>
	);
}

export default Header;