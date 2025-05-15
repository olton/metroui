# Calendar Component

The Calendar component provides a versatile and customizable way to display dates, select dates, and manage date-related events. It supports various display modes, date selection options, and styling capabilities.

## Usage

### Basic Calendar

```html
<!-- Basic calendar -->
<div class="calendar" data-role="calendar"></div>

<!-- Calendar with specific date shown -->
<div class="calendar" data-role="calendar" data-show="2023-12-25"></div>

<!-- Calendar with date selection -->
<div class="calendar" data-role="calendar" data-preset="2023-12-25"></div>
```

### Calendar Modes

```html
<!-- Static calendar (non-interactive) -->
<div class="calendar" data-role="calendar" data-static="true"></div>

<!-- Read-only calendar -->
<div class="calendar" data-role="calendar" data-readonly="true"></div>

<!-- Picker mode (for date selection) -->
<div class="calendar" data-role="calendar" data-picker-mode="true"></div>

<!-- Compact calendar -->
<div class="calendar" data-role="calendar" data-compact="true"></div>

<!-- Wide calendar -->
<div class="calendar" data-role="calendar" data-wide="true"></div>
```

### Calendar with Time Selection

```html
<!-- Calendar with time selection -->
<div class="calendar" data-role="calendar" data-show-time="true"></div>

<!-- Calendar with initial time -->
<div class="calendar" data-role="calendar" data-show-time="true" data-initial-time="14:30"></div>
```

### Calendar with Date Constraints

```html
<!-- Calendar with minimum date -->
<div class="calendar" data-role="calendar" data-min-date="2023-01-01"></div>

<!-- Calendar with maximum date -->
<div class="calendar" data-role="calendar" data-max-date="2023-12-31"></div>

<!-- Calendar with excluded dates -->
<div class="calendar" data-role="calendar" data-exclude="2023-12-25,2023-12-26"></div>

<!-- Calendar with excluded days of week (0=Sunday, 6=Saturday) -->
<div class="calendar" data-role="calendar" data-exclude-day="0,6"></div>
```

### Calendar with Events

```html
<!-- Calendar with events -->
<div class="calendar" data-role="calendar" data-events="2023-12-25,2023-12-31"></div>
```

### Calendar with Multiple Date Selection

```html
<!-- Calendar with multiple date selection -->
<div class="calendar" data-role="calendar" data-multi-select="true"></div>

<!-- Calendar with preset selected dates -->
<div class="calendar" data-role="calendar" data-multi-select="true" data-preset="2023-12-25,2023-12-31"></div>
```

## Plugin Options

| Option | Default | Description |
| ------ | ------- | ----------- |
| weekStart | null | First day of week (0 for Sunday, 1 for Monday, etc.) |
| static | false | If true, calendar becomes non-interactive |
| readonly | false | If true, calendar is read-only |
| showGhost | false | If true, shows ghost days from previous/next months |
| events | null | Array or comma-separated string of dates with events |
| startContent | "days" | Initial content to show ("days", "months", "years") |
| showTime | false | If true, shows time selection |
| initialTime | null | Initial time in format "HH:MM" |
| initialHours | null | Initial hours value (0-23) |
| initialMinutes | null | Initial minutes value (0-59) |
| labelTimeHours | null | Custom label for hours |
| labelTimeMinutes | null | Custom label for minutes |
| animationContent | true | If true, enables content animation |
| animationSpeed | 10 | Animation speed in milliseconds |
| dayBorder | false | If true, shows borders around days |
| excludeDay | null | Array or comma-separated string of days to exclude (0-6) |
| prevMonthIcon | "⯇" | Icon for previous month button |
| nextMonthIcon | "⯈" | Icon for next month button |
| prevYearIcon | "⯇" | Icon for previous year button |
| nextYearIcon | "⯈" | Icon for next year button |
| compact | false | If true, shows calendar in compact mode |
| wide | false | If true, shows calendar in wide mode |
| widePoint | null | Breakpoint for wide mode |
| pickerMode | false | If true, enables date picker mode |
| show | null | Date to show initially |
| outside | true | If true, allows selection of days outside current month |
| buttons | "" | Buttons to show in footer ("cancel", "today", "clear", "done") |
| yearsBefore | 100 | Number of years to show before current year |
| yearsAfter | 100 | Number of years to show after current year |
| headerFormat | "dddd, MMM DD" | Format for header date |
| showHeader | true | If true, shows calendar header |
| showFooter | true | If true, shows calendar footer |
| showWeekNumber | false | If true, shows week numbers |
| isDialog | false | If true, calendar is used in dialog mode |
| ripple | false | If true, enables ripple effect |
| rippleColor | "#cccccc" | Color for ripple effect |
| exclude | null | Array or comma-separated string of dates to exclude |
| preset | null | Array or comma-separated string of preset selected dates |
| minDate | null | Minimum selectable date |
| maxDate | null | Maximum selectable date |
| weekDayClick | false | If true, enables clicking on week days |
| weekNumberClick | false | If true, enables clicking on week numbers |
| multiSelect | false | If true, enables multiple date selection |
| special | null | Array or comma-separated string of special dates |
| format | METRO_DATE_FORMAT | Format for date output |
| inputFormat | null | Format for date input |

## API Methods

| Method | Parameters | Return | Description |
| ------ | ---------- | ------ | ----------- |
| getTime | asString (boolean) | Array or String | Gets current time as array [hours, minutes] or string "HH:MM" |
| setTime | time (Array or String) | Object | Sets current time from array [hours, minutes] or string "HH:MM" |
| getPreset | - | Array | Gets preset dates |
| getSelected | - | Array | Gets selected dates |
| getExcluded | - | Array | Gets excluded dates |
| getToday | - | Object | Gets today's date |
| getCurrent | - | Object | Gets current date shown in calendar |
| clearSelected | - | Object | Clears all selected dates |
| toDay | - | Object | Sets calendar to today's date |
| setExclude | exclude (Array or String) | Object | Sets excluded dates |
| setPreset | preset (Array or String) | Object | Sets preset selected dates |
| setSpecial | special (Array or String) | Object | Sets special dates |
| showDate | date (String or Object) | Object | Shows specified date |
| setShow | show (String or Object) | Object | Sets date to show |
| setMinDate | date (String or Object) | Object | Sets minimum selectable date |
| setMaxDate | date (String or Object) | Object | Sets maximum selectable date |
| destroy | - | - | Destroys the calendar component |

## Events

| Event | Description |
| ----- | ----------- |
| onCancel | Triggered when cancel button is clicked |
| onToday | Triggered when today button is clicked |
| onClear | Triggered when clear button is clicked |
| onDone | Triggered when done button is clicked |
| onDayClick | Triggered when a day is clicked |
| onDrawDay | Triggered when a day is drawn |
| onDrawMonth | Triggered when a month is drawn |
| onDrawYear | Triggered when a year is drawn |
| onWeekDayClick | Triggered when a week day is clicked |
| onWeekNumberClick | Triggered when a week number is clicked |
| onMonthChange | Triggered when month is changed |
| onYearChange | Triggered when year is changed |
| onTimeChange | Triggered when time is changed |
| onHoursChange | Triggered when hours are changed |
| onMinutesChange | Triggered when minutes are changed |
| onCalendarCreate | Triggered when calendar is created |

## Styling with CSS Variables

The Calendar component can be styled using the following CSS variables:

| Variable | Default (Light) | Dark Mode | Description |
| -------- | --------------- | --------- | ----------- |
| --calendar-background | #ffffff | #2b2d30 | Background color of the calendar |
| --calendar-header-background | #fafafa | #43454a | Background color of the calendar header |
| --calendar-header-color | #191919 | #dfe1e5 | Text color of the calendar header |
| --calendar-weekday-background | #f8f8f7 | #414245 | Background color of weekday row |
| --calendar-weekday-color | #191919 | #dfe1e5 | Text color of weekday row |
| --calendar-border-color | #dddddd | #414245 | Border color of the calendar |
| --calendar-color | #191919 | #dfe1e5 | Text color of the calendar |
| --calendar-day-border-color | #e8e8e8 | #4a4d51 | Border color of days |
| --calendar-exclude-day-background | #ffffff | #2b2d30 | Background color of excluded days |
| --calendar-exclude-day-color | #aaa | #818181 | Text color of excluded days |
| --calendar-today-day-background | #56c30f | #56c30f | Background color of today |
| --calendar-today-day-color | #fff | #fff | Text color of today |
| --calendar-border-radius | 6px | 6px | Border radius of the calendar |

### Example of Custom Styling

```css
/* Custom styling for a specific calendar */
#myCustomCalendar {
    --calendar-background: #f0f8ff;
    --calendar-header-background: #1e88e5;
    --calendar-header-color: #ffffff;
    --calendar-today-day-background: #ff5722;
    --calendar-border-radius: 12px;
}
```

## Available CSS Classes

### Base Classes
- `.calendar` - Main calendar container
- `.compact` - Compact calendar
- `.day-border` - Calendar with day borders

### Component Classes
- `.calendar-header` - Calendar header
- `.calendar-content` - Calendar content area
- `.calendar-footer` - Calendar footer
- `.calendar-time` - Time selection area

### State Classes
- `.selected` - Selected date
- `.excluded` - Excluded date
- `.today` - Today's date
- `.special` - Special date
- `.outside` - Date outside current month
- `.weekend` - Weekend date

## Accessibility

The Calendar component includes proper semantics for improved accessibility:
- Proper ARIA roles and attributes for interactive elements
- Keyboard navigation support
- Screen reader friendly structure
- High contrast support through CSS variables

## Best Practices

1. Use appropriate date formats for your target audience
2. Provide clear visual indication of selected dates
3. Use the `minDate` and `maxDate` options to limit date selection when appropriate
4. Consider using the `exclude` option for dates that should not be selectable
5. Implement appropriate event handlers to respond to user interactions
6. Use CSS variables for consistent styling across your application