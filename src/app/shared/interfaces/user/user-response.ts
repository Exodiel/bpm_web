export interface UserResponse {
    id:                  number;
    name:                string;
    username:            string;
    email:               string;
    rol:                 string;
    identification:      string;
    identification_type: string;
    type:                string;
    image:               string | null;
    active:              number;
    phone:               string;
    address:             string;
    created_at:          string;
    updated_at:          string;
}