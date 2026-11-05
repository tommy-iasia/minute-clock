export type MinuteClockTime = `${number}${number}:${number}${number}`;

export interface MinuteClockItem {
  times: MinuteClockTime[];
  title: string;
  command: string;
  arguments: string[];
  path: string;
}

export type MinuteClockSchedule = MinuteClockItem[];
