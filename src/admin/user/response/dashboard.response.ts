import { Status } from 'src/common/enum/status.enum';
import { UserRole } from 'src/common/enum/user-role.enum';
import { UserEntity } from 'src/typeOrm/entities/User';

export class DashboardResponseData {
  // Role based Get locations response
  //Defines all the roles
  getAllResponse(allUsers: UserEntity[], role: number) {
    let result: any = [];
    switch (role) {
      case UserRole.SUPERADMIN: //Super Admin
        let totalUsers = allUsers.filter((user) => {
          return Number(user.user_role) == UserRole.USER;
        });
        const totUsers = totalUsers.length;
        //agent role
        const totalAgents = allUsers.filter((user) => {
          return user.user_role === UserRole.AGENT;
        });
        const totAgents = totalAgents.length;

        //organizer role
        const totalOrganizer = allUsers.filter((user) => {
          return user.user_role === UserRole.ORGANIZER;
        });
        const totOrganizer = totalOrganizer.length;

        //subadmin role
        const totalSubadmin = allUsers.filter((user) => {
          return user.user_role === UserRole.SUB_ADMIN;
        });
        const totSubadmin = totalSubadmin.length;
        result = {
          total_users: totUsers,
          total_agents: totAgents,
          total_organizers: totOrganizer,
          total_subadmin: totSubadmin,
        };
        break;
      case UserRole.USER: //USER
        const totalUser = allUsers.filter((user) => {
          return (
            user.user_role === UserRole.USER && user.status === Status.Active
          );
        });
        const totUser = totalUser.length;

        //agent role
        const totalAgent = allUsers.filter((user) => {
          return (
            user.user_role === UserRole.AGENT && user.status === Status.Active
          );
        });
        const totAgent = totalAgent.length;

        //organizer role
        const totalOrganizers = allUsers.filter((user) => {
          return (
            user.user_role === UserRole.ORGANIZER &&
            user.status === Status.Active
          );
        });
        const totOrganizers = totalOrganizers.length;

        //subadmin role
        const totalSubadmins = allUsers.filter((user) => {
          return (
            user.user_role === UserRole.SUB_ADMIN &&
            user.status === Status.Active
          );
        });
        const totSubadmins = totalSubadmins.length;
        result = {
          total_users: totUser,
          total_agents: totAgent,
          total_organizers: totOrganizers,
          total_subadmin: totSubadmins,
        };
        break;
      case 3: //SUB_ADMIN
        const totalUserSub = allUsers.filter((user) => {
          return user.user_role === UserRole.USER && user.status === 1;
        });
        const totUserSub = totalUserSub.length;

        //agent role
        const totalAgentSub = allUsers.filter((user) => {
          return user.user_role === UserRole.AGENT && user.status === 1;
        });
        const totAgentSub = totalAgentSub.length;

        //organizer role
        const totalOrganizerSub = allUsers.filter((user) => {
          return user.user_role === UserRole.ORGANIZER && user.status === 1;
        });
        const totOrganizerSub = totalOrganizerSub.length;

        //subadmin role
        const totalSubadminSub = allUsers.filter((user) => {
          return user.user_role === UserRole.SUB_ADMIN && user.status === 1;
        });
        const totSubadminSub = totalSubadminSub.length;
        result = {
          total_users: totUserSub,
          total_agents: totAgentSub,
          total_organizers: totOrganizerSub,
          total_subadmin: totSubadminSub,
        };
        break;
      case 4: //ORGANIZER
        const totalUserOrg = allUsers.filter((user) => {
          return user.user_role === UserRole.USER && user.status === 1;
        });
        const totUserOrg = totalUserOrg.length;

        //agent role
        const totalAgentOrg = allUsers.filter((user) => {
          return user.user_role === UserRole.AGENT && user.status === 1;
        });
        const totAgentOrg = totalAgentOrg.length;

        //organizer role
        const totalOrganizerOrg = allUsers.filter((user) => {
          return user.user_role === UserRole.ORGANIZER && user.status === 1;
        });
        const totOrganizerOrg = totalOrganizerOrg.length;

        //subadmin role
        const totalSubadminOrg = allUsers.filter((user) => {
          return user.user_role === UserRole.SUB_ADMIN && user.status === 1;
        });
        const totSubadminOrg = totalSubadminOrg.length;
        result = {
          total_users: totUserOrg,
          total_agents: totAgentOrg,
          total_organizers: totOrganizerOrg,
          total_subadmin: totSubadminOrg,
        };
        break;
    }

    return result;
  }
}
