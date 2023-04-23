export const useGetPermission = (screenPermission, resourceName) => {
  const userPermission_JSON = localStorage.getItem("userPermission");
  const userPermission = JSON.parse(userPermission_JSON);
  var userPermissionOnThisScreen = [];
  userPermission.map((item) => {
    if (item.resource == resourceName) {
      userPermissionOnThisScreen.push(item);
    }
  });
  var result = {};
  userPermissionOnThisScreen.forEach((x) => {
    if (x.permission && screenPermission[x.permission]) {
      result = { ...result, [x.permission]: true };
    } else {
      result = { ...result, [x.permission]: false };
    }
  });
  if (userPermission) {
    result["role"] = userPermission[0].role;
  } else {
    result["role"] = "employee";
  }
  return result;
};
