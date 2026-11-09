export type MinuteClockJson = MinuteClockItem[];

interface MinuteClockItem {
  times: `${number}${number}:${number}${number}`[];
  weekdays: (0 | 1 | 2 | 3 | 4 | 5 | 6)[];
  title: string;
  command: string;
  arguments: string[];
  path: string;
}
