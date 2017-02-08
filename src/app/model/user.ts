import { CheckIn } from './checkin';
export class User {
    public displayName: string;
    public photoURL: string;
    public email: string;
    public uid: string;
    public lastCheckIn: CheckIn;
}