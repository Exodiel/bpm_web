import { UserResponse } from './user/user-response';

export interface LoginResponse {
    user:        UserResponse;
    expiresIn:   number;
    accessToken: string;
}
