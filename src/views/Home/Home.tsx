import React from 'react';
import {
	makeStyles,
	Theme,
	Typography,
	Grid,
	AppBar,
	Tab,
	Tabs,
	Box
} from '@material-ui/core';
import { UserProfile, UserSecurity, UserApplications } from './Tabs';
import { connectRobin } from '@simplus/robin-react';

import { robins } from '../../robins';
import { ErrorBoundary } from 'src/utils/ErrorBoundary';
const { SimplusAuthRobin } = robins;

interface TabPanelProps {
	children?: React.ReactNode;
	index: any;
	value: any;
}

const TabPanel = (props: TabPanelProps) => {
	const { children, value, index, ...other } = props;

	return (
	<Typography
		style={{ flexGrow: 1 }}
		component='div'
		role='tabpanel'
		hidden={value !== index}
		id={`scrollable-auto-tabpanel-${index}`}
		aria-labelledby={`scrollable-auto-tab-${index}`}
		{...other}
	>
		<Box p={3}>{children}</Box>
	</Typography>
	);
}

const a11yProps = (index: any) => {
	return {
		id: `scrollable-auto-tab-${index}`,
		'aria-controls': `scrollable-auto-tabpanel-${index}`,
	};
}

const useStyles = makeStyles((theme: Theme) => ({
	root: {
		display: 'flex',
		justifyContent: 'center',
		flexDirection: 'column',
		'& > *': {
			// margin: theme.spacing(5),
			paddingLeft: '25px',
			paddingRight: '25px',
	},
	},
		bigAvatar: {
		width: 120,
		height: 120,
		margin: '0 auto'
	},
	progress: {
		margin: theme.spacing(2),
	},
}))

//@ts-ignore
@connectRobin([SimplusAuthRobin])
const Home = (props: any) => {
	const classes = useStyles();
	const [value, setValue] = React.useState(0);

	const handleChange = (_event: React.ChangeEvent<{}>, newValue: number) => {
		setValue(newValue);
	}

	// Getting loggedInUser information
	const getLoggedInUser = () => {
		return SimplusAuthRobin.getResult('loggedInUserInfo');
	}
	const loggedInUser = getLoggedInUser();
	const userProfile = loggedInUser.data;

	return (
		<ErrorBoundary>
			<div className={classes.root}>
				<Grid container justify='center' alignItems='center'>
					<Grid item xs={12}>
						<Typography align='center' variant='h5' display='block' gutterBottom={true}>
							Welcome, { userProfile.name }
						</Typography>
					</Grid>
					<Grid item xs={12}>
						<Typography align='center' variant='caption' display='block' gutterBottom={true}>
							Manage your info and security to make Leza work better for you.
						</Typography>
					</Grid>
				</Grid>
				<Grid container>
					<AppBar position='static' color='default' elevation={0}>
						<Tabs
							value={value}
							onChange={handleChange}
							indicatorColor='primary'
							variant='scrollable'
							scrollButtons='auto'
							aria-label='scrollable auto tabs example'
						>
							<Tab label='Profile' {...a11yProps(0)} />
							<Tab label='Security' {...a11yProps(1)} />
							<Tab label='Your Applications' {...a11yProps(2)} />
						</Tabs>
					</AppBar>
					<TabPanel value={value} index={0}>
						<UserProfile />
					</TabPanel>
					<TabPanel value={value} index={1}>
						<UserSecurity {...props}/>
					</TabPanel>
					<TabPanel value={value} index={2}>
						<UserApplications />
					</TabPanel>
				</Grid>
			</div>
		</ErrorBoundary>
	)
};

export default Home;