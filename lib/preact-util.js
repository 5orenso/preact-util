/*
 * https://github.com/5orenso
 *
 * Copyright (c) 2016-2019 Øistein Sørensen
 * Licensed under the MIT license.
 */

'use strict';

import querystring from 'querystring';
import PubSub, { topics } from './pubsub';

const API_SERVER_KEY = 'apiServer';
const WEBSOCKET_SERVER_KEY = 'webocketUrl';
const IMAGE_SERVER_KEY = 'imageServer';
const JWT_TOKEN_KEY = 'jwtToken';
const USER_EMAIL = 'userEmail';
const USER_CELLPHONE = 'userCellphone';
const IS_MAC = /Mac/.test(navigator.platform);

class Utilities {
    static getType(element) {
        return Object.prototype.toString.call(element);
    }

    /**
     * Check if this is an error or not.
     *
     * @static
     * @param    {*} element - Element to check.
     * @returns  {boolean}
     * @memberof Utilities
     */
    static isError(element) {
        if (Utilities.getType(element) === '[object Error]') {
            return true;
        }
        return false;
    }

    /**
     * Check if this is an array or not.
     *
     * @static
     * @param    {*} element - Element to check.
     * @returns  {boolean}
     * @memberof Utilities
     */
    static isArray(element) {
        if (Utilities.getType(element) === '[object Array]') {
            return true;
        }
        return false;
    }

    /**
     * Check if this is an object or not.
     *
     * @static
     * @param    {*} element - Element to check.
     * @returns  {boolean}
     * @memberof Utilities
     */
    static isObject(element) {
        if (Utilities.getType(element) === '[object Object]') {
            return true;
        }
        return false;
    }

    /**
     * Check if this is a string or not.
     *
     * @static
     * @param    {*} element - Element to check.
     * @returns  {boolean}
     * @memberof Utilities
     */
    static isString(element) {
        if (Utilities.getType(element) === '[object String]') {
            return true;
        }
        return false;
    }

    /**
     * Check if this is a date or not.
     *
     * @static
     * @param    {*} element - Element to check.
     * @returns  {boolean}
     * @memberof Utilities
     */
    static isDate(element) {
        if (Utilities.getType(element) === '[object Date]') {
            return true;
        }
        return false;
    }

    /**
     * Check if this is a number or not.
     *
     * @static
     * @param    {*} element - Element to check.
     * @returns  {boolean}
     * @memberof Utilities
     */
    static isNumber(element) {
        if (Utilities.getType(element) === '[object Number]' && !Number.isNaN(element)) {
            return true;
        }
        return false;
    }

    /**
     * Check if this is a function or not.
     *
     * @static
     * @param    {*} element - Element to check.
     * @returns  {boolean}
     * @memberof Utilities
     */
    static isFunction(element) {
        if (Utilities.getType(element) === '[object Function]') {
            return true;
        }
        return false;
    }

    /**
     * Check if this is a regular expression or not.
     *
     * @static
     * @param    {*} element - Element to check.
     * @returns  {boolean}
     * @memberof Utilities
     */
    static isRegexp(element) {
        if (Utilities.getType(element) === '[object RegExp]') {
            return true;
        }
        return false;
    }

    /**
     * Check if this is a boolean or not.
     *
     * @static
     * @param    {*} element - Element to check.
     * @returns  {boolean}
     * @memberof Utilities
     */
    static isBoolean(element) {
        if (Utilities.getType(element) === '[object Boolean]') {
            return true;
        }
        return false;
    }

    /**
     * Check if this is null or not.
     *
     * @static
     * @param    {*} element - Element to check.
     * @returns  {boolean}
     * @memberof Utilities
     */
    static isNull(element) {
        if (Utilities.getType(element) === '[object Null]') {
            return true;
        }
        return false;
    }

    /**
     * Check if this is undefined or not.
     *
     * @static
     * @param    {*} element - Element to check.
     * @returns  {boolean}
     * @memberof Utilities
     */
    static isUndefined(element) {
        if (Utilities.getType(element) === '[object Undefined]') {
            return true;
        }
        return false;
    }

    /**
     * Check if this is defined or not.
     *
     * @static
     * @param    {*} element - Element to check.
     * @returns  {boolean}
     * @memberof Utilities
     */
    static isDefined(element) {
        return !Utilities.isUndefined(element);
    }

    /**
     *
     * @param object
     * @param name Name of key on level 1
     * @param name Name of key on level 2
     * ...
     * @param name Name of key on level N
     * @returns {true|false}
     * @example
     *    Let's say you have object:
     *      obj = {
     *            foo: {
     *                bar: 1
     *            }
     *        };
     *    1. You want to check if obj.foo.bar exists:
     *      checkNested(obj, 'foo', 'bar');
     *          returns true
     *    2. You want to check if obj.foo.bar.gomle exists:
     *      checkNested(obj, 'foo', 'bar', 'gomle');
     *          returns false
     */
    static checkNested($obj, ...args) {
        let obj = $obj;
        for (let i = 0; i < args.length; i += 1) {
            if (!obj || !obj.hasOwnProperty(args[i])) {
                return false;
            }
            obj = obj[args[i]];
        }
        return true;
    }

    static getNestedValue(obj, path) {
        let el = obj;
        if (Utilities.isObject(el) && Utilities.isString(path)) {
            path.split('.').forEach((part) => {
                if (Utilities.checkNested(el, part)) {
                    el = el[part];
                } else {
                    el = null;
                }
            });
        } else {
            el = null;
        }
        return el;
    }

    static setNestedValue(obj, is, value) {
        if (typeof is === 'string') {
            return Utilities.setNestedValue(obj, is.split('.'), value);
        }
        if (is.length === 1 && value !== undefined) {
            // eslint-disable-next-line
            if (!Utilities.isObject(obj)) {
                obj = {};
            }
            return obj[is[0]] = value;
        }
        if (is.length === 0) {
            return obj;
        }
        if (Utilities.isObject(obj)) {
            return Utilities.setNestedValue(obj[is[0]], is.slice(1), value);
        }
        return null;
    }

    static asNumber($obj, ...$args) {
        let args = $args;
        if (Array.isArray(args[0])) {
            args = args[0];
        }
        // let args = Array.prototype.slice.call(arguments, 1);
        let obj = $obj;
        for (let i = 0; i < args.length; i += 1) {
            if (!obj || !obj.hasOwnProperty(args[i])) {
                return 0;
            }
            obj = obj[args[i]];
        }
        return parseFloat(obj);
    }

    static asString($obj, ...$args) {
        let args = $args;
        if (Array.isArray(args[0])) {
            args = args[0];
        }
        // let args = Array.prototype.slice.call(arguments, 1);
        let obj = $obj;
        for (let i = 0; i < args.length; i += 1) {
            if (!obj || !obj.hasOwnProperty(args[i])) {
                return undefined;
            }
            obj = obj[args[i]];
        }
        return obj;
    }

    static asObject($obj, ...$args) {
        let args = $args;
        if (Array.isArray(args[0])) {
            args = args[0];
        }
        // let args = Array.prototype.slice.call(arguments, 1);
        let obj = $obj;
        for (let i = 0; i < args.length; i += 1) {
            if (!obj || !obj.hasOwnProperty(args[i])) {
                return undefined;
            }
            obj = obj[args[i]];
        }
        if (typeof obj === 'object') {
            return obj;
        }
        return undefined;
    }

    static asBoolean($obj, ...$args) {
        let args = $args;
        if (Array.isArray(args[0])) {
            args = args[0];
        }
        // let args = Array.prototype.slice.call(arguments, 1);
        let obj = $obj;
        for (let i = 0; i < args.length; i += 1) {
            if (!obj || !obj.hasOwnProperty(args[i])) {
                return false;
            }
            obj = obj[args[i]];
        }
        if (typeof obj === 'boolean') {
            return obj;
        }
        return false;
    }

    static cleanObject($obj, opt = {}) {
        const obj = Object.assign({}, $obj);
        const keys = Object.keys(obj);
        for (let i = 0; i < keys.length; i += 1) {
            const idx = keys[i];
            if (obj.hasOwnProperty(idx)) {
                if (typeof obj[idx] === 'undefined' || obj[idx] === false) {
                    delete obj[idx];
                }
                if (opt.emptyIsUndefined && obj[idx] === '') {
                    delete obj[idx];
                }
                if (opt.zeroIsUndefined && obj[idx] === 0) {
                    delete obj[idx];
                }
                if (opt.zeroStringIsUndefined && obj[idx] === '0') {
                    delete obj[idx];
                }
                if (opt.nullIsUndefined && obj[idx] === null) {
                    delete obj[idx];
                }
            }
        }
        return obj;
    }

    static escapeEmail(email) {
        if (typeof email === 'string') {
            return email.replace(/[^a-z1-9]/gi, '_');
        }
        return email;
    }

    static padDate(number) {
        let r = String(number);
        if (r.length === 1) {
            r = `0${r}`;
        }
        return r;
    }

    static parseInputDate(inputDate) {
        let parsedDate;
        if (Utilities.isDate(inputDate)) {
            return new Date(inputDate);
        }
        if (Utilities.isString(inputDate) || Utilities.isNumber(inputDate)) {
            if (Utilities.isString(inputDate) && inputDate.match(/\d{4}-\d{2}-\d{2}/)) {
                parsedDate = new Date(inputDate);
            } else if (inputDate >= -8640000000000000 && inputDate <= 8640000000000000) {
                // The range of valid timestamps in JS is -8640000000000000 to 8640000000000000
                parsedDate = new Date(inputDate);
            } else {
                parsedDate = new Date(); // fallback to the current date
            }
        } else {
            parsedDate = new Date(); // fallback to the current date
        }
        return parsedDate;
    }

    static timeOfDay(inputDate, ucFirst) {
        const availDate = Utilities.parseInputDate(inputDate);
        const hour = availDate.getHours();
        const minute = availDate.getMinutes();
        let timeOfDay = '';
        if (hour >= 0 && hour < 5) {
            timeOfDay = 'night';
        } else if (hour >= 6 && hour < 8) {
            timeOfDay = 'early morning';
        } else if (hour >= 8 && hour < 12) {
            timeOfDay = 'morning';
        } else if (hour === 12) {
            timeOfDay = 'noon';
        } else if (hour >= 12 && hour < 18) {
            timeOfDay = 'afternoon';
        } else if (hour >= 18 && hour < 24) {
            timeOfDay = 'evening';
        }

        if (ucFirst) {
            return Utilities.ucfirst(timeOfDay);
        }
        return timeOfDay;
    }

    static isoDate(inputDate, showSeconds = false, showTimezone = false, showDateOnly = false, dateTimeSep = ' ') {
        let opts = {};
        if (typeof showSeconds === 'boolean') {
            opts.showSeconds = showSeconds;
            opts.showTimezone = showTimezone;
            opts.showDateOnly = showDateOnly;
            opts.dateTimeSep = dateTimeSep;
        } else {
            opts = {
                showSeconds: false,
                showTimezone: false,
                showDateOnly: false,
                dateTimeSep: ' ',
                ...showSeconds,
            };
        }
        const availDate = Utilities.parseInputDate(inputDate);
        // "d.m.y"
        if (availDate) {
            const mm = availDate.getMonth() + 1;
            const dd = availDate.getDate();
            const yy = availDate.getFullYear();
            const hh = availDate.getHours();
            const mi = availDate.getMinutes();
            const ss = availDate.getSeconds();
            const tzo = -availDate.getTimezoneOffset();
            const dif = tzo >= 0 ? '+' : '-';

            let ret = `${Utilities.padDate(yy)}-${Utilities.padDate(mm)}-${Utilities.padDate(dd)}`;
            if (!opts.showDateOnly) {
                ret += `${opts.dateTimeSep}${Utilities.padDate(hh)}:${Utilities.padDate(mi)}`;
                if (opts.showSeconds) {
                    ret += `:${Utilities.padDate(ss)}`;
                }
                if (opts.showTimezone) {
                    ret += `${dif}${tzo}`;
                }
            }
            return ret;
        }
        return 'n/a';
    }

    static isoDateCompact(inputDate, showSeconds = false, showTimezone = false, dateTimeSep = ' ') {
        let opts = {};
        if (typeof showSeconds === 'boolean') {
            opts.showSeconds = showSeconds;
            opts.showTimezone = showTimezone;
            opts.dateTimeSep = dateTimeSep;
        } else {
            opts = {
                showSeconds: false,
                showTimezone: false,
                dateTimeSep: ' ',
                ...showSeconds,
            };
        }
        const availDate = Utilities.parseInputDate(inputDate);
        // "d.m.y"
        if (availDate) {
            const mm = availDate.getMonth() + 1;
            const dd = availDate.getDate();
            const yy = availDate.getFullYear();
            const hh = availDate.getHours();
            const mi = availDate.getMinutes();
            const ss = availDate.getSeconds();
            const tzo = -availDate.getTimezoneOffset();
            const dif = tzo >= 0 ? '+' : '-';

            let ret = `${dd}/${mm}`;
            ret += `${opts.dateTimeSep}${Utilities.padDate(hh)}:${Utilities.padDate(mi)}`;
            if (opts.showSeconds) {
                ret += `:${Utilities.padDate(ss)}`;
            }
            if (opts.showTimezone) {
                ret += `${dif}${tzo}`;
            }
            return ret;
        }
        return 'n/a';
    }

    static isoTime(inputDate, showSeconds = false, showTimezone = false) {
        const availDate = Utilities.parseInputDate(inputDate);
        if (availDate) {
            const hh = availDate.getHours();
            const mi = availDate.getMinutes();
            const ss = availDate.getSeconds();
            const tzo = -availDate.getTimezoneOffset();
            const dif = tzo >= 0 ? '+' : '-';

            let ret = `${Utilities.padDate(hh)}:${Utilities.padDate(mi)}`;
            if (showSeconds) {
                ret += `:${Utilities.padDate(ss)}`;
            }
            if (showTimezone) {
                ret += `${dif}${tzo}`;
            }
            return ret;
        }
        return 'n/a';
    }

    static formatDate(inputDate, $opts = {}, noPresetOptions = false) {
        const opts = { ...$opts };
        const locale = opts.locale || 'en-US';
        delete opts.locale;
        let options = {};
        if (noPresetOptions) {
            options = opts;
        } else {
            options = {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                // dateStyle      "full"
                //                "long"
                //                "medium"
                //                "short"
                // timeStyle      "full"
                //                "long"
                //                "medium"
                //                "short"
                // localeMatcher  "best-fit" (default)
                //                "lookup"
                // timeZone
                // hour12         false
                //                true
                // hourCycle      "h11"
                //                "h12"
                //                "h23"
                //                "h24"
                // formatMatcher  "basic"
                //                "best-fit" (default)
                // weekday        "long"
                //                "short"
                //                "narrow"
                // year           "2-digit"
                //                "numeric"
                // month          "2-digit"
                //                "long"
                //                "narrow"
                //                "numeric"
                //                "short"
                // day            "2-digit"
                //                "long"
                // hour           "2-digit"
                //                "long"
                // minute         "2-digit"
                //                "long"
                // second         "2-digit"
                //                "long"
                // timeZoneName   "long"
                //                "short"
                // era            "long"
                //                "short"
                //                "narrow"

                ...opts,
            };
        }
        const parsedDate = Utilities.isDate(inputDate) ? inputDate : new Date(inputDate);
        return parsedDate.toLocaleString(locale, options);
    }

    static getApiServer() {
        return localStorage.getItem(API_SERVER_KEY);
    }

    static getWebsocketServer() {
        return localStorage.getItem(WEBSOCKET_SERVER_KEY);
    }

    static setApiServer(apiServer) {
        return localStorage.setItem(API_SERVER_KEY, apiServer);
    }

    static setWebsocketServer(webocketUrl) {
        return localStorage.setItem(WEBSOCKET_SERVER_KEY, webocketUrl);
    }

    static getImageServer() {
        return localStorage.getItem(IMAGE_SERVER_KEY);
    }

    static setImageServer(imageServer) {
        return localStorage.setItem(IMAGE_SERVER_KEY, imageServer);
    }

    static getJwtToken() {
        return localStorage.getItem(JWT_TOKEN_KEY);
    }

    static setJwtToken(token) {
        return localStorage.setItem(JWT_TOKEN_KEY, token);
    }

    static removeJwtToken() {
        return localStorage.removeItem(JWT_TOKEN_KEY);
    }

    static setUserEmail(email) {
        return localStorage.setItem(USER_EMAIL, email);
    }

    static setUserCellphone(cellphone) {
        return localStorage.setItem(USER_CELLPHONE, cellphone);
    }

    static getUserEmail() {
        return localStorage.getItem(USER_EMAIL);
    }

    static getUserCellphone() {
        return localStorage.getItem(USER_CELLPHONE);
    }

    static removeUserEmail() {
        return localStorage.removeItem(USER_EMAIL);
    }

    static removeUserCellphone() {
        return localStorage.removeItem(USER_CELLPHONE);
    }

    static setObject(objKey, key, val) {
        const value = localStorage.getItem(objKey);
        let obj = {};
        if (typeof key === 'object') {
            obj = { ...key };
        } else if (typeof value === 'string') {
            try {
                obj = JSON.parse(value);
                obj[key] = val;
            } catch (err) {
                obj = undefined;
            }
        }
        return localStorage.setItem(objKey, JSON.stringify(obj));
    }

    static unsetObj(objKey, key) {
        if (typeof key === 'string') {
            return Utilities.setObject(objKey, key, null);
        }
        return localStorage.setItem(objKey, null);
    }

    static getObject(objKey) {
        try {
            let data = JSON.parse(localStorage.getItem(objKey));
            if (data === null) {
                data = {};
            }
            return data;
        } catch (err) {
            return undefined;
        }
    }

    static set(key, val) {
        return localStorage.setItem(key, JSON.stringify(val));
    }

    static unset(key) {
        return localStorage.setItem(key, null);
    }

    static get(key) {
        try {
            return JSON.parse(localStorage.getItem(key));
        } catch (err) {
            return undefined;
        }
    }

    /**
     *
     * @param endpoint
     * @param opts
     *  - method: PUT, GET, POST, etc.. Defaults to GET
     *  - publish: if true, use PubSub for various feedbacks (including error handling). Defaults to true
     * @param body
     * @returns {Promise<Promise<any>|Array>}
     */
    static async fetchApi(endpoint, opts = {}, body = {}) {
        const apiServer = opts.apiServer || Utilities.getApiServer();

        const shouldPublish = opts.hasOwnProperty('publish') ? opts.publish : true;

        // Only publish for PATCH, POST, PUT and DELETE
        const publishMethods = ['POST', 'PUT', 'PATCH', 'DELETE'];
        if (shouldPublish && publishMethods.includes(opts.method)) {
            PubSub.publish(topics.LOADING_PROGRESS, 0);
        }

        const jwtToken = opts.jwtToken || Utilities.getJwtToken();
        delete opts.jwtToken;

        const fetchOpt = {
            credentials: 'omit',
            method: 'GET',
            mode: 'cors',
            cache: 'default',
            headers: {},
            publish: true,
            ...opts,
        };

        if (jwtToken && jwtToken !== 'null' && jwtToken !== 'undefined') {
            fetchOpt.headers = {
                Authorization: `Bearer ${jwtToken}`,
            };
        }

        let qs = '';
        if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(opts.method)) {
            fetchOpt.credentials = 'include';
            fetchOpt.body = JSON.stringify(body);
            fetchOpt.headers['Content-Type'] = 'application/json';
        } else {
            qs = querystring.stringify(body);
        }

        if (shouldPublish && publishMethods.includes(opts.method)) {
            PubSub.publish(topics.LOADING_PROGRESS, 25);
        }

        try {
            const response = await fetch(`${apiServer}${endpoint}${qs ? `?${qs}` : ''}`, fetchOpt);
            if (shouldPublish && publishMethods.includes(opts.method)) {
                PubSub.publish(topics.LOADING_PROGRESS, 100);
            }
            const contentType = response.headers.get('content-type');
            if (contentType && contentType.indexOf('application/json') !== -1) {
                const jsonResult = await response.json();
                return jsonResult;
            } else {
                const textResult = await response.text();
                return {
                    stats: {},
                    status: response.status || 500,
                    message: `ERROR API did not return JSON: ${textResult}`,
                };
            }
        } catch (err) {
            if (shouldPublish) {
                PubSub.publish(topics.ERROR_MESSAGE, 'An error occurred');
            }
            return {
                stats: {},
                status: 500,
                message: `ERROR fetching API: ${err}`,
            };
            // throw err;
        }
    }

    static format($number, $decimals, $decPoint, $thousandsSep, $compact = false) {
        const decimals = Number.isNaN($decimals) ? 2 : Math.abs($decimals);
        const decPoint = ($decPoint === undefined) ? ',' : $decPoint;
        const thousandsSep = ($thousandsSep === undefined) ? ' ' : $thousandsSep;

        const number = Math.abs($number || 0);
        const sign = Math.sign($number) >= 0 ? '' : '-';

        if ($compact) {
            if (number > 999999) {
                const compact = Utilities.format((number / 1000000), 1, $decPoint, $thousandsSep);
                return `${sign}${compact}M`;
            } if (number > 999) {
                const compact = Utilities.format((number / 1000), 1, $decPoint, $thousandsSep);
                return `${sign}${compact}K`;
            }
        }

        if (Utilities.isNumber(number)) {
            const intPart = String(parseInt(number.toFixed(decimals), 10));
            const j = intPart.length > 3 ? intPart.length % 3 : 0;

            const firstPart = (j ? intPart.substr(0, j) + thousandsSep : '');
            const secondPart = intPart.substr(j).replace(/(\d{3})(?=\d)/g, `$1${thousandsSep}`);
            const decimalPart = (decimals ? decPoint + Math.abs(number - intPart).toFixed(decimals).slice(2) : '');
            return `${sign}${firstPart}${secondPart}${decimalPart}`;
        }
        return '';
    }

    static formatCompact(number) {
        return Utilities.format(number, 0, ',', ' ', true);
    }

    static formatBytes($bytes, decimals) {
        const bytes = parseInt($bytes, 10);
        if (Utilities.isNumber(bytes)) {
            if (bytes === 0) {
                return '0 Bytes';
            }
            const k = 1024;
            const dm = decimals || 2;
            const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
            const i = Math.floor(Math.log(bytes) / Math.log(k));
            return `${parseFloat((bytes / (k ** i)).toFixed(dm))} ${sizes[i]}`;
        }
        return '';
    }

    static getDomain() {
        if (Utilities.checkNested(window, 'location')) {
            return window.location.hostname;
        }
        return undefined;
    }

    static isStandalone() {
        if (window.navigator.standalone) {
            return true;
        }
        if (window.matchMedia('(display-mode: standalone)').matches) {
            return true;
        }
        return false;
    }

    static isMobile() {
        const toMatch = [
            /Android/i,
            /webOS/i,
            /iPhone/i,
            /iPad/i,
            /iPod/i,
            /BlackBerry/i,
            /Windows Phone/i,
        ];

        return toMatch.some((toMatchItem) => {
            return window.navigator.userAgent.match(toMatchItem);
        });
    }

    static getImageHostname() {
        const imageServer = Utilities.getImageServer();
        return imageServer;
    }

    static getImageSrc(image, size = '220x', index = 1, defaultPrefix = 'product') {
        if (typeof image === 'object') {
            if (image.newFilename) {
                return `${size}/${image.newFilename}`;
            }
            return `${size}/${image.prefix || defaultPrefix}_${index}_${image.filename}.${image.ext}`;
        }
        return '';
    }

    static isCapsLock(event, callback = () => {}) {
        let capsLock = false;
        const charCode = event.charCode;
        const shiftKey = event.shiftKey;

        if (charCode >= 97 && charCode <= 122) {
            capsLock = shiftKey;
        } else if (charCode >= 65 && charCode <= 90 && !(shiftKey && IS_MAC)) {
            capsLock = !shiftKey;
        }
        callback(capsLock);
    }

    static validateEmail(email) {
        // eslint-disable-next-line
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }

    static isValidDate(dateString) {
        const date = new Date(dateString);
        return !isNaN(date);
    }

    static ucfirst(string, skipRest = false) {
        if (Utilities.isString(string)) {
            return string.charAt(0).toUpperCase() + (skipRest ? '' : string.slice(1));
        }
        return string;
    }

    static randomPassword() {
        const randomstring = Math.random().toString(36).slice(-8);
        return randomstring;
    }

    static toggleDarkModeClasses(isEnabled) {
        if (isEnabled) {
            document.body.classList.remove('bootstrap');
            document.body.classList.add('bootstrap-dark');
            if (window.StatusBar) {
                window.StatusBar.backgroundColorByName('darkGray');
                window.StatusBar.styleLightContent();
            }
        } else {
            document.body.classList.remove('bootstrap-dark');
            document.body.classList.add('bootstrap');
            if (window.StatusBar) {
                window.StatusBar.backgroundColorByName('lightGray');
                window.StatusBar.styleDefault();
            }
        }
    }

    static toggleBodyClasses(className, isEnabled) {
        if (isEnabled) {
            document.body.classList.add(className);
        } else {
            document.body.classList.remove(className);
        }
    }

    static camelcasize(str) {
        return str.replace(/-([a-z])/gi, (all, letter) => {
            return letter.toUpperCase();
        });
    }

    /**
     * Get the props from a host element's data attributes
     * @param  {Element} tag The host element
     * @return {Object}  props object to be passed to the component
    */
    static collectPropsFromElement(element, defaultProps = {}) {
        const attrs = element.attributes;
        const props = Object.assign({}, defaultProps);

        // collect from element
        Object.keys(attrs).forEach((key) => {
            // eslint-disable-next-line no-prototype-builtins
            if (attrs.hasOwnProperty(key)) {
                const dataAttrName = attrs[key].name;
                if (!dataAttrName || typeof dataAttrName !== 'string') {
                    return false;
                }
                let propName = dataAttrName.split(/(data-props?-)/).pop() || '';
                propName = Utilities.camelcasize(propName);
                if (dataAttrName !== propName) {
                    const propValue = attrs[key].nodeValue;
                    props[propName] = propValue;
                }
            }
            return false;
        });

        // check for child script text/props or application/json
        [].forEach.call(element.getElementsByTagName('script'), (scrp) => {
            let propsObj = {};
            if (scrp.hasAttribute('type')) {
                if (
                    scrp.getAttribute('type') !== 'text/props'
                    && scrp.getAttribute('type') !== 'application/json'
                ) {
                    return;
                }
                try {
                    propsObj = JSON.parse(scrp.innerHTML);
                } catch (e) {
                    throw new Error(e);
                }
                Object.assign(props, propsObj);
            }
        });
        return props;
    }

    static encUri(uri) {
        if (typeof uri === 'string') {
            return encodeURIComponent(uri.replace(/\s*\(.+?\)/g, ''));
        }
        return uri;
    }

    static makeId(length) {
        let result = '';
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const charactersLength = characters.length;
        for (let i = 0; i < length; i += 1) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }

    static percentOfTotal(total, part) {
        return part / total * 100;
    }

    static round(num, scale = 1) {
        if (!(`${num}`).includes('e')) {
            return +(`${Math.round(`${num}e+${scale}`)}e-${scale}`);
        }
        const arr = (`${num}`).split('e');
        let sig = '';
        if (+arr[1] + scale > 0) {
            sig = '+';
        }
        return +(`${Math.round(`${+arr[0]}e${sig}${(+arr[1] + scale)}`)}e-${scale}`);
    }

    static roundTo(num, scale = 100) {
        return Math.round((num + Number.EPSILON) * scale) / scale;
    }

    static validRange(value, min, max) {
        if (value > max) {
            return max;
        }
        if (value < min) {
            return min;
        }
        return value;
    }

    static range(start, end, step = 1) {
        const result = [];
        let current = start;
        while (current <= end) {
            result.push(current);
            current += step;
        }
        return result;
    }

    static monthRange(start, end) {
        const startDate = Utilities.parseInputDate(start);
        const endDate = Utilities.parseInputDate(end);
        const startYear = startDate.getFullYear();
        const endYear = endDate.getFullYear();
        const dates = [];

        for (let i = startYear; i <= endYear; i += 1) {
            const endMonth = (i !== endYear) ? 11 : endDate.getMonth();
            const startMon = (i === startYear) ? startDate.getMonth() : 0;
            for (let j = startMon; j <= endMonth; j += 1) {
                const month = j + 1;
                dates.push({ month, year: i });
            }
        }
        return dates;
    }

    static weekRange(start, end) {
        const startDate = Utilities.parseInputDate(start);
        const endDate = Utilities.parseInputDate(end);

        if (startDate > endDate) {
            throw new Error('The start date must be before or equal to the end date.');
        }

        const dates = [];
        let currentDate = new Date(startDate);

        while (currentDate <= endDate) {
            const weekNumber = Utilities.getWeek(currentDate);
            const year = currentDate.getFullYear();
            const weekExists = dates.some(d => d.week === weekNumber && d.year === year);

            if (!weekExists) {
                dates.push({ week: weekNumber, year });
            }

            // Move to the next day
            currentDate.setDate(currentDate.getDate() + 1);
        }
        return dates;
    }

    static dayRange(start, end) {
        const startDate = Utilities.parseInputDate(start);
        const endDate = Utilities.parseInputDate(end);
        const dates = [];

        for (let dt = startDate; dt <= endDate; dt.setDate(dt.getDate() + 1)) {
            const currDate = new Date(dt);
            dates.push({
                dow: currDate.getDay(),
                year: currDate.getFullYear(),
                week: Utilities.getWeek(currDate),
                day: currDate.getDate(),
                month: currDate.getMonth() + 1,
            });
        }
        return dates;
    }

    static hourRange(startDate, endDate) {
        const start = Utilities.parseInputDate(startDate);
        const end = Utilities.parseInputDate(endDate);
        const hourRange = [];
        while(start <= end) {
            const dow = start.getDay();
            const hour = start.getHours();
            const day = start.getDate();
            const month = start.getMonth() + 1; // JavaScript months are 0-based.
            const year = start.getFullYear();
            hourRange.push({
                dow,
                hour,
                day,
                month,
                year,
                week: Utilities.getWeek(start),
            });
            start.setHours(start.getHours() + 1);
        }
        return hourRange;
    }

    static scorePassword(pass) {
        let score = 0;
        if (!pass) {
            return score;
        }

        // award every unique letter until 5 repetitions
        const letters = {};
        for (let i = 0; i < pass.length; i += 1) {
            letters[pass[i]] = (letters[pass[i]] || 0) + 1;
            score += 5.0 / letters[pass[i]];
        }

        // bonus points for mixing it up
        const variations = {
            digits: /\d/.test(pass),
            lower: /[a-z]/.test(pass),
            upper: /[A-Z]/.test(pass),
            nonWords: /\W/.test(pass),
        };

        let variationCount = 0;
        const keys = Object.keys(variations);
        for (let i = 0, l = keys.length; i < l; i += 1) {
            const check = keys[i];
            variationCount += (variations[check] === true) ? 1 : 0;
        }
        score += (variationCount - 1) * 10;
        return parseInt(score, 10);
    }

    // Good passwords start to score around 60 or so, here's function to translate that in words:
    static checkPassStrength(pass, codes = ['veryweek', 'weak', 'good', 'strong']) {
        const score = Utilities.scorePassword(pass);
        if (score > 80) {
            return codes[3];
        }
        if (score > 60) {
            return codes[2];
        }
        if (score >= 30) {
            return codes[1];
        }
        if (score >= 5) {
            return codes[0];
        }
        return '';
    }

    static normalize(val, max, min) {
        return (val - min) / (max - min);
    }

    /**
    * Normalizes a value from one range (current) to another (new).
    *
    * @param  { Number } val    // the current value (part of the current range).
    * @param  { Number } minVal // the min value of the current value range.
    * @param  { Number } maxVal // the max value of the current value range.
    * @param  { Number } newMin // the min value of the new value range.
    * @param  { Number } newMax // the max value of the new value range.
    * @param  { Number } absMax // the absolute maximum you want to return.
    *
    * @returns { Number } the normalized value.
    */
    static normalizeBetween(val, minVal, maxVal, newMin, newMax, absMax) {
        const args = [val, minVal, maxVal, newMin, newMax];
        if (!args.every(arg => typeof arg === 'number' && !isNaN(arg))) {
            throw new Error('Invalid input: all parameters must be numbers.');
        }

        if (maxVal === minVal) {
            throw new Error('Division by zero error: minVal and maxVal cannot be equal.');
        }

        const newVal = newMin + (
            (val - minVal) * (newMax - newMin) / (maxVal - minVal)
        );
        if (absMax && newVal > absMax) {
            return absMax;
        }
        return newVal;
    }

    static validateCode(code, min, max) {
        let parsedCode = `${code}`.replace(/[^0-9]/g, '');
        parsedCode = parseInt(parsedCode, 10);
        if (parsedCode >= min && parsedCode <= max) {
            return true;
        }
        return false;
    }

    static age(birth, deceased = new Date(), map = { year: 'år', month: 'mnd', week: 'uker', day: 'dager' }) {
        const fromDate = Utilities.parseInputDate(birth);
        const endDate = Utilities.parseInputDate(deceased);
        const deltaMs = endDate.getTime() - fromDate.getTime();

        const res = {};
        const secIn = {
            year: 31536000,
            month: 2592000,
            week: 604800,
            day: 86400,
            hour: 3600,
            minute: 60,
            // second: 1,
        };
        let deltaSec = Math.floor(deltaMs / 1000);
        const keys = Object.keys(secIn);
        for (let i = 0, l = keys.length; i < l; i += 1) {
            const key = keys[i];
            res[key] = Math.floor(deltaSec / secIn[key]);
            deltaSec -= res[key] * secIn[key];
        }
        for (let i = 0, l = keys.length; i < l; i += 1) {
            const key = keys[i];
            if (res[key] > 0) {
                return `${res[key]} ${map[key] || key}`;
            }
        }
        return res;
    }

    static dateDiff(start, end) {
        if (!start) {
            return {};
        }
        const fromDate = Utilities.parseInputDate(start);
        const endDate = Utilities.parseInputDate(end);
        const deltaMs = endDate.getTime() - fromDate.getTime();
        const deltaSec = Math.floor(deltaMs / 1000);
        const deltaDays = Math.floor(deltaSec / 86400);

        return {
            seconds: deltaSec,
            minutes: Math.floor(deltaSec / 60),
            hours: Math.floor(deltaSec / 3600),
            days: deltaDays,
            weeks: Math.floor(deltaDays / 7),
            months: Math.floor(deltaDays / 30),
            years: Math.floor(deltaDays / 365),
        };
    }

    static secToHms(seconds, hideSeconds = false, hideHours = false, hideZero = false) {
        const sec = parseInt(seconds, 10);
        const hh = Math.floor(sec / 3600);
        const mi = Math.floor(sec % 3600 / 60);
        const ss = Math.floor(sec % 3600 % 60);
        if (hideSeconds) {
            return `${Utilities.padDate(hh)}:${Utilities.padDate(mi)}`;
        }
        if (hideHours) {
            return `${Utilities.padDate(mi)}:${Utilities.padDate(ss)}`;
        }
        if (hideZero) {
            if (hh === 0 && mi === 0) {
                return `${Utilities.padDate(ss)}`;
            }
            if (hh === 0) {
                return `${Utilities.padDate(mi)}:${Utilities.padDate(ss)}`;
            }
        }
        return `${Utilities.padDate(hh)}:${Utilities.padDate(mi)}:${Utilities.padDate(ss)}`;
    }

    static parseISO8601ToSec(duration) {
        const regex = /P(?:([0-9]+)Y)?(?:([0-9]+)M)?(?:([0-9]+)W)?(?:([0-9]+)D)?T?(?:([0-9]+)H)?(?:([0-9]+)M)?(?:([0-9]+)S)?/;
        const matches = duration.match(regex);

        const years = parseInt(matches[1]) || 0;
        const months = parseInt(matches[2]) || 0;
        const weeks = parseInt(matches[3]) || 0;
        const days = parseInt(matches[4]) || 0;
        const hours = parseInt(matches[5]) || 0;
        const minutes = parseInt(matches[6]) || 0;
        const seconds = parseInt(matches[7]) || 0;

        return (
            years * 31536000 +  // 365 * 24 * 60 * 60
            months * 2592000 +  // 30 * 24 * 60 * 60
            weeks * 604800 +    // 7 * 24 * 60 * 60
            days * 86400 +      // 24 * 60 * 60
            hours * 3600 +      // 60 * 60
            minutes * 60 +
            seconds
        );
    }

    static formatDistance(fromDate, toDate = new Date(), opts = {}, formatOpts = {}) {
        const fDate = Utilities.parseInputDate(fromDate);
        const eDate = Utilities.parseInputDate(toDate);
        if (!fDate || !eDate) {
            return null;
        }
        const deltaMs = Math.abs(eDate.getTime() - fDate.getTime());
        const ageInSec = Math.floor(deltaMs / 1000);
        const min = Math.floor(ageInSec / 60);
        const hours = Math.floor(ageInSec / 3600);
        const days = Math.floor(ageInSec / 86400);
        const weeks = Math.floor(days / 7);
        const months = Math.floor(weeks / 4);

        const res = {};
        const secIn = {
            year: 31536000,
            month: 2592000,
            week: 604800,
            day: 86400,
            hour: 3600,
            minute: 60,
            // second: 1,
        };
        if (formatOpts.extended) {
            let deltaSec = Math.floor(deltaMs / 1000);
            const keys = Object.keys(secIn);
            for (let i = 0, l = keys.length; i < l; i += 1) {
                const key = keys[i];
                res[key] = Math.floor(deltaSec / secIn[key]);
                deltaSec -= res[key] * secIn[key];
            }
        }
        const lang = {
            year: formatOpts.year || 'year',
            years: formatOpts.years || 'years',
            month: formatOpts.month || 'month',
            months: formatOpts.months || 'months',
            week: formatOpts.week || 'week',
            weeks: formatOpts.weeks || 'weeks',
            day: formatOpts.day || 'day',
            days: formatOpts.days || 'days',
            hour: formatOpts.hour || 'hour',
            hours: formatOpts.hours || 'hours',
            minute: formatOpts.minute || 'minute',
            minutes: formatOpts.minutes || 'minutes',
        };

        if (months > 0) {
            // return `${months}m`;
            return Utilities.formatDate(fDate, opts);
        }
        if (weeks > 0) {
            if (formatOpts.extended) {
                return `${weeks} ${weeks > 1 ? lang.weeks : lang.week} ${res.day} ${res.day > 1 ? lang.days : lang.day} ${opts.textAgo}`;
            }
            return `${weeks}w ${opts.textAgo}`;
        }
        if (days > 0) {
            if (formatOpts.extended) {
                return `${res.day} ${res.day > 1 ? lang.days : lang.day} ${res.hour} ${res.hour > 1 ? lang.hours : lang.hour} ${opts.textAgo}`;
            }
            return `${days}d ${opts.textAgo}`;
        }
        if (hours > 0) {
            if (formatOpts.extended) {
                return `${res.hour} ${res.hour > 1 ? lang.hours : lang.hour} ${res.minute} ${res.minute > 1 ? lang.minutes : lang.minute} ${opts.textAgo}`;
            }
            return `${hours}h ${opts.textAgo}`;
        }
        if (min > 0) {
            return `${min}m ${opts.textAgo}`;
        }
        return `${ageInSec}s ${opts.textAgo}`;
    }

    /**
     * Converts an HSL color value to RGB. Conversion formula
     * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
     * Assumes h, s, and l are contained in the set [0, 1] and
     * returns r, g, and b in the set [0, 255].
     *
     * @param   {number}  h       The hue
     * @param   {number}  s       The saturation
     * @param   {number}  l       The lightness
     * @return  {Array}           The RGB representation
     */
    static hsl2Rgb($h, $s, $l) {
        const h = $h / 360;
        const s = $s / 100;
        const l = $l / 100;
        let r;
        let g;
        let b;

        if (s === 0) {
            r = l;
            g = l;
            b = l;
        } else {
            const hue2rgb = (p, q, t) => {
                if (t < 0) { t += 1; }
                if (t > 1) { t -= 1; }
                if (t < 1 / 6) { return p + (q - p) * 6 * t; }
                if (t < 1 / 2) { return q; }
                if (t < 2 / 3) { return p + (q - p) * (2 / 3 - t) * 6; }
                return p;
            };

            const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            const p = 2 * l - q;
            r = hue2rgb(p, q, h + 1 / 3);
            g = hue2rgb(p, q, h);
            b = hue2rgb(p, q, h - 1 / 3);
        }
        return {
            r: Math.round(r * 255),
            g: Math.round(g * 255),
            b: Math.round(b * 255),
        };
    }

    static yearRange(startYear = 1980, currentYear = new Date().getFullYear()) {
        const years = [];
        let thisYear = startYear;
        while (thisYear <= currentYear) {
            years.push(thisYear += 1);
        }
        return years;
    }

    static getYear() {
        const currentYear = new Date().getFullYear();
        return currentYear;
    }

    static getWeek(inputDate) {
        let date;
        if (Utilities.isUndefined(inputDate)) {
            date = new Date();
        } else {
            date = Utilities.parseInputDate(inputDate);
        }
        date.setHours(0, 0, 0, 0);
        // Thursday in current week decides the year.
        date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7);
        // January 4 is always in week 1.
        const week1 = new Date(date.getFullYear(), 0, 4);
        // Adjust to Thursday in week 1 and count number of weeks from date to week1.
        const dayDiff = (date.getTime() - week1.getTime()) / 86400000;
        const weekDay = (week1.getDay() + 6) % 7;
        return 1 + Math.round((dayDiff - 3 + weekDay) / 7);
    }

    // static getWeek(inputDate) {
    //     let date;
    //     if (Utilities.isUndefined(inputDate)) {
    //         date = new Date();
    //     } else {
    //         date = Utilities.parseInputDate(inputDate);
    //     }
    //     date.setHours(12, 0, 0, 0);
    //     const dateCopy = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    //     const dayNum = dateCopy.getUTCDay() || 7;
    //     dateCopy.setUTCDate(dateCopy.getUTCDate() + 4 - dayNum);
    //     const yearStart = new Date(Date.UTC(dateCopy.getUTCFullYear(), 0, 1));
    //     const weekNum = Math.ceil(((dateCopy - yearStart) / 86400000 + 1) / 7);
    //     return weekNum;
    // }

    static getDaysInWeek(week, year) {
        const daysOfWeek = [];
        const startDate = Utilities.getDateOfISOWeek(week, year);
        for (let i = 0; i < 7; i++) {
            const date = new Date(startDate);
            date.setUTCDate(startDate.getUTCDate() + i);
            daysOfWeek.push(date);
        }
        return daysOfWeek;
    }

    static getDaysInRange(start, days = 7, asObject = false) {
        const daysInRange = [];
        const startDate = Utilities.parseInputDate(start);
        startDate.setHours(0, 0, 0, 0);

        daysInRange.push(startDate);
        const sign = days < 0 ? -1 : 1;
        const daysAbs = Math.abs(days);
        for (let i = 1; i <= daysAbs; i += 1) {
            const next = new Date(startDate.getTime());
            next.setDate(startDate.getDate() + i * sign);
            daysInRange.push(next);
        }
        if (asObject) {
            return daysInRange.map(d => ({
                day: d.getDate(),
                month: d.getMonth() + 1,
                year: d.getFullYear(),
            }));
        }
        return daysInRange;
    }

    static daysInMonth(month, year) {
        return new Date(year, month, 0).getDate();
    }

    static getDaysInMonth(month, year) {
        const daysInMonth = Utilities.daysInMonth(month, year);
        const daysOfMonth = [];
        const startDate = new Date(year, month - 1, 1);
        daysOfMonth.push(startDate);
        for (let i = 1; i < daysInMonth; i += 1) {
            const next = new Date(startDate.getTime());
            next.setDate(startDate.getDate() + i);
            daysOfMonth.push(next);
        }
        return daysOfMonth;
    }

    static getWeeksInMonth(month, year, startDay = 'monday') {
        const weeks = [];
        const firstDate = new Date(Date.UTC(year, month - 1, 1));
        const lastDate = new Date(Date.UTC(year, month, 0));
        const numDays = lastDate.getUTCDate();

        let start = 1;
        let end;

        // Calculate the first end date based on the start day
        const firstDayOfWeek = firstDate.getUTCDay();
        if (startDay === 'monday') {
            end = firstDayOfWeek === 0 ? 1 : 8 - firstDayOfWeek;
        } else {
            end = 7 - firstDayOfWeek;
        }

        while (start <= numDays) {
            const currentDate = new Date(Date.UTC(year, month - 1, start));
            let week = Utilities.getWeek(currentDate);
            let weekYear = currentDate.getUTCFullYear();

            // Adjust year if week number belongs to the next year
            if (week === 1 && month === 12 && start >= 29) {
                weekYear += 1;
            }

            const daysInWeek = Utilities.getDaysInWeek(week, weekYear);
            weeks.push({
                start,
                end,
                week,
                year: weekYear,
                daysInWeek,
            });

            // Update start and end for next iteration
            start = end + 1;
            end = start + 6;

            if (end > numDays) {
                end = numDays;
            }
        }
        return weeks;
    }

    static getWeeksInYear(year = new Date().getFullYear()) {
        return Math.max(Utilities.getWeek(`${year}-12-31`), Utilities.getWeek(`${year}-12-24`));
    }

    static getFirstWeekInYear(year = new Date().getFullYear()) {
        return Utilities.getWeek(`${year}-01-01`);
    }

    static getDateOfWeek(week, year) {
        const day = (1 + (week - 1) * 7); // 1st of January + 7 days for each week
        return new Date(year, 0, day);
    }

    static getISOWeeksInYear(year) {
        const dec28 = new Date(Date.UTC(year, 11, 28));
        return this.getISOWeekNumber(dec28);
    }

    static getISOWeekNumber(date) {
        const target = new Date(date.valueOf());
        const dayNr = (date.getUTCDay() + 6) % 7;

        target.setUTCDate(target.getUTCDate() - dayNr + 3);

        const jan4 = new Date(Date.UTC(target.getUTCFullYear(), 0, 4));
        const firstThursday = jan4;
        const weekNumber = Math.round(
            ((target - firstThursday) / 86400000 - 3 + ((jan4.getUTCDay() + 6) % 7)) / 7 + 1
        );

        return weekNumber;
    }

    static getDateOfISOWeek(week, year) {
        const totalWeeks = Utilities.getISOWeeksInYear(year);
        if (week < 1 || week > totalWeeks) {
            throw new Error(`Invalid week number ${week} for year ${year}. Year ${year} has ${totalWeeks} weeks.`);
        }

        const jan4 = new Date(Date.UTC(year, 0, 4));
        const jan4DayOfWeek = jan4.getUTCDay() || 7;

        const week1Monday = new Date(jan4.getTime() - (jan4DayOfWeek - 1) * 86400000);

        const weekStart = new Date(week1Monday.getTime() + (week - 1) * 7 * 86400000);

        return weekStart;
    }

    static addDays(date, days) {
        const result = new Date(date);
        result.setDate(result.getDate() + days);
        return result;
    }

    static addSeconds(inputDate = new Date(), seconds) {
        const currentDate = Utilities.parseInputDate(inputDate);
        const futureDate = new Date(currentDate.getTime() + (seconds * 1000));
        return futureDate;
    }

    static shuffleArray($array) {
        const array = $array.slice(0);
        let currentIndex = array.length;
        let temporaryValue;
        let randomIndex;
        // While there remain elements to shuffle...
        while (currentIndex !== 0) {
            // Pick a remaining element...
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;

            // And swap it with the current element.
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }
        return array;
    }

    static splitArrayIntoChunks(array, numberOfChunks) {
        const resultArray = [];
        if (Array.isArray(array)) {
            const sizeOfChunk = Math.ceil(array.length / numberOfChunks);
            for (let i = 0, l = array.length; i < l; i += sizeOfChunk) {
                resultArray.push(array.slice(i, i + sizeOfChunk));
            }
        }
        return resultArray;
    }
}

// ES6:
export default Utilities;
// export { awesomeFunction };

// exports.a = 1
// exports.b = 2
// exports.c = 3
// const { a, b, c } = require('./uppercase.js')

// module.exports = MyLib;
