export class NotificationMapped {
    id: number;
    title: string;
    topic: string;
    body: string;

    constructor(
        id: number,
        title: string,
        topic: string,
        body: string,
    ) {
       this.id = id;
       this.title = title;
       this.topic = topic;
       this.body = body;
    }
}