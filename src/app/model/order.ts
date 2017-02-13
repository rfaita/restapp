export class Order {
    public $key: string;
    public dishName: string;
    public did: string;
    public dishImage: string;
    public table: string;
    public price: number
    public time: number;
    public timeInitDoing: number;
    public timeFinishDoing: number;
    public cid: string;
    public uid: string;
    public status: string = "waiting";
    public destination: string;
}