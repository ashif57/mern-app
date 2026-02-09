const allRoles = {
  user: [],
  manager: ['getUsers', 'manageUsers'],
  admin: ['getUsers', 'manageUsers', 'manageOffices'],
};

const roles = Object.keys(allRoles);
const roleRights = new Map(Object.entries(allRoles));

module.exports = {
  roles,
  roleRights,
};
