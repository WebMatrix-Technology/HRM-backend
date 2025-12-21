export declare const chatService: {
    getConversations: (employeeId: string) => Promise<{
        employee: import("../models/Employee.model").IEmployee & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        };
        lastMessage: (import("../models/ChatMessage.model").IChatMessage & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        }) | null;
        unreadCount: number;
    }[]>;
    getMessages: (employeeId: string, otherEmployeeId: string, limit?: number, cursor?: string) => Promise<(import("../models/ChatMessage.model").IChatMessage & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
    getGroups: (employeeId: string) => Promise<any[]>;
    getGroupMessages: (groupId: string, employeeId: string, limit?: number, cursor?: string) => Promise<(import("../models/ChatMessage.model").IChatMessage & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
};
//# sourceMappingURL=chat.service.d.ts.map