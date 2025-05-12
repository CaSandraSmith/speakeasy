// types/react-native-calendar-picker.d.ts

declare module 'react-native-calendar-picker' {
  import { Component } from 'react';
  import { ViewStyle, TextStyle } from 'react-native';

  export interface CalendarPickerProps {
    startFromMonday?: boolean;
    allowRangeSelection?: boolean;
    allowBackwardRangeSelect?: boolean;
    minDate?: Date;
    maxDate?: Date;
    weekdays?: string[];
    months?: string[];
    previousTitle?: string;
    nextTitle?: string;
    todayBackgroundColor?: string;
    selectedDayColor?: string;
    selectedDayTextColor?: string;
    selectedStartDate?: Date | null;
    selectedEndDate?: Date | null;
    scaleFactor?: number;
    textStyle?: TextStyle;
    todayTextStyle?: TextStyle;
    selectedDayStyle?: TextStyle;
    selectedRangeStartStyle?: ViewStyle;
    selectedRangeEndStyle?: ViewStyle;
    selectedRangeStyle?: ViewStyle;
    disabledDates?: Date[];
    selectedDisabledDatesTextStyle?: TextStyle;
    disabledDatesTextStyle?: TextStyle;
    minRangeDuration?: number;
    maxRangeDuration?: number;
    customDatesStyles?: Array<any>;
    customDayHeaderStyles?: (props: {dayOfWeek: number; month: number; year: number}) => {style?: ViewStyle; textStyle?: TextStyle};
    dayLabelsWrapper?: ViewStyle;
    enableSwipe?: boolean;
    enableDateChange?: boolean;
    restrictMonthNavigation?: boolean;
    onDateChange?: (date: Date, type: 'START_DATE' | 'END_DATE') => void;
    onMonthChange?: (date: Date) => void;
    initialDate?: Date;
    width?: number;
    height?: number;
    previousTitleStyle?: TextStyle;
    nextTitleStyle?: TextStyle;
    yearTitleStyle?: TextStyle;
    monthTitleStyle?: TextStyle;
    monthYearHeaderWrapperStyle?: ViewStyle;
    headerWrapperStyle?: ViewStyle;
    dayOfWeekStyles?: {
      [key: number]: ViewStyle | TextStyle;
    };
    customDatesStylesPriority?: 'dayOfWeek' | 'customDates';
  }

  export default class CalendarPicker extends Component<CalendarPickerProps> {}
}
