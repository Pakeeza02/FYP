export class iMessage {
    message: string;
    timestamp: number;
    uid: string;
    image: string;
    key: string;
}

export class iChatNode {
    clientUid: string;
    hostUid: string;
    productId: string;
    messages: any;
    lastDeleted: any;
    chatKey: string;
    lastMessage: string;
    lastMsgTime: number;
}
