import TimeSpan from '../util/timespan';

export enum SpeedUpType {
    Construction = 'Construction',
    Healing = 'Healing',
    Research = 'Research',
    Training = 'Training'
}


type Serializable = [
    type: SpeedUpType,
    oneMinute: number, fiveMinute: number,
    oneHour: number, threeHour: number, eightHour: number
];

export class SpeedUpSet {
    type: SpeedUpType;
    oneMinute: number;
    fiveMinute: number;
    oneHour: number;
    threeHour: number;
    eightHour: number;

    constructor(type: SpeedUpType) {
        this.type = type;
        this.oneMinute = 0;
        this.fiveMinute = 0;
        this.oneHour = 0;
        this.threeHour = 0;
        this.eightHour = 0;
    }

    get totalMinutes() {
        return (this.eightHour * 8 + this.threeHour * 3 + this.oneHour) * 60 + this.fiveMinute * 5 + this.oneMinute;
    }

    toTimeSpan() {
        return new TimeSpan(this.totalMinutes * 60);
    }

    copy() {
        return SpeedUpSet.fromSerializable(this.toSerializable());
    }

    toSerializable() {
        return [this.type, this.oneMinute, this.fiveMinute, this.oneHour, this.threeHour, this.eightHour];
    }

    static fromSerializable(data: any) {
        const values = data as Serializable;
        const typeStr = values.shift();
        const set = new SpeedUpSet(typeStr as SpeedUpType);
        set.oneMinute = values.shift() as number;
        set.fiveMinute = values.shift() as number;
        set.oneHour = values.shift() as number;
        set.threeHour = values.shift() as number;
        set.eightHour = values.shift() as number;
        return set;
    }
}
