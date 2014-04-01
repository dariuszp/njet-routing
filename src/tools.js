'use strict';

function trim(str, charlist) {
    var whitespace, l = 0,
        i = 0;
    str += '';

    if (!charlist) {
        // default list
        whitespace =
            ' \n\r\t\f\x0b\xa0\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200a\u200b\u2028\u2029\u3000';
    } else {
        // preg_quote custom list
        charlist += '';
        whitespace = charlist.replace(/([\[\]\(\)\.\?\/\*\{\}\+\$\^\:])/g, '$1');
    }

    l = str.length;
    for (i = 0; i < l; i++) {
        if (whitespace.indexOf(str.charAt(i)) === -1) {
            str = str.substring(i);
            break;
        }
    }

    l = str.length;
    for (i = l - 1; i >= 0; i--) {
        if (whitespace.indexOf(str.charAt(i)) === -1) {
            str = str.substring(0, i + 1);
            break;
        }
    }

    return whitespace.indexOf(str.charAt(0)) === -1 ? str : '';
}

function escapeRegExp(string) {
    return string.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
}

function unEscapeRegExp(string) {
    return string.replace(/\\([.*+?^=!:${}()|\[\]\/\\])/g, "$1");
}

function sortObject(obj, descending) {
    if (!(obj instanceof Object)) {
        throw new Error('You can only sort objects');
    }

    var sortedObj = {},
        params = [],
        key,
        i;

    for (key in obj) {
        if (obj.hasOwnProperty(key)) {
            params.push(key);
        }
    }

    params.sort();
    if (descending) {
        params.reverse();
    }

    for (i = 0; i < params.length; i++) {
        key = params[i];
        sortedObj[key] = obj[key];
    }

    return sortedObj;
}

module.exports = {
    trim: trim,
    escapeRegExp: escapeRegExp,
    unEscapeRegExp: unEscapeRegExp,
    sortObject: sortObject
};