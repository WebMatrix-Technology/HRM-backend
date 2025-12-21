import { GroupType } from '../models';
export interface CreateGroupData {
    name: string;
    description?: string;
    type: GroupType;
    memberIds?: string[];
}
export declare const groupService: {
    createGroup: (creatorEmployeeId: string, data: CreateGroupData) => Promise<import("../models").IGroup & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    addMembers: (groupId: string, employeeId: string, memberIds: string[]) => Promise<void>;
    removeMember: (groupId: string, employeeId: string, memberIdToRemove: string) => Promise<void>;
    leaveGroup: (groupId: string, employeeId: string) => Promise<void>;
    deleteGroup: (groupId: string, employeeId: string) => Promise<void>;
};
//# sourceMappingURL=group.service.d.ts.map