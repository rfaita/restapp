export class Order {
    public $key: string;
    public dishName: string;
    public did: string;
    public dishImage: string;
    public table: string;
    public price: number;
    public time: number;
    public timeInitDoing: number;
    public timeFinishDoing: number;
    public cid: string;
    public uid: string;
    public status = 'waiting';
    public destination: string;
    private _destination_status: string;

    public static buildIndex(order: Order): Order {

        if (order.status !== undefined && order.destination !== undefined) {
            order._destination_status = '' + order.destination + order.status;
        }
        return order;
    }

}
