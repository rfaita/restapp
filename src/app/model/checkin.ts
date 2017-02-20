export class CheckIn {
    public $key: string;
    public uid: string;
    public userPhotoURL: string;
    public userDisplayName: string;
    public orderCheckInTime: number;
    public checkInTime: number;
    public orderCheckOutTime: number;
    public checkOutTime: number;
    public tid: string;
    public table: string;
    public total: number;
    public closed: boolean = false;
    private _closed_uid: string;

    public static buildIndex(ch: CheckIn): CheckIn {
        ch._closed_uid = "" + ch.closed + ch.uid;
        return ch;
    }
}