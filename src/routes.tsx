import { DashboardTwoTone } from '@material-ui/icons';
// core components/views for Admin layout
import HomePage from './views/Home/Home';
import VerifyPage from './views/VerifyCode/VerifyCode'

const dashboardRoutes = [
	{
		path: '/home',
		name: 'Home',
		icon: DashboardTwoTone,
		component: HomePage,
		layout: '/admin'
	},
	{
		path: '/verify',
		name: 'Verify',
		icon: DashboardTwoTone,
		component: VerifyPage,
		layout: '/admin'
	}
];

export default dashboardRoutes;
