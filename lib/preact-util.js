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
const IMAGE_SERVER_KEY = 'imageServer';
const JWT_TOKEN_KEY = 'jwtToken';
const USER_EMAIL = 'userEmail';
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
        path.split('.').forEach((part) => {
            if (typeof el[part] === 'undefined') {
                el = null;
            }

            if (el) {
                el = el[part];
            }
        });

        return el;
    }

    static setNestedValue(obj, is, value) {
        if (typeof is === 'string') {
            return Utilities.setNestedValue(obj, is.split('.'), value);
        }
        if (is.length === 1 && value !== undefined) {
            // eslint-disable-next-line
            return obj[is[0]] = value;
        }
        if (is.length === 0) {
            return obj;
        }
        return Utilities.setNestedValue(obj[is[0]], is.slice(1), value);
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
            return email.replace(/[^a-z1-9]/g, '_');
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
            return inputDate;
        }
        if (Utilities.isString(inputDate) || Utilities.isNumber(inputDate)) {
            if (inputDate > 1000000000 && inputDate < 9999999999) {
                parsedDate = new Date(0); // The 0 there is the key, which sets the date to the epoch
                parsedDate.setUTCSeconds(inputDate);
            } else if (inputDate > 1000000000000 && inputDate < 9999999999999) {
                parsedDate = new Date(0); // The 0 there is the key, which sets the date to the epoch
                parsedDate.setUTCSeconds(parseInt(inputDate / 1000, 10));
            } else if (Utilities.isString(inputDate) && inputDate.match(/\d{4}-\d{2}-\d{2}/)) {
                // "d.m.y"
                parsedDate = new Date(inputDate);
            }
        } else {
            parsedDate = new Date();
        }
        return parsedDate;
    }

    static isoDate(inputDate, showSeconds = false, showTimezone = false, showDateOnly = false) {
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
            if (!showDateOnly) {
                ret += ` ${Utilities.padDate(hh)}:${Utilities.padDate(mi)}`;
                if (showSeconds) {
                    ret += `:${Utilities.padDate(ss)}`;
                }
                if (showTimezone) {
                    ret += `${dif}${tzo}`;
                }
            }
            return ret;
        }
        return 'n/a';
    }

    static getApiServer() {
        return localStorage.getItem(API_SERVER_KEY);
    }

    static setApiServer(apiServer) {
        return localStorage.setItem(API_SERVER_KEY, apiServer);
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

    static getUserEmail() {
        return localStorage.getItem(USER_EMAIL);
    }

    static removeUserEmail() {
        return localStorage.removeItem(USER_EMAIL);
    }

    static setObject(objKey, key, val) {
        const value = localStorage.getItem(objKey);
        let obj = {};
        if (typeof key === 'object') {
            obj = { ...key };
        } else {
            if (typeof value === 'string') {
                obj = JSON.parse(value);
            }
            obj[key] = val;
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
        let data = JSON.parse(localStorage.getItem(objKey));
        if (data === null) {
            data = {};
        }
        return data;
    }

    static set(key, val) {
        return localStorage.setItem(key, JSON.stringify(val));
    }

    static unset(key) {
        return localStorage.setItem(key, null);
    }

    static get(key) {
        return JSON.parse(localStorage.getItem(key));
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
        const apiServer = Utilities.getApiServer();

        const shouldPublish = opts.hasOwnProperty('publish') ? opts.publish : true;

        if (shouldPublish) {
            PubSub.publish(topics.LOADING_PROGRESS, 0);
        }

        const jwtToken = Utilities.getJwtToken();
        const fetchOpt = {
            credentials: 'omit',
            method: 'GET',
            mode: 'cors',
            cache: 'default',
            headers: {},
            publish: true,
            ...opts,
        };

        if (jwtToken) {
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

        if (shouldPublish) {
            PubSub.publish(topics.LOADING_PROGRESS, 25);
        }

        try {
            const response = await fetch(`${apiServer}${endpoint}${qs ? `?${qs}` : ''}`, fetchOpt);
            if (shouldPublish) {
                PubSub.publish(topics.LOADING_PROGRESS, 100);
            }

            if (response.status >= 500) {
                throw new Error(`${response.status} ${response.statusText}`);
            }

            return response.json();
        } catch (err) {
            if (shouldPublish) {
                PubSub.publish(topics.ERROR_MESSAGE, 'An error occurred');
                return [];
            }

            throw err;
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

    static ucfirst(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    static randomPassword() {
        const randomstring = Math.random().toString(36).slice(-8);
        return randomstring;
    }

    static toggleDarkModeClasses(isEnabled) {
        if (isEnabled) {
            document.body.classList.remove('bootstrap');
            document.body.classList.add('bootstrap-dark');
        } else {
            document.body.classList.remove('bootstrap-dark');
            document.body.classList.add('bootstrap');
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

    static yearRange(startYear = 1980) {
        const currentYear = new Date().getFullYear();
        const years = [];
        let thisYear = startYear;
        while (thisYear <= currentYear) {
            years.push(thisYear += 1);
        }
        return years;
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

    /**
    * Normalizes a value from one range (current) to another (new).
    *
    * @param  { Number } val    //the current value (part of the current range).
    * @param  { Number } minVal //the min value of the current value range.
    * @param  { Number } maxVal //the max value of the current value range.
    * @param  { Number } newMin //the min value of the new value range.
    * @param  { Number } newMax //the max value of the new value range.
    * @param  { Number } absMax //the absolute maximum you want to return.
    *
    * @returns { Number } the normalized value.
    */
    static normalizeBetween(val, minVal, maxVal, newMin, newMax, absMax) {
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

    static age(birth, deceased = new Date()) {
        const fromDate = Utilities.parseInputDate(birth);
        const endDate = Utilities.parseInputDate(deceased);

        const ageDifMs = endDate.getTime() - fromDate.getTime();
        const ageDate = new Date(ageDifMs); // miliseconds from epoch
        return Math.abs(ageDate.getUTCFullYear() - 1970);
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
