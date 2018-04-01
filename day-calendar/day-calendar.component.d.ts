import { ECalendarValue } from '../common/types/calendar-value-enum';
import { SingleCalendarValue } from '../common/types/single-calendar-value';
import { ECalendarMode } from '../common/types/calendar-mode-enum';
import { ChangeDetectorRef, EventEmitter, OnChanges, OnInit, SimpleChange, SimpleChanges } from '@angular/core';
import { DayCalendarService } from './day-calendar.service';
import { Moment, unitOfTime } from 'moment';
import { IDayCalendarConfig, IDayCalendarConfigInternal } from './day-calendar-config.model';
import { IDay } from './day.model';
import { ControlValueAccessor, FormControl, ValidationErrors, Validator } from '@angular/forms';
import { CalendarValue } from '../common/types/calendar-value';
import { UtilsService } from '../common/services/utils/utils.service';
import { IMonthCalendarConfig } from '../month-calendar/month-calendar-config';
import { IMonth } from '../month-calendar/month.model';
import { DateValidator } from '../common/types/validator.type';
import { INavEvent } from '../common/models/navigation-event.model';
export declare class DayCalendarComponent implements OnInit, OnChanges, ControlValueAccessor, Validator {
    readonly dayCalendarService: DayCalendarService;
    readonly utilsService: UtilsService;
    readonly cd: ChangeDetectorRef;
    config: IDayCalendarConfig;
    displayDate: SingleCalendarValue;
    minDate: Moment;
    maxDate: Moment;
    theme: string;
    onSelect: EventEmitter<IDay>;
    onMonthSelect: EventEmitter<IMonth>;
    onNavHeaderBtnClick: EventEmitter<ECalendarMode>;
    onGoToCurrent: EventEmitter<void>;
    onLeftNav: EventEmitter<INavEvent>;
    onRightNav: EventEmitter<INavEvent>;
    CalendarMode: typeof ECalendarMode;
    isInited: boolean;
    componentConfig: IDayCalendarConfigInternal;
    _selected: Moment[];
    weeks: IDay[][];
    weekdays: Moment[];
    _currentDateView: Moment;
    inputValue: CalendarValue;
    inputValueType: ECalendarValue;
    validateFn: DateValidator;
    currentCalendarMode: ECalendarMode;
    monthCalendarConfig: IMonthCalendarConfig;
    _shouldShowCurrent: boolean;
    navLabel: string;
    showLeftNav: boolean;
    showRightNav: boolean;
    api: {
        moveCalendarsBy: any;
        moveCalendarTo: any;
        toggleCalendarMode: any;
    };
    selected: Moment[];
    currentDateView: Moment;
    constructor(dayCalendarService: DayCalendarService, utilsService: UtilsService, cd: ChangeDetectorRef);
    ngOnInit(): void;
    init(): void;
    ngOnChanges(changes: SimpleChanges): void;
    writeValue(value: CalendarValue): void;
    registerOnChange(fn: any): void;
    onChangeCallback(_: any): void;
    registerOnTouched(fn: any): void;
    validate(formControl: FormControl): ValidationErrors | any;
    processOnChangeCallback(value: Moment[]): CalendarValue;
    initValidators(): void;
    dayClicked(day: IDay): void;
    getDayBtnText(day: IDay): string;
    getDayBtnCssClass(day: IDay): {
        [klass: string]: boolean;
    };
    onLeftNavClick(): void;
    onRightNavClick(): void;
    onMonthCalendarLeftClick(change: INavEvent): void;
    onMonthCalendarRightClick(change: INavEvent): void;
    onMonthCalendarSecondaryLeftClick(change: INavEvent): void;
    onMonthCalendarSecondaryRightClick(change: INavEvent): void;
    getWeekdayName(weekday: Moment): string;
    toggleCalendarMode(mode: ECalendarMode): void;
    monthSelected(month: IMonth): void;
    moveCalendarsBy(current: Moment, amount: number, granularity?: unitOfTime.Base): void;
    moveCalendarTo(to: SingleCalendarValue): void;
    shouldShowCurrent(): boolean;
    goToCurrent(): void;
    handleConfigChange(config: SimpleChange): void;
}
