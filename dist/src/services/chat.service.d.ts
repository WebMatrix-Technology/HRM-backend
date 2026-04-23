export declare const chatService: {
    getConversations: (employeeId: string) => Promise<{
        employee: {
            id: string;
            firstName: string;
            lastName: string;
            avatar: string | undefined;
            position: string | undefined;
        };
        lastMessage: {
            id: string;
            message: string;
            type: import("../models/ChatMessage.model").MessageType;
            createdAt: Date;
            sender: {
                id: any;
                firstName: any;
                lastName: any;
            } | undefined;
        } | undefined;
        unreadCount: number;
    }[]>;
    getMessages: (employeeId: string, otherEmployeeId: string, limit?: number, cursor?: string) => Promise<{
        id: any;
        senderId: any;
        receiverId: any;
        message: any;
        type: any;
        fileUrl: any;
        isRead: any;
        createdAt: any;
        sender: {
            id: any;
            firstName: any;
            lastName: any;
            avatar: any;
        } | undefined;
    }[]>;
    getGroups: (employeeId: string) => Promise<any[]>;
    getGroupMessages: (groupId: string, employeeId: string, limit?: number, cursor?: string) => Promise<{
        id: any;
        senderId: any;
        groupId: any;
        message: any;
        type: any;
        fileUrl: any;
        isRead: any;
        createdAt: any;
        sender: {
            id: any;
            firstName: any;
            lastName: any;
            avatar: any;
        } | undefined;
    }[]>;
};
//# sourceMappingURL=chat.service.d.ts.map