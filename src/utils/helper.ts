const isObjectValid = (value) => {
    let obj;
    try {
      obj = JSON.parse(value);
    } catch (e) {
      return false;
    }
    return obj;
};

const findIndexOfOneArraytoAnotherArray = (a: [], b: []) => {
  return b.map((bVal) => a.findIndex((aVal) => aVal['id'] === bVal['id']))
}

const matchEndpointWithPermission = (endpointPath: any, userPermissions: any) => {
	// console.log(endpointPath)
	// console.log(userPermissions);
    let allowed = false;
    for (let userPermission of userPermissions) {
        allowed = false;
        let allowedPath = `${userPermission.endpoint.trim()}`.split("/");
        let currentPath = endpointPath.split("/");
        if (allowedPath.length == currentPath.length) {
          for (let [index, item] of allowedPath.entries()) {
            if (!item.includes(":")) {
              if (allowedPath[index] === currentPath[index].split('?')[0]) {
                allowed = true;
              } else {
                allowed = false;
                break
              }
            }
          }
        }
        if (allowed) { 
            // console.log(`Endpoint: ${endpointPath} <===> userPermission endpoint: ${userPermission.endpoint}`)
            break
        }
    }

    return allowed;
}


const matchEndpointWithPermissionForHOC = (endpointPath: any, methodType: any, userPermissions: any) => {
  let allowed = false;
  for (let userPermission of userPermissions) {
      allowed = false;
      if (methodType == userPermission.action_type) {
          let allowedPath = `${userPermission.endpoint.trim()}`.split("/");
          let currentPath = endpointPath.split("/");
          if (allowedPath.length == currentPath.length) {
              for (let [index, item] of allowedPath.entries()) {
                  if (!item.includes(":")) {
                      if (allowedPath[index] === currentPath[index].split('?')[0]) {
                          allowed = true;
                      } else {
                          allowed = false;
                          break
                      }
                  }
              }
          }
      }
      if (allowed) { 
          // console.log(`Method: ${methodType} Endpoint: ${endpointPath} <===> userPermission method: ${userPermission.action_type} userPermission endpoint: ${userPermission.endpoint}`)
          break
      }
  }

  return allowed;
}


export {
    isObjectValid,
    findIndexOfOneArraytoAnotherArray,
    matchEndpointWithPermission,
    matchEndpointWithPermissionForHOC
};