import {CollectionRobin} from '@simplus/robin';
const SIMPLUS_AUTH_ACCOUNT_SERVER_URL = ((window as any).SIMPLUS || {SIMPLUS_AUTH_ACCOUNT_SERVER_URL: ''}).SIMPLUS_AUTH_ACCOUNT_SERVER_URL || '/';

export const robins = {
	SimplusAuthRobin: new CollectionRobin({
		baseUrl: `${SIMPLUS_AUTH_ACCOUNT_SERVER_URL}/api/v1`
	}),
}
