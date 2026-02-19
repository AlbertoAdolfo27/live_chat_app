export type UserResponseDTO = {
    id: string;
    username: string;
    email: string;
    name: string;
    password: string;
    createdAt: Date;
    updatedAt: Date
}

export type UserSafeResponseDTO = {
    id: string;
    username: string;
    name: string;
    createdAt: Date;
    updatedAt: Date
}   