import { DashboardTwoTone } from '@material-ui/icons';
// core components/views for Admin layout
import HomePage from './views/Home/Home';

const dashboardRoutes = [
	{
		path: '/home',
		name: 'Home',
		icon: DashboardTwoTone,
		component: HomePage,
		layout: '/admin'
	}
];

export default dashboardRoutes;
