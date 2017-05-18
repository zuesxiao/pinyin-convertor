/**
 * Created by lingxiao on 15/05/2017.
 */

'use strict';

const assert = require('assert');
const convertor = require('../src');

describe('PinYin-Convertor', () => {
    describe('isSupported()', () => {
        it('should return false when not support Intl or zh-CN language', () => {
            assert(convertor.isSupported() === false);
        });
    });

    describe('parse()', () => {
        it('should throw when not support Intl or zh-CN language', () => {
            try {
                convertor.parse('我');
            } catch (e) {
                assert(e.message === 'Not support Intl or zh-CN language.');
            }
        });
    });
});
