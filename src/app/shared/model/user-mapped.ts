export class UserMapped {
    id:                  number;
    name:                string;
    username:            string;
    email:               string;
    rol:                 string;
    identification:      string;
    identification_type: string;
    active:              number;
    phone:               string;
    address:              string;
    image:               string | null;

    constructor(
        name: string,
        email: string,
        rol: string,
        identification: string, 
        image: string | null,
        id: number,
        username: string,
        identification_type: string,
        active: number,
        phone: string,
        address: string
    ) {
        this.name = name;
        this.email = email;
        this.rol = rol;
        this.identification = identification;
        this.image = image;
        this.id = id;
        this.username = username;
        this.identification_type = identification_type;
        this.active = active;
        this.phone = phone;
        this.address = address;
    }
}