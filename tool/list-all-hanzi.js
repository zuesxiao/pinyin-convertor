/**
 * Created by lingxiao on 15/05/2017.
 */

const fs = require('fs');
const FIRST_PINYIN_UNIHAN = 19968;
const LAST_PINYIN_UNIHAN = 40959;

function listAllHanZiInOrder() {
    const array = [];
    const collator = new Intl.Collator(['zh-Hans-CN']);
    for (let i = FIRST_PINYIN_UNIHAN; i <= LAST_PINYIN_UNIHAN; i++) {
        array.push(String.fromCharCode(i));
    }
    array.sort(collator.compare);
    console.log(array.length);
    fs.writeFileSync(`${__dirname}/sorted-hanzi.json`, JSON.stringify(
        array.map((value, index) => {
            return {
                hanzi: value,
                unicode: `\\u${value.charCodeAt(0).toString(16)}`,
                index: index
            };
        }),
        null,
        ' '
    ));
    console.log('Done!!!');
};

function createDictionaryMap(){
    var dict = require('../src/dictionary');
    const map = [];
    for(let i = 0; i < dict.UNIHANS.length; i ++){
        var value = dict.UNIHANS[i].codePointAt(0).toString(16);
        map.push([`\\u${value}`,dict.PINYINS[i]]);
    }
    fs.writeFileSync(`${__dirname}/map.json`, JSON.stringify(map), null, ' ');
    console.log('Map Done!!!');
}

// listAllHanZiInOrder();
createDictionaryMap();