# Minute Clock

Minute Clock runs scheduled commands at specified local times. It checks the schedule once per minute and starts matching commands as detached processes.

## Requirements

- Node.js
- Windows, if using `cmd` and `.cmd` batch files as in the example schedule

## Run

From this directory, start the clock with:

```cmd
node minute-clock.js
```

Or run `minute-clock.cmd`.

The clock continues running until its process is stopped. It reads `minute-clock.json` from the same directory on each check.

## Configure the schedule

`minute-clock.json` must contain an array of entries with these fields:

| Field | Type | Description |
| --- | --- | --- |
| `times` | string array | One or more 24-hour times in `HH:mm` format |
| `weekdays` | number array | One or more weekdays: `0` = Sunday through `6` = Saturday |
| `title` | string | Name used in log messages |
| `command` | string | Executable to start |
| `arguments` | string array | Arguments passed to the executable |
| `path` | string | Working directory for the process |

Example:

```json
[
  {
    "times": ["08:45", "11:44"],
    "weekdays": [1, 2, 3, 4, 5],
    "title": "morning plan",
    "command": "cmd",
    "arguments": ["/c", "plan-calendar.cmd"],
    "path": "D:\\Tasks\\plan-calendar"
  }
]
```

For `cmd`, `/c` runs the specified command and exits when it finishes; `/k` runs it and leaves the command prompt open. Use the appropriate option for the behavior you want.

Commands are launched with the configured working directory, detached from Minute Clock, and with standard input/output ignored. The TypeScript definitions for schedule entries are in `minute-clock.json.ts`.
