export interface UserUpdateDTO {
    id:                  number;
    name:                string;
    username?:           string;
    email:               string;
    rol:                 string;
    identification:      string;
    identification_type: string;
    active:              number;
    type:                string;
    phone:               string;
    address:             string;
    image?:              string | null;
}