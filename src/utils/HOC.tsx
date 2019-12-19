import * as React from 'react';
import { connectRobin } from '@simplus/robin-react';
import { robins } from '../robins';

const { SimplusAuthRobin } = robins;
import { matchEndpointWithPermissionForHOC } from '../utils/helper';

@connectRobin([SimplusAuthRobin])
const HOC = (props) => {
    const {actionRoute, chidStyleProp} = props;
    
    const getLoggedInUser = () => {
		return SimplusAuthRobin.getResult('loggedInUserInfo');
	}
    const loggedInUser = getLoggedInUser();
    
    return(
        <div style={ !matchEndpointWithPermissionForHOC(actionRoute.endpoint, actionRoute.actionType, loggedInUser.data.accessControl) ? chidStyleProp === 'disable' ? { pointerEvents: 'none', opacity: 0.5 } : { display: 'none' } : {}}>
            {React.cloneElement(props.children, {})}
        </div>
    )
}

export {
    HOC
}