/**
 * Created by lingxiao on 15/05/2017.
 */

'use strict';

const assert = require('assert');
const convertor = require('../src');
const {polyphone, common} = require('./data.spec');

describe('PinYin Convertor', () => {
    describe('isSupported()', () => {
        it('should return true when supported', () => {
            assert(convertor.isSupported() === true);
        });
    });

    describe('parse()', () => {
        it('should throw when argument is not string', () => {
            assert.throws(() => convertor.parse());
        });

        it('should return empty array when argument is empty string', () => {
            assert.deepEqual(convertor.parse(''), []);
        });

        it('should parse hanzi to pinyin correctly', () => {
            assert.deepEqual(convertor.parse('我'), [{
                source: '我',
                type: 2,
                target: 'WO'
            }]);
        });

        it('should parse latin to latin', () => {
            const latin = 'abcD0123';
            const res = convertor.parse(latin);
            res.forEach((v, i) => {
                assert(v.source === latin[i]);
                assert(v.type === 1);
                assert(v.target === latin[i]);
            });
        });

        it('should parse unknown character to unknown character', () => {
            const unknown = '\u4000';
            const res = convertor.parse(unknown);
            assert.deepEqual(res[0].source, res[0].target);
        });
    });

    describe('convert()', () => {
        it('should throw when argument is not string', () => {
            assert.throws(() => convertor.convertToPinyin());
        });

        it('should return empty string when argument is empty string', () => {
            assert(convertor.convertToPinyin('') === '');
        });

        it('should convert hanzi to pinyin correctly', () => {
            assert(convertor.convertToPinyin('我') === 'WO');
        });

        it('should convert latin to latin', () => {
            const latin = 'abcD0123';
            assert(convertor.convertToPinyin(latin) === latin);
        });

        it('should convert unknown character to unknown character', () => {
            const unknown = '\u4000\u4001';
            assert(convertor.convertToPinyin(unknown) === unknown);
        });

        it('should convert unknown character to unknown character', () => {
            const unknown = '\u4000\u4001';
            assert(convertor.convertToPinyin(unknown) === unknown);
        });

        it('should convert all common hanzi to pinyin correctly', () => {
            let res;
            // common hanzi
            for (let item in common) {
                common[item].forEach(v => {
                    res = convertor.convert(v, '', true);
                    assert(res === item);
                });
            }
            // polyphone hanzi
            for (let item in polyphone) {
                res = convertor.convert(item, '', true);
                assert(polyphone[item].indexOf(res) > -1);
            }
        });
    });
});
