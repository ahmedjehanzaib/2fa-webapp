import {CollectionRobin} from '@simplus/robin';
const SERVER_URL = ((window as any).APP || {SERVER_URL: ''}).SERVER_URL || '/';

export const robins = {
	SimplusAuthRobin: new CollectionRobin({
		baseUrl: `${SERVER_URL}/api/v1`
	}),
}
