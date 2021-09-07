export class OrderMapped {
    id:             number;
    sequential:     string;
    date:           string;
    client:         string;
    clientId:       number;
    type:           string;
    state:          string;
    payment:        string;

    constructor(
        id:             number,
        sequential:     string,
        date:           string,
        client:         string,
        clientId:       number,
        type:           string,
        state:          string,
        payment:        string,
    ) {
        this.id = id;
        this.sequential = sequential;
        this.date = date;
        this.client = client;
        this.clientId = clientId;
        this.type = type;
        this.state = state;
        this.payment = payment;
    }
}