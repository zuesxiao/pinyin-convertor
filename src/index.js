/**
 * Created by lingxiao on 15/05/2017.
 */

const config = require('./config');
const dictionary = require('./dictionary');
const UNIHANS = dictionary.UNIHANS;
const PINYIN = dictionary.PINYIN;

let supported = null;
let collator = null;

/**
 *
 * @param force
 */
function isSupported(force) {
    if (!force && supported != null) {
        return supported;
    }

    if (typeof Intl === 'object' && Intl.Collator) {
        collator = new Intl.Collator(['zh-Hans-CN', 'zh-CN']);
        supported = Intl.Collator.supportedLocalesOf(['zh-CN']).length === 1;
    } else {
        supported = false;
    }

    return supported;
};

/**
 *
 * @param char
 */
function getToken(char) {
    const token = {
        source: char
    };

    let compare;

    if (char.charCodeAt(0) < 256) {
        token.type = config.TOKEN_TYPE_LATIN;
        token.target = char;
        return token;
    }

    compare = collator.compare(char, config.FIRST_PINYIN_UNIHAN);
    if (compare < 0) {
        token.type = config.TOKEN_TYPE_UNKNOWN;
        token.target = char;
        return token;
    }
    compare = collator.compare(char, config.LAST_PINYIN_UNIHAN);
    if (compare > 0) {
        token.type = config.TOKEN_TYPE_UNKNOWN;
        token.target = char;
        return token;
    }

    token.type = config.TOKEN_TYPE_PINYIN;
    let begin = 0;
    let end = UNIHANS.length - 1;
    let offset;
    while (begin <= end) {
        offset = (begin + end) / 2;
        let unihan = UNIHANS[offset];
        compare = collator.compare(char, unihan);
        if (compare === 0) {
            break;
        } else if (compare < 0) {
            end = offset - 1;
        } else {
            begin = offset + 1;
        }
    }

    if (compare !== 0) {
        token.target = null;
    } else {
        token.target = PINYIN[offset];
    }

    if (!token.target) {
        token.type = config.TOKEN_TYPE_UNKNOWN;
        token.target = char;
    }

    return token;
};

/**
 *
 * @param str
 */
function parse(str) {
    if (typeof str !== 'string') {
        throw new Error('Argument should be string.');
    }

    if (!supported) {
        throw new Error('Not support Intl or zh-CN language.');
    }

    return str.split('').map((v) => {
        return getToken(v);
    });
};

/**
 *
 * @param str
 * @param sep
 * @param lower
 */
function convert(str, sep, lower) {
    return parse(str).map((v) => {
        if (lower && v.type === config.TokenType.PINYIN) {
            return v.target.toLowerCase();
        }
        return v.target;
    }).join(sep || ' ');
};

/**
 *
 * @type {{isSupported: isSupported, parse: parse, convert: convert}}
 */
module.exports = {
    isSupported,
    parse,
    convert
};
