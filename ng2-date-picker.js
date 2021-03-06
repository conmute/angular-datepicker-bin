import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ComponentFactoryResolver, Directive, ElementRef, EventEmitter, HostBinding, HostListener, Injectable, Input, NgModule, Optional, Output, Renderer, ViewChild, ViewContainerRef, ViewEncapsulation, forwardRef } from '@angular/core';
import { FormsModule, NG_VALIDATORS, NG_VALUE_ACCESSOR, NgControl } from '@angular/forms';
import { CommonModule } from '@angular/common';
import * as momentNs from 'moment';

let ECalendarMode = {};
ECalendarMode.Day = 0;
ECalendarMode.DayTime = 1;
ECalendarMode.Month = 2;
ECalendarMode.Time = 3;
ECalendarMode[ECalendarMode.Day] = "Day";
ECalendarMode[ECalendarMode.DayTime] = "DayTime";
ECalendarMode[ECalendarMode.Month] = "Month";
ECalendarMode[ECalendarMode.Time] = "Time";

let ECalendarValue = {};
ECalendarValue.Moment = 1;
ECalendarValue.MomentArr = 2;
ECalendarValue.String = 3;
ECalendarValue.StringArr = 4;
ECalendarValue[ECalendarValue.Moment] = "Moment";
ECalendarValue[ECalendarValue.MomentArr] = "MomentArr";
ECalendarValue[ECalendarValue.String] = "String";
ECalendarValue[ECalendarValue.StringArr] = "StringArr";

class DomHelper {
    /**
     * @param {?} element
     * @param {?} container
     * @param {?} anchor
     * @param {?} drops
     * @return {?}
     */
    static setYAxisPosition(element, container, anchor, drops) {
        const /** @type {?} */ anchorRect = anchor.getBoundingClientRect();
        const /** @type {?} */ containerRect = container.getBoundingClientRect();
        const /** @type {?} */ bottom = anchorRect.bottom - containerRect.top;
        const /** @type {?} */ top = anchorRect.top - containerRect.top;
        if (drops === 'down') {
            element.style.top = (bottom + 1 + 'px');
        }
        else {
            element.style.top = (top - 1 - element.scrollHeight) + 'px';
        }
    }
    /**
     * @param {?} element
     * @param {?} container
     * @param {?} anchor
     * @param {?} dimElem
     * @param {?} opens
     * @return {?}
     */
    static setXAxisPosition(element, container, anchor, dimElem, opens) {
        const /** @type {?} */ anchorRect = anchor.getBoundingClientRect();
        const /** @type {?} */ containerRect = container.getBoundingClientRect();
        const /** @type {?} */ left = anchorRect.left - containerRect.left;
        if (opens === 'right') {
            element.style.left = left + 'px';
        }
        else {
            element.style.left = left - dimElem.offsetWidth + anchor.offsetWidth + 'px';
        }
    }
    /**
     * @param {?} el
     * @return {?}
     */
    static isTopInView(el) {
        const { top } = el.getBoundingClientRect();
        return (top >= 0);
    }
    /**
     * @param {?} el
     * @return {?}
     */
    static isBottomInView(el) {
        const { bottom } = el.getBoundingClientRect();
        return (bottom <= window.innerHeight);
    }
    /**
     * @param {?} el
     * @return {?}
     */
    static isLeftInView(el) {
        const { left } = el.getBoundingClientRect();
        return (left >= 0);
    }
    /**
     * @param {?} el
     * @return {?}
     */
    static isRightInView(el) {
        const { right } = el.getBoundingClientRect();
        return (right <= window.innerWidth);
    }
    /**
     * @param {?} config
     * @return {?}
     */
    appendElementToPosition(config) {
        const { container, element } = config;
        if (!container.style.position || container.style.position === 'static') {
            container.style.position = 'relative';
        }
        if (element.style.position !== 'absolute') {
            element.style.position = 'absolute';
        }
        element.style.visibility = 'hidden';
        setTimeout(() => {
            this.setElementPosition(config);
            element.style.visibility = 'visible';
        });
    }
    /**
     * @param {?} __0
     * @return {?}
     */
    setElementPosition({ element, container, anchor, dimElem, drops, opens }) {
        DomHelper.setYAxisPosition(element, container, anchor, 'down');
        DomHelper.setXAxisPosition(element, container, anchor, dimElem, 'right');
        if (drops !== 'down' && drops !== 'up') {
            if (DomHelper.isBottomInView(dimElem)) {
                DomHelper.setYAxisPosition(element, container, anchor, 'down');
            }
            else if (DomHelper.isTopInView(dimElem)) {
                DomHelper.setYAxisPosition(element, container, anchor, 'up');
            }
        }
        else {
            DomHelper.setYAxisPosition(element, container, anchor, drops);
        }
        if (opens !== 'left' && opens !== 'right') {
            if (DomHelper.isRightInView(dimElem)) {
                DomHelper.setXAxisPosition(element, container, anchor, dimElem, 'right');
            }
            else if (DomHelper.isLeftInView(dimElem)) {
                DomHelper.setXAxisPosition(element, container, anchor, dimElem, 'left');
            }
        }
        else {
            DomHelper.setXAxisPosition(element, container, anchor, dimElem, opens);
        }
    }
}
DomHelper.decorators = [
    { type: Injectable },
];
/**
 * @nocollapse
 */
DomHelper.ctorParameters = () => [];

const moment = momentNs;
class UtilsService {
    /**
     * @param {?} func
     * @param {?} wait
     * @return {?}
     */
    static debounce(func, wait) {
        let /** @type {?} */ timeout;
        return function () {
            const /** @type {?} */ context = this, /** @type {?} */ args = arguments;
            timeout = clearTimeout(timeout);
            setTimeout(() => {
                func.apply(context, args);
            }, wait);
        };
    }
    ;
    /**
     * @param {?} size
     * @return {?}
     */
    createArray(size) {
        return new Array(size).fill(1);
    }
    /**
     * @param {?} date
     * @param {?} format
     * @return {?}
     */
    convertToMoment(date, format) {
        if (!date) {
            return null;
        }
        else if (typeof date === 'string') {
            return moment(date, format);
        }
        else {
            return date.clone();
        }
    }
    /**
     * @param {?} date
     * @param {?} format
     * @return {?}
     */
    isDateValid(date, format) {
        if (date === '') {
            return true;
        }
        return moment(date, format, true).isValid();
    }
    /**
     * @param {?} current
     * @param {?} selected
     * @param {?} allowMultiSelect
     * @param {?} minDate
     * @return {?}
     */
    getDefaultDisplayDate(current, selected, allowMultiSelect, minDate) {
        if (current) {
            return current.clone();
        }
        else if (minDate && minDate.isAfter(moment())) {
            return minDate.clone();
        }
        else if (allowMultiSelect) {
            if (selected && selected[selected.length]) {
                return selected[selected.length].clone();
            }
        }
        else if (selected && selected[0]) {
            return selected[0].clone();
        }
        return moment();
    }
    /**
     * @param {?} value
     * @param {?} allowMultiSelect
     * @return {?}
     */
    getInputType(value, allowMultiSelect) {
        if (Array.isArray(value)) {
            if (!value.length) {
                return ECalendarValue.MomentArr;
            }
            else if (typeof value[0] === 'string') {
                return ECalendarValue.StringArr;
            }
            else if (moment.isMoment(value[0])) {
                return ECalendarValue.MomentArr;
            }
        }
        else {
            if (typeof value === 'string') {
                return ECalendarValue.String;
            }
            else if (moment.isMoment(value)) {
                return ECalendarValue.Moment;
            }
        }
        return allowMultiSelect ? ECalendarValue.MomentArr : ECalendarValue.Moment;
    }
    /**
     * @param {?} value
     * @param {?} format
     * @param {?} allowMultiSelect
     * @return {?}
     */
    convertToMomentArray(value, format, allowMultiSelect) {
        switch (this.getInputType(value, allowMultiSelect)) {
            case (ECalendarValue.String):
                return value ? [moment(/** @type {?} */ (value), format, true)] : [];
            case (ECalendarValue.StringArr):
                return ((value)).map(v => v ? moment(v, format, true) : null).filter(Boolean);
            case (ECalendarValue.Moment):
                return value ? [((value)).clone()] : [];
            case (ECalendarValue.MomentArr):
                return ((value) || []).map(v => v.clone());
            default:
                return [];
        }
    }
    /**
     * @param {?} format
     * @param {?} value
     * @param {?} convertTo
     * @return {?}
     */
    convertFromMomentArray(format, value, convertTo) {
        switch (convertTo) {
            case (ECalendarValue.String):
                return value[0] && value[0].format(format);
            case (ECalendarValue.StringArr):
                return value.filter(Boolean).map(v => v.format(format));
            case (ECalendarValue.Moment):
                return value[0] ? value[0].clone() : value[0];
            case (ECalendarValue.MomentArr):
                return value ? value.map(v => v.clone()) : value;
            default:
                return value;
        }
    }
    /**
     * @param {?} value
     * @param {?} format
     * @return {?}
     */
    convertToString(value, format) {
        let /** @type {?} */ tmpVal;
        if (typeof value === 'string') {
            tmpVal = [value];
        }
        else if (Array.isArray(value)) {
            if (value.length) {
                tmpVal = ((value)).map((v) => {
                    return this.convertToMoment(v, format).format(format);
                });
            }
            else {
                tmpVal = (value);
            }
        }
        else if (moment.isMoment(value)) {
            tmpVal = [value.format(format)];
        }
        else {
            return '';
        }
        return tmpVal.filter(Boolean).join(' | ');
    }
    /**
     * @template T
     * @param {?} obj
     * @return {?}
     */
    clearUndefined(obj) {
        if (!obj) {
            return obj;
        }
        Object.keys(obj).forEach((key) => (obj[key] === undefined) && delete obj[key]);
        return obj;
    }
    /**
     * @param {?} isMultiple
     * @param {?} currentlySelected
     * @param {?} date
     * @param {?=} granularity
     * @return {?}
     */
    updateSelected(isMultiple, currentlySelected, date, granularity = 'day') {
        const /** @type {?} */ isSelected = !date.selected;
        if (isMultiple) {
            return isSelected
                ? currentlySelected.concat([date.date])
                : currentlySelected.filter(d => !d.isSame(date.date, granularity));
        }
        else {
            return isSelected ? [date.date] : [];
        }
    }
    /**
     * @param {?} element
     * @param {?} selector
     * @return {?}
     */
    closestParent(element, selector) {
        if (!element) {
            return undefined;
        }
        const /** @type {?} */ match = (element.querySelector(selector));
        return match || this.closestParent(element.parentElement, selector);
    }
    /**
     * @param {?} m
     * @return {?}
     */
    onlyTime(m) {
        return m && moment.isMoment(m) && moment(m.format('HH:mm:ss'), 'HH:mm:ss');
    }
    /**
     * @param {?} calendarType
     * @return {?}
     */
    granularityFromType(calendarType) {
        switch (calendarType) {
            case 'time':
                return 'second';
            case 'daytime':
                return 'second';
            default:
                return calendarType;
        }
    }
    /**
     * @param {?} __0
     * @param {?} format
     * @param {?} calendarType
     * @return {?}
     */
    createValidator({ minDate, maxDate, minTime, maxTime }, format, calendarType) {
        let /** @type {?} */ isValid;
        let /** @type {?} */ value;
        const /** @type {?} */ validators = [];
        const /** @type {?} */ granularity = this.granularityFromType(calendarType);
        if (minDate) {
            const /** @type {?} */ md = this.convertToMoment(minDate, format);
            validators.push({
                key: 'minDate',
                isValid: () => {
                    const /** @type {?} */ _isValid = value.every(val => val.isSameOrAfter(md, granularity));
                    isValid = isValid ? _isValid : false;
                    return _isValid;
                }
            });
        }
        if (maxDate) {
            const /** @type {?} */ md = this.convertToMoment(maxDate, format);
            validators.push({
                key: 'maxDate',
                isValid: () => {
                    const /** @type {?} */ _isValid = value.every(val => val.isSameOrBefore(md, granularity));
                    isValid = isValid ? _isValid : false;
                    return _isValid;
                }
            });
        }
        if (minTime) {
            const /** @type {?} */ md = this.onlyTime(this.convertToMoment(minTime, format));
            validators.push({
                key: 'minTime',
                isValid: () => {
                    const /** @type {?} */ _isValid = value.every(val => this.onlyTime(val).isSameOrAfter(md));
                    isValid = isValid ? _isValid : false;
                    return _isValid;
                }
            });
        }
        if (maxTime) {
            const /** @type {?} */ md = this.onlyTime(this.convertToMoment(maxTime, format));
            validators.push({
                key: 'maxTime',
                isValid: () => {
                    const /** @type {?} */ _isValid = value.every(val => this.onlyTime(val).isSameOrBefore(md));
                    isValid = isValid ? _isValid : false;
                    return _isValid;
                }
            });
        }
        return (inputVal) => {
            isValid = true;
            value = this.convertToMomentArray(inputVal, format, true).filter(Boolean);
            if (!value.every(val => val.isValid())) {
                return {
                    format: {
                        given: inputVal
                    }
                };
            }
            const /** @type {?} */ errors = validators.reduce((map, err) => {
                if (!err.isValid()) {
                    map[err.key] = {
                        given: value
                    };
                }
                return map;
            }, {});
            return !isValid ? errors : null;
        };
    }
    /**
     * @param {?} value
     * @return {?}
     */
    datesStringToStringArray(value) {
        return (value || '').split('|').map(m => m.trim()).filter(Boolean);
    }
    /**
     * @param {?} value
     * @param {?} format
     * @return {?}
     */
    getValidMomentArray(value, format) {
        return this.datesStringToStringArray(value)
            .filter(d => this.isDateValid(d, format))
            .map(d => moment(d, format));
    }
    /**
     * @param {?} showGoToCurrent
     * @param {?} mode
     * @param {?} min
     * @param {?} max
     * @return {?}
     */
    shouldShowCurrent(showGoToCurrent, mode, min, max) {
        return showGoToCurrent &&
            mode !== 'time' &&
            this.isDateInRange(moment(), min, max);
    }
    /**
     * @param {?} date
     * @param {?} from
     * @param {?} to
     * @return {?}
     */
    isDateInRange(date, from, to) {
        return date.isBetween(from, to, 'day', '[]');
    }
    /**
     * @param {?} obj
     * @param {?} format
     * @param {?} props
     * @return {?}
     */
    convertPropsToMoment(obj, format, props) {
        props.forEach((prop) => {
            if (obj.hasOwnProperty(prop)) {
                obj[prop] = this.convertToMoment(obj[prop], format);
            }
        });
    }
    /**
     * @template T
     * @param {?} prevConf
     * @param {?} currentConf
     * @return {?}
     */
    shouldResetCurrentView(prevConf, currentConf) {
        if (prevConf && currentConf) {
            if (!prevConf.min && currentConf.min) {
                return true;
            }
            else if (prevConf.min && currentConf.min && !prevConf.min.isSame(currentConf.min, 'd')) {
                return true;
            }
            else if (!prevConf.max && currentConf.max) {
                return true;
            }
            else if (prevConf.max && currentConf.max && !prevConf.max.isSame(currentConf.max, 'd')) {
                return true;
            }
            return false;
        }
        return false;
    }
    /**
     * @param {?} elem
     * @return {?}
     */
    getNativeElement(elem) {
        if (!elem) {
            return null;
        }
        else if (typeof elem === 'string') {
            return (document.querySelector(elem));
        }
        else {
            return elem;
        }
    }
}
UtilsService.decorators = [
    { type: Injectable },
];
/**
 * @nocollapse
 */
UtilsService.ctorParameters = () => [];

const moment$1 = momentNs;
class DayCalendarService {
    /**
     * @param {?} utilsService
     */
    constructor(utilsService) {
        this.utilsService = utilsService;
        this.DAYS = ['su', 'mo', 'tu', 'we', 'th', 'fr', 'sa'];
        this.DEFAULT_CONFIG = {
            showNearMonthDays: true,
            showWeekNumbers: false,
            firstDayOfWeek: 'su',
            weekDayFormat: 'ddd',
            format: 'DD-MM-YYYY',
            allowMultiSelect: false,
            monthFormat: 'MMM, YYYY',
            enableMonthSelector: true,
            locale: moment$1.locale(),
            dayBtnFormat: 'DD',
            unSelectOnClick: true
        };
    }
    /**
     * @param {?} currentMonth
     * @param {?} monthArray
     * @return {?}
     */
    removeNearMonthWeeks(currentMonth, monthArray) {
        if (monthArray[monthArray.length - 1].find((day) => day.date.isSame(currentMonth, 'month'))) {
            return monthArray;
        }
        else {
            return monthArray.slice(0, -1);
        }
    }
    /**
     * @param {?} config
     * @return {?}
     */
    getConfig(config) {
        const /** @type {?} */ _config = (Object.assign({}, this.DEFAULT_CONFIG, this.utilsService.clearUndefined(config)));
        this.utilsService.convertPropsToMoment(_config, _config.format, ['min', 'max']);
        moment$1.locale(_config.locale);
        return _config;
    }
    /**
     * @param {?} firstDayOfWeek
     * @return {?}
     */
    generateDaysMap(firstDayOfWeek) {
        const /** @type {?} */ firstDayIndex = this.DAYS.indexOf(firstDayOfWeek);
        const /** @type {?} */ daysArr = this.DAYS.slice(firstDayIndex, 7).concat(this.DAYS.slice(0, firstDayIndex));
        return daysArr.reduce((map, day, index) => {
            map[day] = index;
            return map;
        }, /** @type {?} */ ({}));
    }
    /**
     * @param {?} config
     * @param {?} month
     * @param {?} selected
     * @return {?}
     */
    generateMonthArray(config, month, selected) {
        let /** @type {?} */ monthArray = [];
        const /** @type {?} */ firstDayOfWeekIndex = this.DAYS.indexOf(config.firstDayOfWeek);
        const /** @type {?} */ firstDayOfBoard = month.clone().startOf('month');
        while (firstDayOfBoard.day() !== firstDayOfWeekIndex) {
            firstDayOfBoard.subtract(1, 'day');
        }
        const /** @type {?} */ current = firstDayOfBoard.clone();
        const /** @type {?} */ prevMonth = month.clone().subtract(1, 'month');
        const /** @type {?} */ nextMonth = month.clone().add(1, 'month');
        const /** @type {?} */ today = moment$1();
        const /** @type {?} */ daysOfCalendar = this.utilsService.createArray(42)
            .reduce((array) => {
            array.push({
                date: current.clone(),
                selected: !!selected.find(selectedDay => current.isSame(selectedDay, 'day')),
                currentMonth: current.isSame(month, 'month'),
                prevMonth: current.isSame(prevMonth, 'month'),
                nextMonth: current.isSame(nextMonth, 'month'),
                currentDay: current.isSame(today, 'day'),
                disabled: this.isDateDisabled(current, config)
            });
            current.add(1, 'day');
            if (current.format('HH') !== '00') {
                current.startOf('day').add(1, 'day');
            }
            return array;
        }, []);
        daysOfCalendar.forEach((day, index) => {
            const /** @type {?} */ weekIndex = Math.floor(index / 7);
            if (!monthArray[weekIndex]) {
                monthArray.push([]);
            }
            monthArray[weekIndex].push(day);
        });
        if (!config.showNearMonthDays) {
            monthArray = this.removeNearMonthWeeks(month, monthArray);
        }
        return monthArray;
    }
    /**
     * @param {?} firstDayOfWeek
     * @return {?}
     */
    generateWeekdays(firstDayOfWeek) {
        const /** @type {?} */ weekdayNames = {
            su: moment$1().day(0),
            mo: moment$1().day(1),
            tu: moment$1().day(2),
            we: moment$1().day(3),
            th: moment$1().day(4),
            fr: moment$1().day(5),
            sa: moment$1().day(6)
        };
        const /** @type {?} */ weekdays = [];
        const /** @type {?} */ daysMap = this.generateDaysMap(firstDayOfWeek);
        for (const /** @type {?} */ dayKey in daysMap) {
            if (daysMap.hasOwnProperty(dayKey)) {
                weekdays[daysMap[dayKey]] = weekdayNames[dayKey];
            }
        }
        return weekdays;
    }
    /**
     * @param {?} date
     * @param {?} config
     * @return {?}
     */
    isDateDisabled(date, config) {
        if (config.isDayDisabledCallback) {
            return config.isDayDisabledCallback(date);
        }
        if (config.min && date.isBefore(config.min, 'day')) {
            return true;
        }
        return !!(config.max && date.isAfter(config.max, 'day'));
    }
    /**
     * @param {?} config
     * @param {?} month
     * @return {?}
     */
    getHeaderLabel(config, month) {
        if (config.monthFormatter) {
            return config.monthFormatter(month);
        }
        return month.format(config.monthFormat);
    }
    /**
     * @param {?} min
     * @param {?} currentMonthView
     * @return {?}
     */
    shouldShowLeft(min, currentMonthView) {
        return min ? min.isBefore(currentMonthView, 'month') : true;
    }
    /**
     * @param {?} max
     * @param {?} currentMonthView
     * @return {?}
     */
    shouldShowRight(max, currentMonthView) {
        return max ? max.isAfter(currentMonthView, 'month') : true;
    }
    /**
     * @param {?} firstDayOfWeek
     * @return {?}
     */
    generateDaysIndexMap(firstDayOfWeek) {
        const /** @type {?} */ firstDayIndex = this.DAYS.indexOf(firstDayOfWeek);
        const /** @type {?} */ daysArr = this.DAYS.slice(firstDayIndex, 7).concat(this.DAYS.slice(0, firstDayIndex));
        return daysArr.reduce((map, day, index) => {
            map[index] = day;
            return map;
        }, /** @type {?} */ ({}));
    }
    /**
     * @param {?} componentConfig
     * @return {?}
     */
    getMonthCalendarConfig(componentConfig) {
        return this.utilsService.clearUndefined({
            min: componentConfig.min,
            max: componentConfig.max,
            format: componentConfig.format,
            isNavHeaderBtnClickable: true,
            allowMultiSelect: false,
            yearFormat: componentConfig.yearFormat,
            yearFormatter: componentConfig.yearFormatter,
            monthBtnFormat: componentConfig.monthBtnFormat,
            monthBtnFormatter: componentConfig.monthBtnFormatter,
            monthBtnCssClassCallback: componentConfig.monthBtnCssClassCallback,
            multipleYearsNavigateBy: componentConfig.multipleYearsNavigateBy,
            showMultipleYearsNavigation: componentConfig.showMultipleYearsNavigation,
            showGoToCurrent: componentConfig.showGoToCurrent
        });
    }
    /**
     * @param {?} config
     * @param {?} day
     * @return {?}
     */
    getDayBtnText(config, day) {
        if (config.dayBtnFormatter) {
            return config.dayBtnFormatter(day);
        }
        return day.format(config.dayBtnFormat);
    }
    /**
     * @param {?} config
     * @param {?} day
     * @return {?}
     */
    getDayBtnCssClass(config, day) {
        if (config.dayBtnCssClassCallback) {
            return config.dayBtnCssClassCallback(day);
        }
        return '';
    }
}
DayCalendarService.decorators = [
    { type: Injectable },
];
/**
 * @nocollapse
 */
DayCalendarService.ctorParameters = () => [
    { type: UtilsService, },
];

const moment$3 = momentNs;
const FIRST_PM_HOUR = 12;
class TimeSelectService {
    /**
     * @param {?} utilsService
     */
    constructor(utilsService) {
        this.utilsService = utilsService;
        this.DEFAULT_CONFIG = {
            hours12Format: 'hh',
            hours24Format: 'HH',
            meridiemFormat: 'A',
            minutesFormat: 'mm',
            minutesInterval: 1,
            secondsFormat: 'ss',
            secondsInterval: 1,
            showSeconds: false,
            showTwentyFourHours: false,
            timeSeparator: ':',
            locale: moment$3.locale()
        };
    }
    /**
     * @param {?} config
     * @return {?}
     */
    getConfig(config) {
        const /** @type {?} */ timeConfigs = {
            maxTime: this.utilsService.onlyTime(config && config.maxTime),
            minTime: this.utilsService.onlyTime(config && config.minTime)
        };
        const /** @type {?} */ _config = (Object.assign({}, this.DEFAULT_CONFIG, this.utilsService.clearUndefined(config), timeConfigs));
        moment$3.locale(_config.locale);
        return _config;
    }
    /**
     * @param {?} config
     * @return {?}
     */
    getTimeFormat(config) {
        return (config.showTwentyFourHours ? config.hours24Format : config.hours12Format)
            + config.timeSeparator + config.minutesFormat
            + (config.showSeconds ? (config.timeSeparator + config.secondsFormat) : '')
            + (config.showTwentyFourHours ? '' : ' ' + config.meridiemFormat);
    }
    /**
     * @param {?} config
     * @param {?} t
     * @return {?}
     */
    getHours(config, t) {
        const /** @type {?} */ time = t || moment$3();
        return time && time.format(config.showTwentyFourHours ? config.hours24Format : config.hours12Format);
    }
    /**
     * @param {?} config
     * @param {?} t
     * @return {?}
     */
    getMinutes(config, t) {
        const /** @type {?} */ time = t || moment$3();
        return time && time.format(config.minutesFormat);
    }
    /**
     * @param {?} config
     * @param {?} t
     * @return {?}
     */
    getSeconds(config, t) {
        const /** @type {?} */ time = t || moment$3();
        return time && time.format(config.secondsFormat);
    }
    /**
     * @param {?} config
     * @param {?} time
     * @return {?}
     */
    getMeridiem(config, time) {
        return time && time.format(config.meridiemFormat);
    }
    /**
     * @param {?} config
     * @param {?} time
     * @param {?} unit
     * @return {?}
     */
    decrease(config, time, unit) {
        let /** @type {?} */ amount = 1;
        switch (unit) {
            case 'minute':
                amount = config.minutesInterval;
                break;
            case 'second':
                amount = config.secondsInterval;
                break;
        }
        return time.clone().subtract(amount, unit);
    }
    /**
     * @param {?} config
     * @param {?} time
     * @param {?} unit
     * @return {?}
     */
    increase(config, time, unit) {
        let /** @type {?} */ amount = 1;
        switch (unit) {
            case 'minute':
                amount = config.minutesInterval;
                break;
            case 'second':
                amount = config.secondsInterval;
                break;
        }
        return time.clone().add(amount, unit);
    }
    /**
     * @param {?} time
     * @return {?}
     */
    toggleMeridiem(time) {
        if (time.hours() < FIRST_PM_HOUR) {
            return time.clone().add(12, 'hour');
        }
        else {
            return time.clone().subtract(12, 'hour');
        }
    }
    /**
     * @param {?} config
     * @param {?} time
     * @param {?} unit
     * @return {?}
     */
    shouldShowDecrease(config, time, unit) {
        if (!config.min && !config.minTime) {
            return true;
        }
        
        const /** @type {?} */ newTime = this.decrease(config, time, unit);
        return (!config.min || config.min.isSameOrBefore(newTime))
            && (!config.minTime || config.minTime.isSameOrBefore(this.utilsService.onlyTime(newTime)));
    }
    /**
     * @param {?} config
     * @param {?} time
     * @param {?} unit
     * @return {?}
     */
    shouldShowIncrease(config, time, unit) {
        if (!config.max && !config.maxTime) {
            return true;
        }
        
        const /** @type {?} */ newTime = this.increase(config, time, unit);
        return (!config.max || config.max.isSameOrAfter(newTime))
            && (!config.maxTime || config.maxTime.isSameOrAfter(this.utilsService.onlyTime(newTime)));
    }
    /**
     * @param {?} config
     * @param {?} time
     * @return {?}
     */
    shouldShowToggleMeridiem(config, time) {
        if (!config.min && !config.max && !config.minTime && !config.maxTime) {
            return true;
        }
        const /** @type {?} */ newTime = this.toggleMeridiem(time);
        return (!config.max || config.max.isSameOrAfter(newTime))
            && (!config.min || config.min.isSameOrBefore(newTime))
            && (!config.maxTime || config.maxTime.isSameOrAfter(this.utilsService.onlyTime(newTime)))
            && (!config.minTime || config.minTime.isSameOrBefore(this.utilsService.onlyTime(newTime)));
    }
}
TimeSelectService.decorators = [
    { type: Injectable },
];
/**
 * @nocollapse
 */
TimeSelectService.ctorParameters = () => [
    { type: UtilsService, },
];

const moment$2 = momentNs;
const DAY_FORMAT = 'YYYYMMDD';
const TIME_FORMAT = 'HH:mm:ss';
const COMBINED_FORMAT = DAY_FORMAT + TIME_FORMAT;
class DayTimeCalendarService {
    /**
     * @param {?} utilsService
     * @param {?} dayCalendarService
     * @param {?} timeSelectService
     */
    constructor(utilsService, dayCalendarService, timeSelectService) {
        this.utilsService = utilsService;
        this.dayCalendarService = dayCalendarService;
        this.timeSelectService = timeSelectService;
        this.DEFAULT_CONFIG = {
            locale: moment$2.locale()
        };
    }
    /**
     * @param {?} config
     * @return {?}
     */
    getConfig(config) {
        const /** @type {?} */ _config = Object.assign({}, this.DEFAULT_CONFIG, this.timeSelectService.getConfig(config), this.dayCalendarService.getConfig(config));
        moment$2.locale(config.locale);
        return _config;
    }
    /**
     * @param {?} current
     * @param {?} day
     * @param {?} config
     * @return {?}
     */
    updateDay(current, day, config) {
        const /** @type {?} */ time = current ? current : moment$2();
        let /** @type {?} */ updated = moment$2(day.format(DAY_FORMAT) + time.format(TIME_FORMAT), COMBINED_FORMAT);
        if (config.min) {
            const /** @type {?} */ min = (config.min);
            updated = min.isAfter(updated) ? min : updated;
        }
        if (config.max) {
            const /** @type {?} */ max = (config.max);
            updated = max.isBefore(updated) ? max : updated;
        }
        return updated;
    }
    /**
     * @param {?} current
     * @param {?} time
     * @return {?}
     */
    updateTime(current, time) {
        const /** @type {?} */ day = current ? current : moment$2();
        return moment$2(day.format(DAY_FORMAT) + time.format(TIME_FORMAT), COMBINED_FORMAT);
    }
}
DayTimeCalendarService.decorators = [
    { type: Injectable },
];
/**
 * @nocollapse
 */
DayTimeCalendarService.ctorParameters = () => [
    { type: UtilsService, },
    { type: DayCalendarService, },
    { type: TimeSelectService, },
];

const moment$4 = momentNs;
class DatePickerService {
    /**
     * @param {?} utilsService
     * @param {?} timeSelectService
     * @param {?} daytimeCalendarService
     */
    constructor(utilsService, timeSelectService, daytimeCalendarService) {
        this.utilsService = utilsService;
        this.timeSelectService = timeSelectService;
        this.daytimeCalendarService = daytimeCalendarService;
        this.onPickerClosed = new EventEmitter();
        this.defaultConfig = {
            closeOnSelect: true,
            closeOnSelectDelay: 100,
            format: 'DD-MM-YYYY',
            openOnFocus: true,
            openOnClick: true,
            onOpenDelay: 0,
            disableKeypress: false,
            showNearMonthDays: true,
            showWeekNumbers: false,
            enableMonthSelector: true,
            showGoToCurrent: true,
            locale: moment$4.locale(),
            hideOnOutsideClick: true
        };
    }
    /**
     * @param {?} config
     * @param {?=} mode
     * @return {?}
     */
    getConfig(config, mode = 'daytime') {
        const /** @type {?} */ _config = (Object.assign({}, this.defaultConfig, { format: this.getDefaultFormatByMode(mode) }, this.utilsService.clearUndefined(config)));
        this.utilsService.convertPropsToMoment(_config, _config.format, ['min', 'max']);
        if (config && config.allowMultiSelect && config.closeOnSelect === undefined) {
            _config.closeOnSelect = false;
        }
        moment$4.locale(_config.locale);
        return _config;
    }
    /**
     * @param {?} pickerConfig
     * @return {?}
     */
    getDayConfigService(pickerConfig) {
        return {
            min: pickerConfig.min,
            max: pickerConfig.max,
            isDayDisabledCallback: pickerConfig.isDayDisabledCallback,
            weekDayFormat: pickerConfig.weekDayFormat,
            showNearMonthDays: pickerConfig.showNearMonthDays,
            showWeekNumbers: pickerConfig.showWeekNumbers,
            firstDayOfWeek: pickerConfig.firstDayOfWeek,
            format: pickerConfig.format,
            allowMultiSelect: pickerConfig.allowMultiSelect,
            monthFormat: pickerConfig.monthFormat,
            monthFormatter: pickerConfig.monthFormatter,
            enableMonthSelector: pickerConfig.enableMonthSelector,
            yearFormat: pickerConfig.yearFormat,
            yearFormatter: pickerConfig.yearFormatter,
            dayBtnFormat: pickerConfig.dayBtnFormat,
            dayBtnFormatter: pickerConfig.dayBtnFormatter,
            dayBtnCssClassCallback: pickerConfig.dayBtnCssClassCallback,
            monthBtnFormat: pickerConfig.monthBtnFormat,
            monthBtnFormatter: pickerConfig.monthBtnFormatter,
            monthBtnCssClassCallback: pickerConfig.monthBtnCssClassCallback,
            multipleYearsNavigateBy: pickerConfig.multipleYearsNavigateBy,
            showMultipleYearsNavigation: pickerConfig.showMultipleYearsNavigation,
            locale: pickerConfig.locale,
            returnedValueType: pickerConfig.returnedValueType,
            showGoToCurrent: pickerConfig.showGoToCurrent,
            unSelectOnClick: pickerConfig.unSelectOnClick,
            monthInRow: pickerConfig.monthInRow
        };
    }
    /**
     * @param {?} pickerConfig
     * @return {?}
     */
    getDayTimeConfigService(pickerConfig) {
        return this.daytimeCalendarService.getConfig(pickerConfig);
    }
    /**
     * @param {?} pickerConfig
     * @return {?}
     */
    getTimeConfigService(pickerConfig) {
        return this.timeSelectService.getConfig(pickerConfig);
    }
    /**
     * @return {?}
     */
    pickerClosed() {
        this.onPickerClosed.emit();
    }
    /**
     * @param {?} value
     * @param {?} config
     * @return {?}
     */
    isValidInputDateValue(value, config) {
        value = value ? value : '';
        const /** @type {?} */ datesStrArr = this.utilsService.datesStringToStringArray(value);
        return datesStrArr.every(date => this.utilsService.isDateValid(date, config.format));
    }
    /**
     * @param {?} value
     * @param {?} config
     * @return {?}
     */
    convertInputValueToMomentArray(value, config) {
        value = value ? value : '';
        const /** @type {?} */ datesStrArr = this.utilsService.datesStringToStringArray(value);
        return this.utilsService.convertToMomentArray(datesStrArr, config.format, config.allowMultiSelect);
    }
    /**
     * @param {?} mode
     * @return {?}
     */
    getDefaultFormatByMode(mode) {
        switch (mode) {
            case 'day':
                return 'DD-MM-YYYY';
            case 'daytime':
                return 'DD-MM-YYYY HH:mm:ss';
            case 'time':
                return 'HH:mm:ss';
            case 'month':
                return 'MMM, YYYY';
        }
    }
}
DatePickerService.decorators = [
    { type: Injectable },
];
/**
 * @nocollapse
 */
DatePickerService.ctorParameters = () => [
    { type: UtilsService, },
    { type: TimeSelectService, },
    { type: DayTimeCalendarService, },
];

class DatePickerComponent {
    /**
     * @param {?} dayPickerService
     * @param {?} domHelper
     * @param {?} elemRef
     * @param {?} renderer
     * @param {?} utilsService
     * @param {?} cd
     */
    constructor(dayPickerService, domHelper, elemRef, renderer, utilsService, cd) {
        this.dayPickerService = dayPickerService;
        this.domHelper = domHelper;
        this.elemRef = elemRef;
        this.renderer = renderer;
        this.utilsService = utilsService;
        this.cd = cd;
        this.isInitialized = false;
        this.mode = 'day';
        this.placeholder = '';
        this.disabled = false;
        this.open = new EventEmitter();
        this.close = new EventEmitter();
        this.onChange = new EventEmitter();
        this.onGoToCurrent = new EventEmitter();
        this.onLeftNav = new EventEmitter();
        this.onRightNav = new EventEmitter();
        this._areCalendarsShown = false;
        this.hideStateHelper = false;
        this._selected = [];
        this.isFocusedTrigger = false;
        this.handleInnerElementClickUnlisteners = [];
        this.globalListnersUnlisteners = [];
        this.api = {
            open: this.showCalendars.bind(this),
            close: this.hideCalendar.bind(this),
            moveCalendarTo: this.moveCalendarTo.bind(this)
        };
    }
    /**
     * @param {?} selected
     * @return {?}
     */
    set selected(selected) {
        this._selected = selected;
        this.inputElementValue = ((this.utilsService
            .convertFromMomentArray(this.componentConfig.format, selected, ECalendarValue.StringArr)))
            .join(' | ');
        const /** @type {?} */ val = this.processOnChangeCallback(selected);
        this.onChangeCallback(val, false);
        this.onChange.emit(val);
    }
    /**
     * @return {?}
     */
    get selected() {
        return this._selected;
    }
    /**
     * @return {?}
     */
    get areCalendarsShown() {
        return this._areCalendarsShown;
    }
    /**
     * @return {?}
     */
    get openOnFocus() {
        return this.componentConfig.openOnFocus;
    }
    /**
     * @return {?}
     */
    get openOnClick() {
        return this.componentConfig.openOnClick;
    }
    /**
     * @param {?} value
     * @return {?}
     */
    set areCalendarsShown(value) {
        if (value) {
            this.startGlobalListeners();
            this.domHelper.appendElementToPosition({
                container: this.appendToElement,
                element: this.calendarWrapper,
                anchor: this.inputElementContainer,
                dimElem: this.popupElem,
                drops: this.componentConfig.drops,
                opens: this.componentConfig.opens
            });
        }
        else {
            this.stopGlobalListeners();
            this.dayPickerService.pickerClosed();
        }
        this._areCalendarsShown = value;
    }
    /**
     * @return {?}
     */
    get currentDateView() {
        return this._currentDateView;
    }
    /**
     * @param {?} date
     * @return {?}
     */
    set currentDateView(date) {
        this._currentDateView = date;
        if (this.dayCalendarRef) {
            this.dayCalendarRef.moveCalendarTo(date);
        }
        if (this.monthCalendarRef) {
            this.monthCalendarRef.moveCalendarTo(date);
        }
        if (this.dayTimeCalendarRef) {
            this.dayTimeCalendarRef.moveCalendarTo(date);
        }
    }
    /**
     * @return {?}
     */
    onClick() {
        if (!this.openOnClick) {
            return;
        }
        if (!this.isFocusedTrigger && !this.disabled) {
            this.hideStateHelper = true;
            if (!this.areCalendarsShown) {
                this.showCalendars();
            }
        }
    }
    /**
     * @return {?}
     */
    onBodyClick() {
        if (this.componentConfig.hideOnOutsideClick) {
            if (!this.hideStateHelper && this.areCalendarsShown) {
                this.hideCalendar();
            }
            this.hideStateHelper = false;
        }
    }
    /**
     * @return {?}
     */
    onScroll() {
        if (this.areCalendarsShown) {
            this.domHelper.setElementPosition({
                container: this.appendToElement,
                element: this.calendarWrapper,
                anchor: this.inputElementContainer,
                dimElem: this.popupElem,
                drops: this.componentConfig.drops,
                opens: this.componentConfig.opens
            });
        }
    }
    /**
     * @param {?} value
     * @return {?}
     */
    writeValue(value) {
        this.inputValue = value;
        if (value || value === '') {
            this.selected = this.utilsService
                .convertToMomentArray(value, this.componentConfig.format, this.componentConfig.allowMultiSelect);
            this.init();
        }
        else {
            this.selected = [];
        }
        this.cd.markForCheck();
    }
    /**
     * @param {?} fn
     * @return {?}
     */
    registerOnChange(fn) {
        this.onChangeCallback = fn;
    }
    /**
     * @param {?} _
     * @param {?} changedByInput
     * @return {?}
     */
    onChangeCallback(_, changedByInput) {
    }
    ;
    /**
     * @param {?} fn
     * @return {?}
     */
    registerOnTouched(fn) {
    }
    /**
     * @param {?} formControl
     * @return {?}
     */
    validate(formControl) {
        return this.validateFn(formControl.value);
    }
    /**
     * @param {?} selected
     * @return {?}
     */
    processOnChangeCallback(selected) {
        if (typeof selected === 'string') {
            return selected;
        }
        else {
            return this.utilsService.convertFromMomentArray(this.componentConfig.format, selected, this.componentConfig.returnedValueType || this.inputValueType);
        }
    }
    /**
     * @return {?}
     */
    initValidators() {
        this.validateFn = this.utilsService.createValidator({
            minDate: this.minDate,
            maxDate: this.maxDate,
            minTime: this.minTime,
            maxTime: this.maxTime
        }, this.componentConfig.format, this.mode);
        this.onChangeCallback(this.processOnChangeCallback(this.selected), false);
    }
    /**
     * @return {?}
     */
    ngOnInit() {
        this.isInitialized = true;
        this.init();
        this.initValidators();
    }
    /**
     * @param {?} changes
     * @return {?}
     */
    ngOnChanges(changes) {
        if (this.isInitialized) {
            const { minDate, maxDate, minTime, maxTime } = changes;
            this.init();
            if (minDate || maxDate || minTime || maxTime) {
                this.initValidators();
            }
        }
    }
    /**
     * @return {?}
     */
    ngAfterViewInit() {
        this.setElementPositionInDom();
    }
    /**
     * @param {?} isDisabled
     * @return {?}
     */
    setDisabledState(isDisabled) {
        this.disabled = isDisabled;
    }
    /**
     * @return {?}
     */
    setElementPositionInDom() {
        this.calendarWrapper = (this.calendarContainer.nativeElement);
        this.setInputElementContainer();
        this.popupElem = this.elemRef.nativeElement.querySelector('.dp-popup');
        this.handleInnerElementClick(this.popupElem);
        const { appendTo } = this.componentConfig;
        if (appendTo) {
            if (typeof appendTo === 'string') {
                this.appendToElement = (document.querySelector(/** @type {?} */ (appendTo)));
            }
            else {
                this.appendToElement = (appendTo);
            }
        }
        else {
            this.appendToElement = this.elemRef.nativeElement;
        }
        this.appendToElement.appendChild(this.calendarWrapper);
    }
    /**
     * @return {?}
     */
    setInputElementContainer() {
        this.inputElementContainer = this.utilsService.getNativeElement(this.componentConfig.inputElementContainer)
            || this.elemRef.nativeElement.querySelector('.dp-input-container')
            || document.body;
    }
    /**
     * @param {?} element
     * @return {?}
     */
    handleInnerElementClick(element) {
        this.handleInnerElementClickUnlisteners.push(this.renderer.listen(element, 'click', () => {
            this.hideStateHelper = true;
        }));
    }
    /**
     * @return {?}
     */
    init() {
        this.componentConfig = this.dayPickerService.getConfig(this.config, this.mode);
        this.currentDateView = this.displayDate
            ? this.utilsService.convertToMoment(this.displayDate, this.componentConfig.format).clone()
            : this.utilsService
                .getDefaultDisplayDate(this.currentDateView, this.selected, this.componentConfig.allowMultiSelect, this.componentConfig.min);
        this.inputValueType = this.utilsService.getInputType(this.inputValue, this.componentConfig.allowMultiSelect);
        this.dayCalendarConfig = this.dayPickerService.getDayConfigService(this.componentConfig);
        this.dayTimeCalendarConfig = this.dayPickerService.getDayTimeConfigService(this.componentConfig);
        this.timeSelectConfig = this.dayPickerService.getTimeConfigService(this.componentConfig);
    }
    /**
     * @return {?}
     */
    inputFocused() {
        if (!this.openOnFocus) {
            return;
        }
        this.isFocusedTrigger = true;
        setTimeout(() => {
            this.hideStateHelper = false;
            if (!this.areCalendarsShown) {
                this.showCalendars();
            }
            this.isFocusedTrigger = false;
        }, this.componentConfig.onOpenDelay);
    }
    /**
     * @return {?}
     */
    showCalendars() {
        this.hideStateHelper = true;
        this.areCalendarsShown = true;
        if (this.timeSelectRef) {
            this.timeSelectRef.api.triggerChange();
        }
        this.open.emit();
        this.cd.markForCheck();
    }
    /**
     * @return {?}
     */
    hideCalendar() {
        this.areCalendarsShown = false;
        if (this.dayCalendarRef) {
            this.dayCalendarRef.api.toggleCalendarMode(ECalendarMode.Day);
        }
        this.close.emit();
        this.cd.markForCheck();
    }
    /**
     * @param {?} value
     * @return {?}
     */
    onViewDateChange(value) {
        const /** @type {?} */ strVal = value ? this.utilsService.convertToString(value, this.componentConfig.format) : '';
        if (this.dayPickerService.isValidInputDateValue(strVal, this.componentConfig)) {
            this.selected = this.dayPickerService.convertInputValueToMomentArray(strVal, this.componentConfig);
            this.currentDateView = this.selected.length
                ? this.utilsService.getDefaultDisplayDate(null, this.selected, this.componentConfig.allowMultiSelect, this.componentConfig.min)
                : this.currentDateView;
        }
        else {
            this._selected = this.utilsService
                .getValidMomentArray(strVal, this.componentConfig.format);
            this.onChangeCallback(this.processOnChangeCallback(strVal), true);
        }
    }
    /**
     * @param {?} date
     * @param {?} granularity
     * @param {?=} ignoreClose
     * @return {?}
     */
    dateSelected(date, granularity, ignoreClose) {
        this.selected = this.utilsService
            .updateSelected(this.componentConfig.allowMultiSelect, this.selected, date, granularity);
        if (!ignoreClose) {
            this.onDateClick();
        }
    }
    /**
     * @return {?}
     */
    onDateClick() {
        if (this.componentConfig.closeOnSelect) {
            setTimeout(this.hideCalendar.bind(this), this.componentConfig.closeOnSelectDelay);
        }
    }
    /**
     * @param {?} event
     * @return {?}
     */
    onKeyPress(event) {
        switch (event.keyCode) {
            case (9):
            case (27):
                this.hideCalendar();
                break;
        }
    }
    /**
     * @param {?} date
     * @return {?}
     */
    moveCalendarTo(date) {
        const /** @type {?} */ momentDate = this.utilsService.convertToMoment(date, this.componentConfig.format);
        this.currentDateView = momentDate;
    }
    /**
     * @param {?} change
     * @return {?}
     */
    onLeftNavClick(change) {
        this.onLeftNav.emit(change);
    }
    /**
     * @param {?} change
     * @return {?}
     */
    onRightNavClick(change) {
        this.onRightNav.emit(change);
    }
    /**
     * @return {?}
     */
    startGlobalListeners() {
        this.globalListnersUnlisteners.push(this.renderer.listen(document, 'keydown', (e) => {
            this.onKeyPress(e);
        }), this.renderer.listen(document, 'scroll', () => {
            this.onScroll();
        }), this.renderer.listen(document, 'click', () => {
            this.onBodyClick();
        }));
    }
    /**
     * @return {?}
     */
    stopGlobalListeners() {
        this.globalListnersUnlisteners.forEach((ul) => ul());
        this.globalListnersUnlisteners = [];
    }
    /**
     * @return {?}
     */
    ngOnDestroy() {
        this.handleInnerElementClickUnlisteners.forEach(ul => ul());
        if (this.appendToElement) {
            this.appendToElement.removeChild(this.calendarWrapper);
        }
    }
}
DatePickerComponent.decorators = [
    { type: Component, args: [{
                selector: 'dp-date-picker',
                template: `
    <div [ngClass]="{'dp-open': areCalendarsShown}">
      <div class="dp-input-container"
           [hidden]="componentConfig.hideInputContainer"
           [attr.data-hidden]="componentConfig.hideInputContainer">
        <input type="text"
               class="dp-picker-input"
               [placeholder]="placeholder"
               [ngModel]="inputElementValue"
               (ngModelChange)="onViewDateChange($event)"
               (focus)="inputFocused()"
               [readonly]="componentConfig.disableKeypress"
               [disabled]="disabled"/>
      </div>
      <div #container>
        <div class="dp-popup {{theme}}"
             [ngSwitch]="mode"
             [hidden]="!_areCalendarsShown"
             [attr.data-hidden]="!_areCalendarsShown">
          <dp-day-calendar #dayCalendar
                           *ngSwitchCase="'day'"
                           [config]="dayCalendarConfig"
                           [ngModel]="_selected"
                           [displayDate]="displayDate"
                           [theme]="theme"
                           (onSelect)="dateSelected($event, 'day')"
                           (onGoToCurrent)="onGoToCurrent.emit()"
                           (onLeftNav)="onLeftNavClick($event)"
                           (onRightNav)="onRightNavClick($event)">
          </dp-day-calendar>

          <dp-month-calendar #monthCalendar
                             *ngSwitchCase="'month'"
                             [config]="dayCalendarConfig"
                             [ngModel]="_selected"
                             [displayDate]="displayDate"
                             [theme]="theme"
                             (onSelect)="dateSelected($event, 'month')"
                             (onGoToCurrent)="onGoToCurrent.emit()"
                             (onLeftNav)="onLeftNavClick($event)"
                             (onRightNav)="onRightNavClick($event)">
          </dp-month-calendar>

          <dp-time-select #timeSelect
                          *ngSwitchCase="'time'"
                          [config]="timeSelectConfig"
                          [ngModel]="_selected && _selected[0]"
                          (onChange)="dateSelected($event, 'second', true)"
                          [theme]="theme">
          </dp-time-select>

          <dp-day-time-calendar #daytimeCalendar
                                *ngSwitchCase="'daytime'"
                                [config]="dayTimeCalendarConfig"
                                [displayDate]="displayDate"
                                [ngModel]="_selected && _selected[0]"
                                [theme]="theme"
                                (onChange)="dateSelected($event, 'second', true)"
                                (onGoToCurrent)="onGoToCurrent.emit()"
                                (onLeftNav)="onLeftNavClick($event)"
                                (onRightNav)="onRightNavClick($event)">
          </dp-day-time-calendar>
        </div>
      </div>
    </div>
  `,
                styles: [`
    dp-date-picker {
      display: inline-block;
    }
    dp-date-picker.dp-material .dp-picker-input {
      -webkit-box-sizing: border-box;
              box-sizing: border-box;
      height: 30px;
      width: 213px;
      font-size: 13px;
      outline: none;
    }
    dp-date-picker .dp-input-container {
      position: relative;
    }
    dp-date-picker .dp-selected {
      background: #106CC8;
      color: #FFFFFF;
    }
    .dp-popup {
      position: relative;
      background: #FFFFFF;
      -webkit-box-shadow: 1px 1px 5px 0 rgba(0, 0, 0, 0.1);
              box-shadow: 1px 1px 5px 0 rgba(0, 0, 0, 0.1);
      border-left: 1px solid rgba(0, 0, 0, 0.1);
      border-right: 1px solid rgba(0, 0, 0, 0.1);
      border-bottom: 1px solid rgba(0, 0, 0, 0.1);
      z-index: 9999;
      white-space: nowrap;
    }
  `],
                encapsulation: ViewEncapsulation.None,
                changeDetection: ChangeDetectionStrategy.OnPush,
                providers: [
                    DatePickerService,
                    DayTimeCalendarService,
                    DayCalendarService,
                    TimeSelectService,
                    {
                        provide: NG_VALUE_ACCESSOR,
                        useExisting: forwardRef(() => DatePickerComponent),
                        multi: true
                    },
                    {
                        provide: NG_VALIDATORS,
                        useExisting: forwardRef(() => DatePickerComponent),
                        multi: true
                    }
                ]
            },] },
];
/**
 * @nocollapse
 */
DatePickerComponent.ctorParameters = () => [
    { type: DatePickerService, },
    { type: DomHelper, },
    { type: ElementRef, },
    { type: Renderer, },
    { type: UtilsService, },
    { type: ChangeDetectorRef, },
];
DatePickerComponent.propDecorators = {
    'config': [{ type: Input },],
    'mode': [{ type: Input },],
    'placeholder': [{ type: Input },],
    'disabled': [{ type: Input },],
    'displayDate': [{ type: Input },],
    'theme': [{ type: HostBinding, args: ['class',] }, { type: Input },],
    'minDate': [{ type: Input },],
    'maxDate': [{ type: Input },],
    'minTime': [{ type: Input },],
    'maxTime': [{ type: Input },],
    'open': [{ type: Output },],
    'close': [{ type: Output },],
    'onChange': [{ type: Output },],
    'onGoToCurrent': [{ type: Output },],
    'onLeftNav': [{ type: Output },],
    'onRightNav': [{ type: Output },],
    'calendarContainer': [{ type: ViewChild, args: ['container',] },],
    'dayCalendarRef': [{ type: ViewChild, args: ['dayCalendar',] },],
    'monthCalendarRef': [{ type: ViewChild, args: ['monthCalendar',] },],
    'dayTimeCalendarRef': [{ type: ViewChild, args: ['daytimeCalendar',] },],
    'timeSelectRef': [{ type: ViewChild, args: ['timeSelect',] },],
    'onClick': [{ type: HostListener, args: ['click',] },],
    'onScroll': [{ type: HostListener, args: ['window:resize',] },],
};

class DatePickerDirectiveService {
    /**
     * @param {?} utilsService
     */
    constructor(utilsService) {
        this.utilsService = utilsService;
    }
    /**
     * @param {?} attachTo
     * @param {?} baseElement
     * @return {?}
     */
    convertToHTMLElement(attachTo, baseElement) {
        if (typeof attachTo === 'string') {
            return this.utilsService.closestParent(baseElement, attachTo);
        }
        else if (attachTo) {
            return attachTo.nativeElement;
        }
        return undefined;
    }
    /**
     * @param {?=} config
     * @param {?=} baseElement
     * @param {?=} attachTo
     * @return {?}
     */
    getConfig(config = {}, baseElement, attachTo) {
        const /** @type {?} */ _config = Object.assign({}, config);
        _config.hideInputContainer = true;
        let /** @type {?} */ native;
        if (config.inputElementContainer) {
            native = this.utilsService.getNativeElement(config.inputElementContainer);
        }
        else {
            native = baseElement ? baseElement.nativeElement : null;
        }
        if (native) {
            _config.inputElementContainer = attachTo
                ? this.convertToHTMLElement(attachTo, native)
                : native;
        }
        return _config;
    }
}
DatePickerDirectiveService.decorators = [
    { type: Injectable },
];
/**
 * @nocollapse
 */
DatePickerDirectiveService.ctorParameters = () => [
    { type: UtilsService, },
];

class DatePickerDirective {
    /**
     * @param {?} viewContainerRef
     * @param {?} elemRef
     * @param {?} componentFactoryResolver
     * @param {?} service
     * @param {?} formControl
     * @param {?} utilsService
     */
    constructor(viewContainerRef, elemRef, componentFactoryResolver, service, formControl, utilsService) {
        this.viewContainerRef = viewContainerRef;
        this.elemRef = elemRef;
        this.componentFactoryResolver = componentFactoryResolver;
        this.service = service;
        this.formControl = formControl;
        this.utilsService = utilsService;
        this._mode = 'day';
        this.open = new EventEmitter();
        this.close = new EventEmitter();
        this.onChange = new EventEmitter();
        this.onGoToCurrent = new EventEmitter();
        this.onLeftNav = new EventEmitter();
        this.onRightNav = new EventEmitter();
    }
    /**
     * @return {?}
     */
    get config() {
        return this._config;
    }
    /**
     * @param {?} config
     * @return {?}
     */
    set config(config) {
        this._config = this.service.getConfig(config, this.viewContainerRef.element, this.attachTo);
        this.updateDatepickerConfig();
        this.markForCheck();
    }
    /**
     * @return {?}
     */
    get attachTo() {
        return this._attachTo;
    }
    /**
     * @param {?} attachTo
     * @return {?}
     */
    set attachTo(attachTo) {
        this._attachTo = attachTo;
        this._config = this.service.getConfig(this.config, this.viewContainerRef.element, this.attachTo);
        this.updateDatepickerConfig();
        this.markForCheck();
    }
    /**
     * @return {?}
     */
    get theme() {
        return this._theme;
    }
    /**
     * @param {?} theme
     * @return {?}
     */
    set theme(theme) {
        this._theme = theme;
        if (this.datePicker) {
            this.datePicker.theme = theme;
        }
        this.markForCheck();
    }
    /**
     * @return {?}
     */
    get mode() {
        return this._mode;
    }
    /**
     * @param {?} mode
     * @return {?}
     */
    set mode(mode) {
        this._mode = mode;
        if (this.datePicker) {
            this.datePicker.mode = mode;
        }
        this.markForCheck();
    }
    /**
     * @param {?} minDate
     * @return {?}
     */
    set minDate(minDate) {
        this._minDate = minDate;
        if (this.datePicker) {
            this.datePicker.minDate = minDate;
            this.datePicker.ngOnInit();
        }
        this.markForCheck();
    }
    /**
     * @return {?}
     */
    get minDate() {
        return this._minDate;
    }
    /**
     * @param {?} maxDate
     * @return {?}
     */
    set maxDate(maxDate) {
        this._maxDate = maxDate;
        if (this.datePicker) {
            this.datePicker.maxDate = maxDate;
            this.datePicker.ngOnInit();
        }
        this.markForCheck();
    }
    /**
     * @return {?}
     */
    get maxDate() {
        return this._maxDate;
    }
    /**
     * @param {?} minTime
     * @return {?}
     */
    set minTime(minTime) {
        this._minTime = minTime;
        if (this.datePicker) {
            this.datePicker.minTime = minTime;
            this.datePicker.ngOnInit();
        }
        this.markForCheck();
    }
    /**
     * @return {?}
     */
    get minTime() {
        return this._minTime;
    }
    /**
     * @param {?} maxTime
     * @return {?}
     */
    set maxTime(maxTime) {
        this._maxTime = maxTime;
        if (this.datePicker) {
            this.datePicker.maxTime = maxTime;
            this.datePicker.ngOnInit();
        }
        this.markForCheck();
    }
    /**
     * @return {?}
     */
    get maxTime() {
        return this._maxTime;
    }
    /**
     * @return {?}
     */
    get displayDate() {
        return this._displayDate;
    }
    /**
     * @param {?} displayDate
     * @return {?}
     */
    set displayDate(displayDate) {
        this._displayDate = displayDate;
        this.updateDatepickerConfig();
        this.markForCheck();
    }
    /**
     * @return {?}
     */
    ngOnInit() {
        this.datePicker = this.createDatePicker();
        this.api = this.datePicker.api;
        this.updateDatepickerConfig();
        this.attachModelToDatePicker();
        this.datePicker.theme = this.theme;
    }
    /**
     * @return {?}
     */
    createDatePicker() {
        const /** @type {?} */ factory = this.componentFactoryResolver.resolveComponentFactory(DatePickerComponent);
        return this.viewContainerRef.createComponent(factory).instance;
    }
    /**
     * @return {?}
     */
    attachModelToDatePicker() {
        if (!this.formControl) {
            return;
        }
        this.datePicker.onViewDateChange(this.formControl.value);
        this.formControl.valueChanges.subscribe((value) => {
            if (value !== this.datePicker.inputElementValue) {
                const /** @type {?} */ strVal = this.utilsService.convertToString(value, this.datePicker.componentConfig.format);
                this.datePicker.onViewDateChange(strVal);
            }
        });
        let /** @type {?} */ setup = true;
        this.datePicker.registerOnChange((value, changedByInput) => {
            if (value) {
                const /** @type {?} */ isMultiselectEmpty = setup && Array.isArray(value) && !value.length;
                if (!isMultiselectEmpty && !changedByInput) {
                    this.formControl.control.setValue(this.datePicker.inputElementValue);
                }
            }
            const /** @type {?} */ errors = this.datePicker.validateFn(value);
            if (!setup) {
                this.formControl.control.markAsDirty({
                    onlySelf: true
                });
            }
            else {
                setup = false;
            }
            if (errors) {
                if (errors.hasOwnProperty('format')) {
                    const { given } = errors['format'];
                    this.datePicker.inputElementValue = given;
                    if (!changedByInput) {
                        this.formControl.control.setValue(given);
                    }
                }
                this.formControl.control.setErrors(errors);
            }
        });
    }
    /**
     * @return {?}
     */
    onClick() {
        this.datePicker.onClick();
    }
    /**
     * @return {?}
     */
    onFocus() {
        this.datePicker.inputFocused();
    }
    /**
     * @return {?}
     */
    updateDatepickerConfig() {
        if (this.datePicker) {
            this.datePicker.minDate = this.minDate;
            this.datePicker.maxDate = this.maxDate;
            this.datePicker.minTime = this.minTime;
            this.datePicker.maxTime = this.maxTime;
            this.datePicker.mode = this.mode || 'day';
            this.datePicker.displayDate = this.displayDate;
            this.datePicker.config = this.config;
            this.datePicker.open = this.open;
            this.datePicker.close = this.close;
            this.datePicker.onChange = this.onChange;
            this.datePicker.onGoToCurrent = this.onGoToCurrent;
            this.datePicker.onLeftNav = this.onLeftNav;
            this.datePicker.onRightNav = this.onRightNav;
            this.datePicker.init();
            if (this.datePicker.componentConfig.disableKeypress) {
                this.elemRef.nativeElement.setAttribute('readonly', true);
            }
            else {
                this.elemRef.nativeElement.removeAttribute('readonly');
            }
        }
    }
    /**
     * @return {?}
     */
    markForCheck() {
        if (this.datePicker) {
            this.datePicker.cd.markForCheck();
        }
    }
}
DatePickerDirective.decorators = [
    { type: Directive, args: [{
                exportAs: 'dpDayPicker',
                providers: [DatePickerDirectiveService],
                selector: '[dpDayPicker]'
            },] },
];
/**
 * @nocollapse
 */
DatePickerDirective.ctorParameters = () => [
    { type: ViewContainerRef, },
    { type: ElementRef, },
    { type: ComponentFactoryResolver, },
    { type: DatePickerDirectiveService, },
    { type: NgControl, decorators: [{ type: Optional },] },
    { type: UtilsService, },
];
DatePickerDirective.propDecorators = {
    'config': [{ type: Input, args: ['dpDayPicker',] },],
    'attachTo': [{ type: Input },],
    'theme': [{ type: Input },],
    'mode': [{ type: Input },],
    'minDate': [{ type: Input },],
    'maxDate': [{ type: Input },],
    'minTime': [{ type: Input },],
    'maxTime': [{ type: Input },],
    'displayDate': [{ type: Input },],
    'open': [{ type: Output },],
    'close': [{ type: Output },],
    'onChange': [{ type: Output },],
    'onGoToCurrent': [{ type: Output },],
    'onLeftNav': [{ type: Output },],
    'onRightNav': [{ type: Output },],
    'onClick': [{ type: HostListener, args: ['click',] },],
    'onFocus': [{ type: HostListener, args: ['focus',] },],
};

const moment$5 = momentNs;
class DayCalendarComponent {
    /**
     * @param {?} dayCalendarService
     * @param {?} utilsService
     * @param {?} cd
     */
    constructor(dayCalendarService, utilsService, cd) {
        this.dayCalendarService = dayCalendarService;
        this.utilsService = utilsService;
        this.cd = cd;
        this.onSelect = new EventEmitter();
        this.onMonthSelect = new EventEmitter();
        this.onNavHeaderBtnClick = new EventEmitter();
        this.onGoToCurrent = new EventEmitter();
        this.onLeftNav = new EventEmitter();
        this.onRightNav = new EventEmitter();
        this.CalendarMode = ECalendarMode;
        this.isInited = false;
        this.currentCalendarMode = ECalendarMode.Day;
        this._shouldShowCurrent = true;
        this.api = {
            moveCalendarsBy: this.moveCalendarsBy.bind(this),
            moveCalendarTo: this.moveCalendarTo.bind(this),
            toggleCalendarMode: this.toggleCalendarMode.bind(this)
        };
    }
    /**
     * @param {?} selected
     * @return {?}
     */
    set selected(selected) {
        this._selected = selected;
        this.onChangeCallback(this.processOnChangeCallback(selected));
    }
    /**
     * @return {?}
     */
    get selected() {
        return this._selected;
    }
    /**
     * @param {?} current
     * @return {?}
     */
    set currentDateView(current) {
        this._currentDateView = current.clone();
        this.weeks = this.dayCalendarService
            .generateMonthArray(this.componentConfig, this._currentDateView, this.selected);
        this.navLabel = this.dayCalendarService.getHeaderLabel(this.componentConfig, this._currentDateView);
        this.showLeftNav = this.dayCalendarService.shouldShowLeft(this.componentConfig.min, this.currentDateView);
        this.showRightNav = this.dayCalendarService.shouldShowRight(this.componentConfig.max, this.currentDateView);
    }
    /**
     * @return {?}
     */
    get currentDateView() {
        return this._currentDateView;
    }
    /**
     * @return {?}
     */
    ngOnInit() {
        this.isInited = true;
        this.init();
        this.initValidators();
    }
    /**
     * @return {?}
     */
    init() {
        this.componentConfig = this.dayCalendarService.getConfig(this.config);
        this.selected = this.selected || [];
        this.currentDateView = this.displayDate
            ? this.utilsService.convertToMoment(this.displayDate, this.componentConfig.format).clone()
            : this.utilsService
                .getDefaultDisplayDate(this.currentDateView, this.selected, this.componentConfig.allowMultiSelect, this.componentConfig.min);
        this.weekdays = this.dayCalendarService
            .generateWeekdays(this.componentConfig.firstDayOfWeek);
        this.inputValueType = this.utilsService.getInputType(this.inputValue, this.componentConfig.allowMultiSelect);
        this.monthCalendarConfig = this.dayCalendarService.getMonthCalendarConfig(this.componentConfig);
        this._shouldShowCurrent = this.shouldShowCurrent();
    }
    /**
     * @param {?} changes
     * @return {?}
     */
    ngOnChanges(changes) {
        if (this.isInited) {
            const { minDate, maxDate, config } = changes;
            this.handleConfigChange(config);
            this.init();
            if (minDate || maxDate) {
                this.initValidators();
            }
        }
    }
    /**
     * @param {?} value
     * @return {?}
     */
    writeValue(value) {
        this.inputValue = value;
        if (value) {
            this.selected = this.utilsService
                .convertToMomentArray(value, this.componentConfig.format, this.componentConfig.allowMultiSelect);
            this.inputValueType = this.utilsService
                .getInputType(this.inputValue, this.componentConfig.allowMultiSelect);
        }
        else {
            this.selected = [];
        }
        this.weeks = this.dayCalendarService
            .generateMonthArray(this.componentConfig, this.currentDateView, this.selected);
        this.cd.markForCheck();
    }
    /**
     * @param {?} fn
     * @return {?}
     */
    registerOnChange(fn) {
        this.onChangeCallback = fn;
    }
    /**
     * @param {?} _
     * @return {?}
     */
    onChangeCallback(_) {
    }
    ;
    /**
     * @param {?} fn
     * @return {?}
     */
    registerOnTouched(fn) {
    }
    /**
     * @param {?} formControl
     * @return {?}
     */
    validate(formControl) {
        if (this.minDate || this.maxDate) {
            return this.validateFn(formControl.value);
        }
        else {
            return () => null;
        }
    }
    /**
     * @param {?} value
     * @return {?}
     */
    processOnChangeCallback(value) {
        return this.utilsService.convertFromMomentArray(this.componentConfig.format, value, this.componentConfig.returnedValueType || this.inputValueType);
    }
    /**
     * @return {?}
     */
    initValidators() {
        this.validateFn = this.utilsService.createValidator({ minDate: this.minDate, maxDate: this.maxDate }, this.componentConfig.format, 'day');
        this.onChangeCallback(this.processOnChangeCallback(this.selected));
    }
    /**
     * @param {?} day
     * @return {?}
     */
    dayClicked(day) {
        if (day.selected && !this.componentConfig.unSelectOnClick) {
            return;
        }
        this.selected = this.utilsService
            .updateSelected(this.componentConfig.allowMultiSelect, this.selected, day);
        this.weeks = this.dayCalendarService
            .generateMonthArray(this.componentConfig, this.currentDateView, this.selected);
        this.onSelect.emit(day);
    }
    /**
     * @param {?} day
     * @return {?}
     */
    getDayBtnText(day) {
        return this.dayCalendarService.getDayBtnText(this.componentConfig, day.date);
    }
    /**
     * @param {?} day
     * @return {?}
     */
    getDayBtnCssClass(day) {
        const /** @type {?} */ cssClasses = {
            'dp-selected': day.selected,
            'dp-current-month': day.currentMonth,
            'dp-prev-month': day.prevMonth,
            'dp-next-month': day.nextMonth,
            'dp-current-day': day.currentDay
        };
        const /** @type {?} */ customCssClass = this.dayCalendarService.getDayBtnCssClass(this.componentConfig, day.date);
        if (customCssClass) {
            cssClasses[customCssClass] = true;
        }
        return cssClasses;
    }
    /**
     * @return {?}
     */
    onLeftNavClick() {
        const /** @type {?} */ from = this.currentDateView.clone();
        this.moveCalendarsBy(this.currentDateView, -1, 'month');
        const /** @type {?} */ to = this.currentDateView.clone();
        this.onLeftNav.emit({ from, to });
    }
    /**
     * @return {?}
     */
    onRightNavClick() {
        const /** @type {?} */ from = this.currentDateView.clone();
        this.moveCalendarsBy(this.currentDateView, 1, 'month');
        const /** @type {?} */ to = this.currentDateView.clone();
        this.onRightNav.emit({ from, to });
    }
    /**
     * @param {?} change
     * @return {?}
     */
    onMonthCalendarLeftClick(change) {
        this.onLeftNav.emit(change);
    }
    /**
     * @param {?} change
     * @return {?}
     */
    onMonthCalendarRightClick(change) {
        this.onRightNav.emit(change);
    }
    /**
     * @param {?} change
     * @return {?}
     */
    onMonthCalendarSecondaryLeftClick(change) {
        this.onRightNav.emit(change);
    }
    /**
     * @param {?} change
     * @return {?}
     */
    onMonthCalendarSecondaryRightClick(change) {
        this.onLeftNav.emit(change);
    }
    /**
     * @param {?} weekday
     * @return {?}
     */
    getWeekdayName(weekday) {
        if (this.componentConfig.weekDayFormatter) {
            return this.componentConfig.weekDayFormatter(weekday.day());
        }
        return weekday.format(this.componentConfig.weekDayFormat);
    }
    /**
     * @param {?} mode
     * @return {?}
     */
    toggleCalendarMode(mode) {
        if (this.currentCalendarMode !== mode) {
            this.currentCalendarMode = mode;
            this.onNavHeaderBtnClick.emit(mode);
        }
        this.cd.markForCheck();
    }
    /**
     * @param {?} month
     * @return {?}
     */
    monthSelected(month) {
        this.currentDateView = month.date.clone();
        this.currentCalendarMode = ECalendarMode.Day;
        this.onMonthSelect.emit(month);
    }
    /**
     * @param {?} current
     * @param {?} amount
     * @param {?=} granularity
     * @return {?}
     */
    moveCalendarsBy(current, amount, granularity = 'month') {
        this.currentDateView = current.clone().add(amount, granularity);
        this.cd.markForCheck();
    }
    /**
     * @param {?} to
     * @return {?}
     */
    moveCalendarTo(to) {
        if (to) {
            this.currentDateView = this.utilsService.convertToMoment(to, this.componentConfig.format);
        }
        this.cd.markForCheck();
    }
    /**
     * @return {?}
     */
    shouldShowCurrent() {
        return this.utilsService.shouldShowCurrent(this.componentConfig.showGoToCurrent, 'day', this.componentConfig.min, this.componentConfig.max);
    }
    /**
     * @return {?}
     */
    goToCurrent() {
        this.currentDateView = moment$5();
        this.onGoToCurrent.emit();
    }
    /**
     * @param {?} config
     * @return {?}
     */
    handleConfigChange(config) {
        if (config) {
            const /** @type {?} */ prevConf = this.dayCalendarService.getConfig(config.previousValue);
            const /** @type {?} */ currentConf = this.dayCalendarService.getConfig(config.currentValue);
            if (this.utilsService.shouldResetCurrentView(prevConf, currentConf)) {
                this._currentDateView = null;
            }
        }
    }
}
DayCalendarComponent.decorators = [
    { type: Component, args: [{
                selector: 'dp-day-calendar',
                template: `
    <div class="dp-day-calendar-container" *ngIf="currentCalendarMode ===  CalendarMode.Day">
      <dp-calendar-nav
          [label]="navLabel"
          [showLeftNav]="showLeftNav"
          [showRightNav]="showRightNav"
          [isLabelClickable]="componentConfig.enableMonthSelector"
          [showGoToCurrent]="_shouldShowCurrent"
          [theme]="theme"
          (onLeftNav)="onLeftNavClick()"
          (onRightNav)="onRightNavClick()"
          (onLabelClick)="toggleCalendarMode(CalendarMode.Month)"
          (onGoToCurrent)="goToCurrent()">
      </dp-calendar-nav>

      <div class="dp-calendar-wrapper"
           [ngClass]="{'dp-hide-near-month': !componentConfig.showNearMonthDays}">
        <div class="dp-weekdays">
          <span class="dp-calendar-weekday"
                *ngFor="let weekday of weekdays"
                [innerText]="getWeekdayName(weekday)">
          </span>
        </div>
        <div class="dp-calendar-week" *ngFor="let week of weeks">
          <span class="dp-week-number"
                *ngIf="componentConfig.showWeekNumbers"
                [innerText]="week[0].date.isoWeek()">
          </span>
          <button type="button"
                  class="dp-calendar-day"
                  *ngFor="let day of week"
                  [attr.data-date]="day.date.format(componentConfig.format)"
                  (click)="dayClicked(day)"
                  [disabled]="day.disabled"
                  [ngClass]="getDayBtnCssClass(day)"
                  [innerText]="getDayBtnText(day)">
          </button>
        </div>
      </div>
    </div>

    <dp-month-calendar
        *ngIf="currentCalendarMode ===  CalendarMode.Month"
        [config]="monthCalendarConfig"
        [displayDate]="_currentDateView"
        [theme]="theme"
        (onSelect)="monthSelected($event)"
        (onNavHeaderBtnClick)="toggleCalendarMode(CalendarMode.Day)"
        (onLeftNav)="onMonthCalendarLeftClick($event)"
        (onRightNav)="onMonthCalendarRightClick($event)"
        (onLeftSecondaryNav)="onMonthCalendarSecondaryLeftClick($event)"
        (onRightSecondaryNav)="onMonthCalendarSecondaryRightClick($event)">
    </dp-month-calendar>
  `,
                styles: [`
    dp-day-calendar {
      display: inline-block;
    }
    dp-day-calendar .dp-day-calendar-container {
      background: #FFFFFF;
    }
    dp-day-calendar .dp-calendar-wrapper {
      -webkit-box-sizing: border-box;
              box-sizing: border-box;
      border: 1px solid #000000;
    }
    dp-day-calendar .dp-calendar-wrapper .dp-calendar-weekday:first-child {
      border-left: none;
    }
    dp-day-calendar .dp-weekdays {
      font-size: 15px;
      margin-bottom: 5px;
    }
    dp-day-calendar .dp-calendar-weekday {
      -webkit-box-sizing: border-box;
              box-sizing: border-box;
      display: inline-block;
      width: 30px;
      text-align: center;
      border-left: 1px solid #000000;
      border-bottom: 1px solid #000000;
    }
    dp-day-calendar .dp-calendar-day {
      -webkit-box-sizing: border-box;
              box-sizing: border-box;
      width: 30px;
      height: 30px;
      cursor: pointer;
    }
    dp-day-calendar .dp-selected {
      background: #106CC8;
      color: #FFFFFF;
    }
    dp-day-calendar .dp-prev-month,
    dp-day-calendar .dp-next-month {
      opacity: 0.5;
    }
    dp-day-calendar .dp-hide-near-month .dp-prev-month,
    dp-day-calendar .dp-hide-near-month .dp-next-month {
      visibility: hidden;
    }
    dp-day-calendar .dp-week-number {
      position: absolute;
      font-size: 9px;
    }
    dp-day-calendar.dp-material .dp-calendar-weekday {
      height: 25px;
      width: 30px;
      line-height: 25px;
      color: #7a7a7a;
      border: none;
    }
    dp-day-calendar.dp-material .dp-calendar-wrapper {
      border: 1px solid #E0E0E0;
    }
    dp-day-calendar.dp-material .dp-calendar-month,
    dp-day-calendar.dp-material .dp-calendar-day {
      -webkit-box-sizing: border-box;
              box-sizing: border-box;
      background: #FFFFFF;
      border-radius: 50%;
      border: none;
      outline: none;
    }
    dp-day-calendar.dp-material .dp-calendar-month:hover,
    dp-day-calendar.dp-material .dp-calendar-day:hover {
      background: #E0E0E0;
    }
    dp-day-calendar.dp-material .dp-selected {
      background: #106CC8;
      color: #FFFFFF;
    }
    dp-day-calendar.dp-material .dp-selected:hover {
      background: #106CC8;
    }
    dp-day-calendar.dp-material .dp-current-day {
      border: 1px solid #106CC8;
    }
  `],
                encapsulation: ViewEncapsulation.None,
                changeDetection: ChangeDetectionStrategy.OnPush,
                providers: [
                    DayCalendarService,
                    {
                        provide: NG_VALUE_ACCESSOR,
                        useExisting: forwardRef(() => DayCalendarComponent),
                        multi: true
                    },
                    {
                        provide: NG_VALIDATORS,
                        useExisting: forwardRef(() => DayCalendarComponent),
                        multi: true
                    }
                ]
            },] },
];
/**
 * @nocollapse
 */
DayCalendarComponent.ctorParameters = () => [
    { type: DayCalendarService, },
    { type: UtilsService, },
    { type: ChangeDetectorRef, },
];
DayCalendarComponent.propDecorators = {
    'config': [{ type: Input },],
    'displayDate': [{ type: Input },],
    'minDate': [{ type: Input },],
    'maxDate': [{ type: Input },],
    'theme': [{ type: HostBinding, args: ['class',] }, { type: Input },],
    'onSelect': [{ type: Output },],
    'onMonthSelect': [{ type: Output },],
    'onNavHeaderBtnClick': [{ type: Output },],
    'onGoToCurrent': [{ type: Output },],
    'onLeftNav': [{ type: Output },],
    'onRightNav': [{ type: Output },],
};

const moment$7 = momentNs;
class MonthCalendarService {
    /**
     * @param {?} utilsService
     */
    constructor(utilsService) {
        this.utilsService = utilsService;
        this.DEFAULT_CONFIG = {
            allowMultiSelect: false,
            yearFormat: 'YYYY',
            format: 'MM-YYYY',
            isNavHeaderBtnClickable: false,
            monthBtnFormat: 'MMM',
            locale: moment$7.locale(),
            multipleYearsNavigateBy: 10,
            showMultipleYearsNavigation: false,
            unSelectOnClick: true
        };
    }
    /**
     * @param {?} config
     * @return {?}
     */
    getConfig(config) {
        const /** @type {?} */ _config = (Object.assign({}, this.DEFAULT_CONFIG, this.utilsService.clearUndefined(config)));
        this.utilsService.convertPropsToMoment(_config, _config.format, ['min', 'max']);
        moment$7.locale(_config.locale);
        return _config;
    }
    /**
     * @param {?} config
     * @param {?} year
     * @param {?=} selected
     * @return {?}
     */
    generateYear(config, year, selected = null) {
        const /** @type {?} */ index = year.clone().startOf('year');
        const /** @type {?} */ inRow = config.monthInRow && 12 % config.monthInRow === 0 ? config.monthInRow : 4;
        return this.utilsService.createArray(12 / inRow).map(() => {
            return this.utilsService.createArray(inRow).map(() => {
                const /** @type {?} */ date = index.clone();
                const /** @type {?} */ month = {
                    date,
                    selected: !!selected.find(s => index.isSame(s, 'month')),
                    currentMonth: index.isSame(moment$7(), 'month'),
                    disabled: this.isMonthDisabled(date, config),
                    text: this.getMonthBtnText(config, date)
                };
                index.add(1, 'month');
                return month;
            });
        });
    }
    /**
     * @param {?} date
     * @param {?} config
     * @return {?}
     */
    isMonthDisabled(date, config) {
        if (config.min && date.isBefore(config.min, 'month')) {
            return true;
        }
        return !!(config.max && date.isAfter(config.max, 'month'));
    }
    /**
     * @param {?} min
     * @param {?} currentMonthView
     * @return {?}
     */
    shouldShowLeft(min, currentMonthView) {
        return min ? min.isBefore(currentMonthView, 'year') : true;
    }
    /**
     * @param {?} max
     * @param {?} currentMonthView
     * @return {?}
     */
    shouldShowRight(max, currentMonthView) {
        return max ? max.isAfter(currentMonthView, 'year') : true;
    }
    /**
     * @param {?} config
     * @param {?} year
     * @return {?}
     */
    getHeaderLabel(config, year) {
        if (config.yearFormatter) {
            return config.yearFormatter(year);
        }
        return year.format(config.yearFormat);
    }
    /**
     * @param {?} config
     * @param {?} month
     * @return {?}
     */
    getMonthBtnText(config, month) {
        if (config.monthBtnFormatter) {
            return config.monthBtnFormatter(month);
        }
        return month.format(config.monthBtnFormat);
    }
    /**
     * @param {?} config
     * @param {?} month
     * @return {?}
     */
    getMonthBtnCssClass(config, month) {
        if (config.monthBtnCssClassCallback) {
            return config.monthBtnCssClassCallback(month);
        }
        return '';
    }
}
MonthCalendarService.decorators = [
    { type: Injectable },
];
/**
 * @nocollapse
 */
MonthCalendarService.ctorParameters = () => [
    { type: UtilsService, },
];

const moment$6 = momentNs;
class MonthCalendarComponent {
    /**
     * @param {?} monthCalendarService
     * @param {?} utilsService
     * @param {?} cd
     */
    constructor(monthCalendarService, utilsService, cd) {
        this.monthCalendarService = monthCalendarService;
        this.utilsService = utilsService;
        this.cd = cd;
        this.onSelect = new EventEmitter();
        this.onNavHeaderBtnClick = new EventEmitter();
        this.onGoToCurrent = new EventEmitter();
        this.onLeftNav = new EventEmitter();
        this.onRightNav = new EventEmitter();
        this.onLeftSecondaryNav = new EventEmitter();
        this.onRightSecondaryNav = new EventEmitter();
        this.isInited = false;
        this._shouldShowCurrent = true;
        this.api = {
            toggleCalendar: this.toggleCalendarMode.bind(this),
            moveCalendarTo: this.moveCalendarTo.bind(this)
        };
    }
    /**
     * @param {?} selected
     * @return {?}
     */
    set selected(selected) {
        this._selected = selected;
        this.onChangeCallback(this.processOnChangeCallback(selected));
    }
    /**
     * @return {?}
     */
    get selected() {
        return this._selected;
    }
    /**
     * @param {?} current
     * @return {?}
     */
    set currentDateView(current) {
        this._currentDateView = current.clone();
        this.yearMonths = this.monthCalendarService
            .generateYear(this.componentConfig, this._currentDateView, this.selected);
        this.navLabel = this.monthCalendarService.getHeaderLabel(this.componentConfig, this.currentDateView);
        this.showLeftNav = this.monthCalendarService.shouldShowLeft(this.componentConfig.min, this._currentDateView);
        this.showRightNav = this.monthCalendarService.shouldShowRight(this.componentConfig.max, this.currentDateView);
        this.showSecondaryLeftNav = this.componentConfig.showMultipleYearsNavigation && this.showLeftNav;
        this.showSecondaryRightNav = this.componentConfig.showMultipleYearsNavigation && this.showRightNav;
    }
    /**
     * @return {?}
     */
    get currentDateView() {
        return this._currentDateView;
    }
    /**
     * @return {?}
     */
    ngOnInit() {
        this.isInited = true;
        this.init();
        this.initValidators();
    }
    /**
     * @param {?} changes
     * @return {?}
     */
    ngOnChanges(changes) {
        if (this.isInited) {
            const { minDate, maxDate, config } = changes;
            this.handleConfigChange(config);
            this.init();
            if (minDate || maxDate) {
                this.initValidators();
            }
        }
    }
    /**
     * @return {?}
     */
    init() {
        this.componentConfig = this.monthCalendarService.getConfig(this.config);
        this.selected = this.selected || [];
        this.currentDateView = this.displayDate
            ? this.displayDate
            : this.utilsService
                .getDefaultDisplayDate(this.currentDateView, this.selected, this.componentConfig.allowMultiSelect, this.componentConfig.min);
        this.inputValueType = this.utilsService.getInputType(this.inputValue, this.componentConfig.allowMultiSelect);
        this._shouldShowCurrent = this.shouldShowCurrent();
    }
    /**
     * @param {?} value
     * @return {?}
     */
    writeValue(value) {
        this.inputValue = value;
        if (value) {
            this.selected = this.utilsService
                .convertToMomentArray(value, this.componentConfig.format, this.componentConfig.allowMultiSelect);
            this.yearMonths = this.monthCalendarService
                .generateYear(this.componentConfig, this.currentDateView, this.selected);
            this.inputValueType = this.utilsService.getInputType(this.inputValue, this.componentConfig.allowMultiSelect);
        }
        this.cd.markForCheck();
    }
    /**
     * @param {?} fn
     * @return {?}
     */
    registerOnChange(fn) {
        this.onChangeCallback = fn;
    }
    /**
     * @param {?} _
     * @return {?}
     */
    onChangeCallback(_) {
    }
    ;
    /**
     * @param {?} fn
     * @return {?}
     */
    registerOnTouched(fn) {
    }
    /**
     * @param {?} formControl
     * @return {?}
     */
    validate(formControl) {
        if (this.minDate || this.maxDate) {
            return this.validateFn(formControl.value);
        }
        else {
            return () => null;
        }
    }
    /**
     * @param {?} value
     * @return {?}
     */
    processOnChangeCallback(value) {
        return this.utilsService.convertFromMomentArray(this.componentConfig.format, value, this.componentConfig.returnedValueType || this.inputValueType);
    }
    /**
     * @return {?}
     */
    initValidators() {
        this.validateFn = this.validateFn = this.utilsService.createValidator({ minDate: this.minDate, maxDate: this.maxDate }, this.componentConfig.format, 'month');
        this.onChangeCallback(this.processOnChangeCallback(this.selected));
    }
    /**
     * @param {?} month
     * @return {?}
     */
    monthClicked(month) {
        if (month.selected && !this.componentConfig.unSelectOnClick) {
            return;
        }
        this.selected = this.utilsService
            .updateSelected(this.componentConfig.allowMultiSelect, this.selected, month, 'month');
        this.yearMonths = this.monthCalendarService
            .generateYear(this.componentConfig, this.currentDateView, this.selected);
        this.onSelect.emit(month);
    }
    /**
     * @return {?}
     */
    onLeftNavClick() {
        const /** @type {?} */ from = this.currentDateView.clone();
        this.currentDateView = this.currentDateView.clone().subtract(1, 'year');
        const /** @type {?} */ to = this.currentDateView.clone();
        this.yearMonths = this.monthCalendarService.generateYear(this.componentConfig, this.currentDateView, this.selected);
        this.onLeftNav.emit({ from, to });
    }
    /**
     * @return {?}
     */
    onLeftSecondaryNavClick() {
        let /** @type {?} */ navigateBy = this.componentConfig.multipleYearsNavigateBy;
        const /** @type {?} */ isOutsideRange = this.componentConfig.min &&
            this.currentDateView.year() - this.componentConfig.min.year() < navigateBy;
        if (isOutsideRange) {
            navigateBy = this.currentDateView.year() - this.componentConfig.min.year();
        }
        const /** @type {?} */ from = this.currentDateView.clone();
        this.currentDateView = this.currentDateView.clone().subtract(navigateBy, 'year');
        const /** @type {?} */ to = this.currentDateView.clone();
        this.onLeftSecondaryNav.emit({ from, to });
    }
    /**
     * @return {?}
     */
    onRightNavClick() {
        const /** @type {?} */ from = this.currentDateView.clone();
        this.currentDateView = this.currentDateView.clone().add(1, 'year');
        const /** @type {?} */ to = this.currentDateView.clone();
        this.onRightNav.emit({ from, to });
    }
    /**
     * @return {?}
     */
    onRightSecondaryNavClick() {
        let /** @type {?} */ navigateBy = this.componentConfig.multipleYearsNavigateBy;
        const /** @type {?} */ isOutsideRange = this.componentConfig.max &&
            this.componentConfig.max.year() - this.currentDateView.year() < navigateBy;
        if (isOutsideRange) {
            navigateBy = this.componentConfig.max.year() - this.currentDateView.year();
        }
        const /** @type {?} */ from = this.currentDateView.clone();
        this.currentDateView = this.currentDateView.clone().add(navigateBy, 'year');
        const /** @type {?} */ to = this.currentDateView.clone();
        this.onRightSecondaryNav.emit({ from, to });
    }
    /**
     * @return {?}
     */
    toggleCalendarMode() {
        this.onNavHeaderBtnClick.emit();
    }
    /**
     * @param {?} month
     * @return {?}
     */
    getMonthBtnCssClass(month) {
        const /** @type {?} */ cssClass = {
            'dp-selected': month.selected,
            'dp-current-month': month.currentMonth
        };
        const /** @type {?} */ customCssClass = this.monthCalendarService.getMonthBtnCssClass(this.componentConfig, month.date);
        if (customCssClass) {
            cssClass[customCssClass] = true;
        }
        return cssClass;
    }
    /**
     * @return {?}
     */
    shouldShowCurrent() {
        return this.utilsService.shouldShowCurrent(this.componentConfig.showGoToCurrent, 'month', this.componentConfig.min, this.componentConfig.max);
    }
    /**
     * @return {?}
     */
    goToCurrent() {
        this.currentDateView = moment$6();
        this.onGoToCurrent.emit();
    }
    /**
     * @param {?} to
     * @return {?}
     */
    moveCalendarTo(to) {
        if (to) {
            this.currentDateView = this.utilsService.convertToMoment(to, this.componentConfig.format);
            this.cd.markForCheck();
        }
    }
    /**
     * @param {?} config
     * @return {?}
     */
    handleConfigChange(config) {
        if (config) {
            const /** @type {?} */ prevConf = this.monthCalendarService.getConfig(config.previousValue);
            const /** @type {?} */ currentConf = this.monthCalendarService.getConfig(config.currentValue);
            if (this.utilsService.shouldResetCurrentView(prevConf, currentConf)) {
                this._currentDateView = null;
            }
        }
    }
}
MonthCalendarComponent.decorators = [
    { type: Component, args: [{
                selector: 'dp-month-calendar',
                template: `
    <div class="dp-month-calendar-container">
      <dp-calendar-nav
          [label]="navLabel"
          [showLeftNav]="showLeftNav"
          [showLeftSecondaryNav]="showSecondaryLeftNav"
          [showRightNav]="showRightNav"
          [showRightSecondaryNav]="showSecondaryRightNav"
          [isLabelClickable]="componentConfig.isNavHeaderBtnClickable"
          [showGoToCurrent]="shouldShowCurrent()"
          [theme]="theme"
          (onLeftNav)="onLeftNavClick()"
          (onLeftSecondaryNav)="onLeftSecondaryNavClick()"
          (onRightNav)="onRightNavClick()"
          (onRightSecondaryNav)="onRightSecondaryNavClick()"
          (onLabelClick)="toggleCalendarMode()"
          (onGoToCurrent)="goToCurrent()">
      </dp-calendar-nav>

      <div class="dp-calendar-wrapper">
        <div class="dp-months-row" *ngFor="let monthRow of yearMonths">
          <button type="button"
                  class="dp-calendar-month"
                  *ngFor="let month of monthRow"
                  [attr.data-date]="month.date.format(componentConfig.format)"
                  [disabled]="month.disabled"
                  [ngClass]="getMonthBtnCssClass(month)"
                  (click)="monthClicked(month)"
                  [innerText]="month.text">
          </button>
        </div>
      </div>
    </div>
  `,
                styles: [`
    dp-month-calendar {
      display: inline-block;
    }
    dp-month-calendar .dp-month-calendar-container {
      background: #FFFFFF;
    }
    dp-month-calendar .dp-calendar-wrapper {
      border: 1px solid #000000;
    }
    dp-month-calendar .dp-calendar-month {
      -webkit-box-sizing: border-box;
              box-sizing: border-box;
      width: 52.5px;
      height: 52.5px;
      cursor: pointer;
    }
    dp-month-calendar .dp-calendar-month.dp-selected {
      background: #106CC8;
      color: #FFFFFF;
    }
    dp-month-calendar.dp-material .dp-calendar-weekday {
      height: 25px;
      width: 30px;
      line-height: 25px;
      background: #E0E0E0;
      border: 1px solid #E0E0E0;
    }
    dp-month-calendar.dp-material .dp-calendar-wrapper {
      border: 1px solid #E0E0E0;
    }
    dp-month-calendar.dp-material .dp-calendar-month {
      -webkit-box-sizing: border-box;
              box-sizing: border-box;
      background: #FFFFFF;
      border-radius: 50%;
      border: none;
      outline: none;
    }
    dp-month-calendar.dp-material .dp-calendar-month:hover {
      background: #E0E0E0;
    }
    dp-month-calendar.dp-material .dp-selected {
      background: #106CC8;
      color: #FFFFFF;
    }
    dp-month-calendar.dp-material .dp-selected:hover {
      background: #106CC8;
    }
    dp-month-calendar.dp-material .dp-current-month {
      border: 1px solid #106CC8;
    }
  `],
                encapsulation: ViewEncapsulation.None,
                changeDetection: ChangeDetectionStrategy.OnPush,
                providers: [
                    MonthCalendarService,
                    {
                        provide: NG_VALUE_ACCESSOR,
                        useExisting: forwardRef(() => MonthCalendarComponent),
                        multi: true
                    },
                    {
                        provide: NG_VALIDATORS,
                        useExisting: forwardRef(() => MonthCalendarComponent),
                        multi: true
                    }
                ]
            },] },
];
/**
 * @nocollapse
 */
MonthCalendarComponent.ctorParameters = () => [
    { type: MonthCalendarService, },
    { type: UtilsService, },
    { type: ChangeDetectorRef, },
];
MonthCalendarComponent.propDecorators = {
    'config': [{ type: Input },],
    'displayDate': [{ type: Input },],
    'minDate': [{ type: Input },],
    'maxDate': [{ type: Input },],
    'theme': [{ type: HostBinding, args: ['class',] }, { type: Input },],
    'onSelect': [{ type: Output },],
    'onNavHeaderBtnClick': [{ type: Output },],
    'onGoToCurrent': [{ type: Output },],
    'onLeftNav': [{ type: Output },],
    'onRightNav': [{ type: Output },],
    'onLeftSecondaryNav': [{ type: Output },],
    'onRightSecondaryNav': [{ type: Output },],
};

const moment$8 = momentNs;
class TimeSelectComponent {
    /**
     * @param {?} timeSelectService
     * @param {?} utilsService
     * @param {?} cd
     */
    constructor(timeSelectService, utilsService, cd) {
        this.timeSelectService = timeSelectService;
        this.utilsService = utilsService;
        this.cd = cd;
        this.onChange = new EventEmitter();
        this.isInited = false;
        this.api = {
            triggerChange: this.emitChange.bind(this)
        };
    }
    /**
     * @param {?} selected
     * @return {?}
     */
    set selected(selected) {
        this._selected = selected;
        this.calculateTimeParts(this.selected);
        this.showDecHour = this.timeSelectService.shouldShowDecrease(this.componentConfig, this._selected, 'hour');
        this.showDecMinute = this.timeSelectService.shouldShowDecrease(this.componentConfig, this._selected, 'minute');
        this.showDecSecond = this.timeSelectService.shouldShowDecrease(this.componentConfig, this._selected, 'second');
        this.showIncHour = this.timeSelectService.shouldShowIncrease(this.componentConfig, this._selected, 'hour');
        this.showIncMinute = this.timeSelectService.shouldShowIncrease(this.componentConfig, this._selected, 'minute');
        this.showIncSecond = this.timeSelectService.shouldShowIncrease(this.componentConfig, this._selected, 'second');
        this.showToggleMeridiem = this.timeSelectService.shouldShowToggleMeridiem(this.componentConfig, this._selected);
        this.onChangeCallback(this.processOnChangeCallback(selected));
    }
    /**
     * @return {?}
     */
    get selected() {
        return this._selected;
    }
    /**
     * @return {?}
     */
    ngOnInit() {
        this.isInited = true;
        this.init();
        this.initValidators();
    }
    /**
     * @return {?}
     */
    init() {
        this.componentConfig = this.timeSelectService.getConfig(this.config);
        this.selected = this.selected || moment$8();
        this.inputValueType = this.utilsService.getInputType(this.inputValue, false);
    }
    /**
     * @param {?} changes
     * @return {?}
     */
    ngOnChanges(changes) {
        if (this.isInited) {
            const { minDate, maxDate, minTime, maxTime } = changes;
            this.init();
            if (minDate || maxDate || minTime || maxTime) {
                this.initValidators();
            }
        }
    }
    /**
     * @param {?} value
     * @return {?}
     */
    writeValue(value) {
        this.inputValue = value;
        if (value) {
            const /** @type {?} */ momentValue = this.utilsService
                .convertToMomentArray(value, this.timeSelectService.getTimeFormat(this.componentConfig), false)[0];
            if (momentValue.isValid()) {
                this.selected = momentValue;
                this.inputValueType = this.utilsService
                    .getInputType(this.inputValue, false);
            }
        }
        this.cd.markForCheck();
    }
    /**
     * @param {?} fn
     * @return {?}
     */
    registerOnChange(fn) {
        this.onChangeCallback = fn;
    }
    /**
     * @param {?} _
     * @return {?}
     */
    onChangeCallback(_) {
    }
    ;
    /**
     * @param {?} fn
     * @return {?}
     */
    registerOnTouched(fn) {
    }
    /**
     * @param {?} formControl
     * @return {?}
     */
    validate(formControl) {
        if (this.minDate || this.maxDate || this.minTime || this.maxTime) {
            return this.validateFn(formControl.value);
        }
        else {
            return () => null;
        }
    }
    /**
     * @param {?} value
     * @return {?}
     */
    processOnChangeCallback(value) {
        return this.utilsService.convertFromMomentArray(this.timeSelectService.getTimeFormat(this.componentConfig), [value], this.componentConfig.returnedValueType || this.inputValueType);
    }
    /**
     * @return {?}
     */
    initValidators() {
        this.validateFn = this.utilsService.createValidator({
            minDate: this.minDate,
            maxDate: this.maxDate,
            minTime: this.minTime,
            maxTime: this.maxTime
        }, undefined, 'day');
        this.onChangeCallback(this.processOnChangeCallback(this.selected));
    }
    /**
     * @param {?} unit
     * @return {?}
     */
    decrease(unit) {
        this.selected = this.timeSelectService.decrease(this.componentConfig, this.selected, unit);
        this.emitChange();
    }
    /**
     * @param {?} unit
     * @return {?}
     */
    increase(unit) {
        this.selected = this.timeSelectService.increase(this.componentConfig, this.selected, unit);
        this.emitChange();
    }
    /**
     * @return {?}
     */
    toggleMeridiem() {
        this.selected = this.timeSelectService.toggleMeridiem(this.selected);
        this.emitChange();
    }
    /**
     * @return {?}
     */
    emitChange() {
        this.onChange.emit({ date: this.selected, selected: false });
        this.cd.markForCheck();
    }
    /**
     * @param {?} time
     * @return {?}
     */
    calculateTimeParts(time) {
        this.hours = this.timeSelectService.getHours(this.componentConfig, time);
        this.minutes = this.timeSelectService.getMinutes(this.componentConfig, time);
        this.seconds = this.timeSelectService.getSeconds(this.componentConfig, time);
        this.meridiem = this.timeSelectService.getMeridiem(this.componentConfig, time);
    }
}
TimeSelectComponent.decorators = [
    { type: Component, args: [{
                selector: 'dp-time-select',
                template: `
    <ul class="dp-time-select-controls">
      <li class="dp-time-select-control dp-time-select-control-hours">
        <button type="button"
                class="dp-time-select-control-up"
                [disabled]="!showIncHour"
                (click)="increase('hour')">
        </button>
        <span class="dp-time-select-display-hours"
              [innerText]="hours">
        </span>
        <button type="button"
                class="dp-time-select-control-down"
                [disabled]="!showDecHour"
                (click)="decrease('hour')"></button>
      </li>
      <li class="dp-time-select-control dp-time-select-separator"
          [innerText]="componentConfig.timeSeparator">
      </li>
      <li class="dp-time-select-control dp-time-select-control-minutes">
        <button type="button"
                class="dp-time-select-control-up"
                [disabled]="!showIncMinute"
                (click)="increase('minute')"></button>
        <span class="dp-time-select-display-minutes"
              [innerText]="minutes">
        </span>
        <button type="button"
                [disabled]="!showDecMinute" class="dp-time-select-control-down"
                (click)="decrease('minute')"></button>
      </li>
      <ng-container *ngIf="componentConfig.showSeconds">
        <li class="dp-time-select-control dp-time-select-separator"
            [innerText]="componentConfig.timeSeparator">
        </li>
        <li class="dp-time-select-control dp-time-select-control-seconds">
          <button type="button"
                  class="dp-time-select-control-up"
                  [disabled]="!showIncSecond"
                  (click)="increase('second')"></button>
          <span class="dp-time-select-display-seconds"
                [innerText]="seconds">
          </span>
          <button type="button"
                  class="dp-time-select-control-down"
                  [disabled]="!showDecSecond"
                  (click)="decrease('second')"></button>
        </li>
      </ng-container>
      <li class="dp-time-select-control dp-time-select-control-meridiem" *ngIf="!componentConfig.showTwentyFourHours">
        <button type="button"
                class="dp-time-select-control-up"
                [disabled]="!showToggleMeridiem"
                (click)="toggleMeridiem()"></button>
        <span class="dp-time-select-display-meridiem"
              [innerText]="meridiem">
        </span>
        <button type="button"
                class="dp-time-select-control-down"
                [disabled]="!showToggleMeridiem"
                (click)="toggleMeridiem()"></button>
      </li>
    </ul>
  `,
                styles: [`
    dp-time-select {
      display: inline-block;
    }
    dp-time-select .dp-time-select-controls {
      margin: 0;
      padding: 0;
      text-align: center;
      line-height: normal;
      background: #FFFFFF;
    }
    dp-time-select .dp-time-select-control {
      display: inline-block;
      width: 35px;
      margin: 0 auto;
      vertical-align: middle;
      font-size: inherit;
      letter-spacing: 1px;
    }
    dp-time-select .dp-time-select-control-up,
    dp-time-select .dp-time-select-control-down {
      position: relative;
      display: block;
      width: 24px;
      height: 24px;
      margin: 3px auto;
      cursor: pointer;
    }
    dp-time-select .dp-time-select-control-up::before,
    dp-time-select .dp-time-select-control-down::before {
      position: relative;
      content: '';
      display: inline-block;
      height: 8px;
      width: 8px;
      vertical-align: baseline;
      border-style: solid;
      border-width: 2px 2px 0 0;
      -webkit-transform: rotate(0deg);
              transform: rotate(0deg);
    }
    dp-time-select .dp-time-select-control-up::before {
      -webkit-transform: rotate(-45deg);
              transform: rotate(-45deg);
      top: 4px;
    }
    dp-time-select .dp-time-select-control-down::before {
      -webkit-transform: rotate(135deg);
              transform: rotate(135deg);
    }
    dp-time-select .dp-time-select-separator {
      width: 5px;
    }
    dp-time-select.dp-material .dp-time-select-control-up,
    dp-time-select.dp-material .dp-time-select-control-down {
      -webkit-box-sizing: border-box;
              box-sizing: border-box;
      background: transparent;
      border: none;
      outline: none;
      border-radius: 50%;
    }
    dp-time-select.dp-material .dp-time-select-control-up::before,
    dp-time-select.dp-material .dp-time-select-control-down::before {
      left: 0;
    }
    dp-time-select.dp-material .dp-time-select-control-up:hover,
    dp-time-select.dp-material .dp-time-select-control-down:hover {
      background: #E0E0E0;
    }
  `],
                encapsulation: ViewEncapsulation.None,
                changeDetection: ChangeDetectionStrategy.OnPush,
                providers: [
                    TimeSelectService,
                    {
                        provide: NG_VALUE_ACCESSOR,
                        useExisting: forwardRef(() => TimeSelectComponent),
                        multi: true
                    },
                    {
                        provide: NG_VALIDATORS,
                        useExisting: forwardRef(() => TimeSelectComponent),
                        multi: true
                    }
                ]
            },] },
];
/**
 * @nocollapse
 */
TimeSelectComponent.ctorParameters = () => [
    { type: TimeSelectService, },
    { type: UtilsService, },
    { type: ChangeDetectorRef, },
];
TimeSelectComponent.propDecorators = {
    'config': [{ type: Input },],
    'displayDate': [{ type: Input },],
    'minDate': [{ type: Input },],
    'maxDate': [{ type: Input },],
    'minTime': [{ type: Input },],
    'maxTime': [{ type: Input },],
    'theme': [{ type: HostBinding, args: ['class',] }, { type: Input },],
    'onChange': [{ type: Output },],
};

class CalendarNavComponent {
    constructor() {
        this.isLabelClickable = false;
        this.showLeftNav = true;
        this.showLeftSecondaryNav = false;
        this.showRightNav = true;
        this.showRightSecondaryNav = false;
        this.leftNavDisabled = false;
        this.leftSecondaryNavDisabled = false;
        this.rightNavDisabled = false;
        this.rightSecondaryNavDisabled = false;
        this.showGoToCurrent = true;
        this.onLeftNav = new EventEmitter();
        this.onLeftSecondaryNav = new EventEmitter();
        this.onRightNav = new EventEmitter();
        this.onRightSecondaryNav = new EventEmitter();
        this.onLabelClick = new EventEmitter();
        this.onGoToCurrent = new EventEmitter();
    }
    /**
     * @return {?}
     */
    leftNavClicked() {
        this.onLeftNav.emit();
    }
    /**
     * @return {?}
     */
    leftSecondaryNavClicked() {
        this.onLeftSecondaryNav.emit();
    }
    /**
     * @return {?}
     */
    rightNavClicked() {
        this.onRightNav.emit();
    }
    /**
     * @return {?}
     */
    rightSecondaryNavClicked() {
        this.onRightSecondaryNav.emit();
    }
    /**
     * @return {?}
     */
    labelClicked() {
        this.onLabelClick.emit();
    }
}
CalendarNavComponent.decorators = [
    { type: Component, args: [{
                selector: 'dp-calendar-nav',
                template: `
    <div class="dp-calendar-nav-container">
      <div class="dp-nav-header">
        <span [hidden]="isLabelClickable"
              [attr.data-hidden]="isLabelClickable"
              [innerText]="label">
        </span>
        <button type="button"
                class="dp-nav-header-btn"
                [hidden]="!isLabelClickable"
                [attr.data-hidden]="!isLabelClickable"
                (click)="labelClicked()"
                [innerText]="label">
        </button>
      </div>

      <div class="dp-nav-btns-container">
        <div class="dp-calendar-nav-container-left">
          <button type="button"
                  class="dp-calendar-secondary-nav-left"
                  *ngIf="showLeftSecondaryNav"
                  [disabled]="leftSecondaryNavDisabled"
                  (click)="leftSecondaryNavClicked()">
          </button>
          <button type="button"
                  class="dp-calendar-nav-left"
                  [hidden]="!showLeftNav"
                  [attr.data-hidden]="!showLeftNav"
                  [disabled]="leftNavDisabled"
                  (click)="leftNavClicked()">
          </button>
        </div>
        <button type="button"
                class="dp-current-location-btn"
                *ngIf="showGoToCurrent"
                (click)="onGoToCurrent.emit()">
        </button>
        <div class="dp-calendar-nav-container-right">
          <button type="button"
                  class="dp-calendar-nav-right"
                  [hidden]="!showRightNav"
                  [attr.data-hidden]="!showRightNav"
                  [disabled]="rightNavDisabled"
                  (click)="rightNavClicked()">
          </button>
          <button type="button"
                  class="dp-calendar-secondary-nav-right"
                  *ngIf="showRightSecondaryNav"
                  [disabled]="rightSecondaryNavDisabled"
                  (click)="rightSecondaryNavClicked()">
          </button>
        </div>
      </div>
    </div>
  `,
                styles: [`
    dp-calendar-nav .dp-calendar-nav-container {
      position: relative;
      -webkit-box-sizing: border-box;
              box-sizing: border-box;
      height: 25px;
      border: 1px solid #000000;
      border-bottom: none;
    }
    dp-calendar-nav .dp-nav-date-btn {
      -webkit-box-sizing: border-box;
              box-sizing: border-box;
      height: 25px;
      border: 1px solid #000000;
      border-bottom: none;
    }
    dp-calendar-nav .dp-nav-btns-container {
      position: absolute;
      top: 50%;
      -webkit-transform: translateY(-50%);
              transform: translateY(-50%);
      right: 5px;
      display: inline-block;
    }
    dp-calendar-nav .dp-calendar-nav-container-left,
    dp-calendar-nav .dp-calendar-nav-container-right {
      display: inline-block;
    }
    dp-calendar-nav .dp-calendar-nav-left,
    dp-calendar-nav .dp-calendar-nav-right,
    dp-calendar-nav .dp-calendar-secondary-nav-left,
    dp-calendar-nav .dp-calendar-secondary-nav-right {
      position: relative;
      width: 16px;
      cursor: pointer;
    }
    dp-calendar-nav .dp-calendar-nav-left,
    dp-calendar-nav .dp-calendar-nav-right {
      line-height: 0;
    }
    dp-calendar-nav .dp-calendar-nav-left::before,
    dp-calendar-nav .dp-calendar-nav-right::before {
      position: relative;
      content: '';
      display: inline-block;
      height: 8px;
      width: 8px;
      vertical-align: baseline;
      border-style: solid;
      border-width: 2px 2px 0 0;
      -webkit-transform: rotate(45deg);
              transform: rotate(45deg);
    }
    dp-calendar-nav .dp-calendar-secondary-nav-left,
    dp-calendar-nav .dp-calendar-secondary-nav-right {
      padding: 0;
    }
    dp-calendar-nav .dp-calendar-secondary-nav-left::before,
    dp-calendar-nav .dp-calendar-secondary-nav-right::before,
    dp-calendar-nav .dp-calendar-secondary-nav-left::after,
    dp-calendar-nav .dp-calendar-secondary-nav-right::after {
      position: relative;
      content: '';
      display: inline-block;
      height: 8px;
      width: 8px;
      vertical-align: baseline;
      border-style: solid;
      border-width: 2px 2px 0 0;
      -webkit-transform: rotate(45deg);
              transform: rotate(45deg);
    }
    dp-calendar-nav .dp-calendar-secondary-nav-left::before,
    dp-calendar-nav .dp-calendar-secondary-nav-right::before {
      right: -10px;
    }
    dp-calendar-nav .dp-calendar-secondary-nav-right {
      left: initial;
      right: 5px;
    }
    dp-calendar-nav .dp-calendar-nav-left::before {
      position: relative;
      content: '';
      display: inline-block;
      height: 8px;
      width: 8px;
      vertical-align: baseline;
      border-style: solid;
      border-width: 2px 2px 0 0;
      -webkit-transform: rotate(-135deg);
              transform: rotate(-135deg);
    }
    dp-calendar-nav .dp-calendar-secondary-nav-left::before,
    dp-calendar-nav .dp-calendar-secondary-nav-left::after {
      position: relative;
      content: '';
      display: inline-block;
      height: 8px;
      width: 8px;
      vertical-align: baseline;
      border-style: solid;
      border-width: 2px 2px 0 0;
      -webkit-transform: rotate(-135deg);
              transform: rotate(-135deg);
    }
    dp-calendar-nav .dp-calendar-secondary-nav-left::before {
      right: -10px;
    }
    dp-calendar-nav .dp-nav-header {
      position: absolute;
      top: 50%;
      -webkit-transform: translateY(-50%);
              transform: translateY(-50%);
      left: 5px;
      display: inline-block;
      font-size: 13px;
    }
    dp-calendar-nav .dp-nav-header-btn {
      cursor: pointer;
    }
    dp-calendar-nav .dp-current-location-btn {
      position: relative;
      top: -1px;
      height: 16px;
      width: 16px;
      vertical-align: middle;
      background: rgba(0, 0, 0, 0.6);
      border: 1px solid rgba(0, 0, 0, 0.6);
      outline: none;
      border-radius: 50%;
      -webkit-box-shadow: inset 0 0 0 3px #FFFFFF;
              box-shadow: inset 0 0 0 3px #FFFFFF;
      cursor: pointer;
    }
    dp-calendar-nav .dp-current-location-btn:hover {
      background: #000000;
    }
    dp-calendar-nav.dp-material .dp-calendar-nav-container {
      height: 30px;
      border: 1px solid #E0E0E0;
    }
    dp-calendar-nav.dp-material .dp-calendar-nav-left,
    dp-calendar-nav.dp-material .dp-calendar-nav-right,
    dp-calendar-nav.dp-material .dp-calendar-secondary-nav-left,
    dp-calendar-nav.dp-material .dp-calendar-secondary-nav-right {
      border: none;
      background: #FFFFFF;
      outline: none;
      font-size: 16px;
      padding: 0;
    }
    dp-calendar-nav.dp-material .dp-calendar-secondary-nav-left,
    dp-calendar-nav.dp-material .dp-calendar-secondary-nav-right {
      width: 20px;
    }
    dp-calendar-nav.dp-material .dp-nav-header-btn {
      height: 20px;
      width: 80px;
      border: none;
      background: #FFFFFF;
      outline: none;
    }
    dp-calendar-nav.dp-material .dp-nav-header-btn:hover {
      background: rgba(0, 0, 0, 0.05);
    }
    dp-calendar-nav.dp-material .dp-nav-header-btn:active {
      background: rgba(0, 0, 0, 0.1);
    }
  `],
                encapsulation: ViewEncapsulation.None,
                changeDetection: ChangeDetectionStrategy.OnPush
            },] },
];
/**
 * @nocollapse
 */
CalendarNavComponent.ctorParameters = () => [];
CalendarNavComponent.propDecorators = {
    'label': [{ type: Input },],
    'isLabelClickable': [{ type: Input },],
    'showLeftNav': [{ type: Input },],
    'showLeftSecondaryNav': [{ type: Input },],
    'showRightNav': [{ type: Input },],
    'showRightSecondaryNav': [{ type: Input },],
    'leftNavDisabled': [{ type: Input },],
    'leftSecondaryNavDisabled': [{ type: Input },],
    'rightNavDisabled': [{ type: Input },],
    'rightSecondaryNavDisabled': [{ type: Input },],
    'showGoToCurrent': [{ type: Input },],
    'theme': [{ type: HostBinding, args: ['class',] }, { type: Input },],
    'onLeftNav': [{ type: Output },],
    'onLeftSecondaryNav': [{ type: Output },],
    'onRightNav': [{ type: Output },],
    'onRightSecondaryNav': [{ type: Output },],
    'onLabelClick': [{ type: Output },],
    'onGoToCurrent': [{ type: Output },],
};

class DayTimeCalendarComponent {
    /**
     * @param {?} dayTimeCalendarService
     * @param {?} utilsService
     * @param {?} cd
     */
    constructor(dayTimeCalendarService, utilsService, cd) {
        this.dayTimeCalendarService = dayTimeCalendarService;
        this.utilsService = utilsService;
        this.cd = cd;
        this.onChange = new EventEmitter();
        this.onGoToCurrent = new EventEmitter();
        this.onLeftNav = new EventEmitter();
        this.onRightNav = new EventEmitter();
        this.isInited = false;
        this.api = {
            moveCalendarTo: this.moveCalendarTo.bind(this)
        };
    }
    /**
     * @param {?} selected
     * @return {?}
     */
    set selected(selected) {
        this._selected = selected;
        this.onChangeCallback(this.processOnChangeCallback(selected));
    }
    /**
     * @return {?}
     */
    get selected() {
        return this._selected;
    }
    /**
     * @return {?}
     */
    ngOnInit() {
        this.isInited = true;
        this.init();
        this.initValidators();
    }
    /**
     * @return {?}
     */
    init() {
        this.componentConfig = this.dayTimeCalendarService.getConfig(this.config);
        this.inputValueType = this.utilsService.getInputType(this.inputValue, false);
    }
    /**
     * @param {?} changes
     * @return {?}
     */
    ngOnChanges(changes) {
        if (this.isInited) {
            const { minDate, maxDate } = changes;
            this.init();
            if (minDate || maxDate) {
                this.initValidators();
            }
        }
    }
    /**
     * @param {?} value
     * @return {?}
     */
    writeValue(value) {
        this.inputValue = value;
        if (value) {
            this.selected = this.utilsService
                .convertToMomentArray(value, this.componentConfig.format, false)[0];
            this.inputValueType = this.utilsService
                .getInputType(this.inputValue, false);
        }
        else {
            this.selected = null;
        }
        this.cd.markForCheck();
    }
    /**
     * @param {?} fn
     * @return {?}
     */
    registerOnChange(fn) {
        this.onChangeCallback = fn;
    }
    /**
     * @param {?} _
     * @return {?}
     */
    onChangeCallback(_) {
    }
    ;
    /**
     * @param {?} fn
     * @return {?}
     */
    registerOnTouched(fn) {
    }
    /**
     * @param {?} formControl
     * @return {?}
     */
    validate(formControl) {
        if (this.minDate || this.maxDate) {
            return this.validateFn(formControl.value);
        }
        else {
            return () => null;
        }
    }
    /**
     * @param {?} value
     * @return {?}
     */
    processOnChangeCallback(value) {
        return this.utilsService.convertFromMomentArray(this.componentConfig.format, [value], this.componentConfig.returnedValueType || this.inputValueType);
    }
    /**
     * @return {?}
     */
    initValidators() {
        this.validateFn = this.utilsService.createValidator({
            minDate: this.minDate,
            maxDate: this.maxDate
        }, undefined, 'daytime');
        this.onChangeCallback(this.processOnChangeCallback(this.selected));
    }
    /**
     * @param {?} day
     * @return {?}
     */
    dateSelected(day) {
        this.selected = this.dayTimeCalendarService.updateDay(this.selected, day.date, this.config);
        this.emitChange();
    }
    /**
     * @param {?} time
     * @return {?}
     */
    timeChange(time) {
        this.selected = this.dayTimeCalendarService.updateTime(this.selected, time.date);
        this.emitChange();
    }
    /**
     * @return {?}
     */
    emitChange() {
        this.onChange.emit({ date: this.selected, selected: false });
    }
    /**
     * @param {?} to
     * @return {?}
     */
    moveCalendarTo(to) {
        if (to) {
            this.dayCalendarRef.moveCalendarTo(to);
        }
    }
    /**
     * @param {?} change
     * @return {?}
     */
    onLeftNavClick(change) {
        this.onLeftNav.emit(change);
    }
    /**
     * @param {?} change
     * @return {?}
     */
    onRightNavClick(change) {
        this.onRightNav.emit(change);
    }
}
DayTimeCalendarComponent.decorators = [
    { type: Component, args: [{
                selector: 'dp-day-time-calendar',
                template: `
    <dp-day-calendar #dayCalendar
                     [config]="componentConfig"
                     [ngModel]="_selected"
                     [theme]="theme"
                     [displayDate]="displayDate"
                     (onSelect)="dateSelected($event)"
                     (onGoToCurrent)="onGoToCurrent.emit()"
                     (onLeftNav)="onLeftNavClick($event)"
                     (onRightNav)="onRightNavClick($event)">
    </dp-day-calendar>
    <dp-time-select #timeSelect
                    [config]="componentConfig"
                    [ngModel]="_selected"
                    (onChange)="timeChange($event)"
                    [theme]="theme">
    </dp-time-select>
  `,
                styles: [`
    dp-day-time-calendar {
      display: inline-block;
    }
    dp-day-time-calendar dp-time-select {
      display: block;
      border: 1px solid #000000;
      border-top: 0;
    }
    dp-day-time-calendar.dp-material dp-time-select {
      border: 1px solid #E0E0E0;
      border-top: 0;
    }
  `],
                changeDetection: ChangeDetectionStrategy.OnPush,
                encapsulation: ViewEncapsulation.None,
                providers: [
                    DayTimeCalendarService,
                    DayCalendarService,
                    TimeSelectService,
                    {
                        provide: NG_VALUE_ACCESSOR,
                        useExisting: forwardRef(() => DayTimeCalendarComponent),
                        multi: true
                    },
                    {
                        provide: NG_VALIDATORS,
                        useExisting: forwardRef(() => DayTimeCalendarComponent),
                        multi: true
                    }
                ]
            },] },
];
/**
 * @nocollapse
 */
DayTimeCalendarComponent.ctorParameters = () => [
    { type: DayTimeCalendarService, },
    { type: UtilsService, },
    { type: ChangeDetectorRef, },
];
DayTimeCalendarComponent.propDecorators = {
    'config': [{ type: Input },],
    'displayDate': [{ type: Input },],
    'minDate': [{ type: Input },],
    'maxDate': [{ type: Input },],
    'theme': [{ type: HostBinding, args: ['class',] }, { type: Input },],
    'onChange': [{ type: Output },],
    'onGoToCurrent': [{ type: Output },],
    'onLeftNav': [{ type: Output },],
    'onRightNav': [{ type: Output },],
    'dayCalendarRef': [{ type: ViewChild, args: ['dayCalendar',] },],
};

class DpDatePickerModule {
}
DpDatePickerModule.decorators = [
    { type: NgModule, args: [{
                providers: [
                    DomHelper,
                    UtilsService
                ],
                declarations: [
                    DatePickerComponent,
                    DatePickerDirective,
                    DayCalendarComponent,
                    MonthCalendarComponent,
                    CalendarNavComponent,
                    TimeSelectComponent,
                    DayTimeCalendarComponent
                ],
                entryComponents: [
                    DatePickerComponent
                ],
                imports: [
                    CommonModule,
                    FormsModule
                ],
                exports: [
                    DatePickerComponent,
                    DatePickerDirective,
                    MonthCalendarComponent,
                    DayCalendarComponent,
                    TimeSelectComponent,
                    DayTimeCalendarComponent
                ]
            },] },
];
/**
 * @nocollapse
 */
DpDatePickerModule.ctorParameters = () => [];

/**
 * Generated bundle index. Do not edit.
 */

export { ECalendarMode, ECalendarValue, DatePickerComponent, DatePickerDirective, DayCalendarComponent, DayTimeCalendarComponent, TimeSelectComponent, MonthCalendarComponent, DpDatePickerModule, CalendarNavComponent as ɵi, DomHelper as ɵa, UtilsService as ɵb, DatePickerDirectiveService as ɵg, DatePickerService as ɵc, DayCalendarService as ɵf, DayTimeCalendarService as ɵe, MonthCalendarService as ɵh, TimeSelectService as ɵd };
//# sourceMappingURL=ng2-date-picker.js.map
