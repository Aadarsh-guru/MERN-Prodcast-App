export type User = {
    id: string;
    email: string;
    avatar?: string;
    name?: string;
    activated: boolean;
    createdAt: Date
};

export type Room = {
    _id: string;
    topic: string;
    roomType: string;
    ownerId: string;
    speakers: {
        _id: string;
        name: string;
        avatar: string | null;
    }[];
};
