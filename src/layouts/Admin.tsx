import React  from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import { withRouter } from 'react-router';


import routes from '../routes';
import Navbar from '../components/Navbars/Navbar';
import NotPermitted from '../views/NotPermitted/NotPermitted';
import { robins } from '../robins';
import { ErrorBoundary } from 'src/utils/ErrorBoundary';
const { SimplusAuthRobin } = robins; 


const switchRoutes = (props) => (
	<Switch>
		<Route exact path='/admin/not-permitted' component={NotPermitted} />
		{routes.map((prop, key) => {
				if (prop.layout === '/admin') {
					return (
						<Route
							exact
							history={props.history}
							path={prop.layout + prop.path}
							component={prop.component}
							// component={prop.component}
							key={key}
						/>
					);
				}
				return null;
			})}
		<Redirect from='/admin' to='/admin/home' />
	</Switch>
);

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		root: {
			display: 'flex',
		},
		content: {
			flexGrow: 1,
			padding: theme.spacing(3),
		},
		toolbar: {
			display: 'flex',
			alignItems: 'center',
			justifyContent: 'flex-end',
			padding: '0 8px',
			...theme.mixins.toolbar,
		},
	}),
);

/**
 * App Layout
 */

@connectRobin([SimplusAuthRobin])
const Admin = (props: any): JSX.Element => {
	const classes = useStyles(props);

	return (
		<ErrorBoundary>
			<div className={classes.root}>
				<CssBaseline />
				<Navbar history={props.history} />
				<main className={classes.content}>
					<div className={classes.toolbar} />
					<ErrorBoundary>
						{switchRoutes(props)}
					</ErrorBoundary>
				</main>
			</div>
		</ErrorBoundary>
	);
}

const AdminLayout = withRouter(Admin);
export default AdminLayout;