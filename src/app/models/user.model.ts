export interface User {
    userName: string;
    roleType: string;
}

export interface UserRequestDto extends User {
    password: string;
}