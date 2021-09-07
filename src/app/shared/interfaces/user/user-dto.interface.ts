export interface UserDTO {
    name:           string;
    username?:      string;
    email:          string;
    rol:            string;
    identification: string;
    type:           string;
    phone?:         string;
    address?:       string;
    image?:         string | null;
}