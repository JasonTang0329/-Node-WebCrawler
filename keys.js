// /root/redis-stable/src/redis-cli -a Sst SCRIPT LOAD "$(cat ./xxx.lua)"
// 在設定好新的開獎功能後，需要將lua註冊到Redis(執行上方程式馬註冊，會回傳guid Sst代表Redis密碼，./xxx.lua代表註冊的程式碼位置)
//
// 在部屬完成也設定好Key後，在主機使用pm2 list觀察主機狀況(□)，在下 pm2 restart 0進行重啟
// 每個伺服器均有不同參數，請勿共用
let arr = [];

arr['get_lottery_wait_ct'] = 'ca4c1d82f4875de98be10d4133cc35d0d1c93634';
arr['lottery_bingo_ct'] = '37a5565f8e6cbe8d31c96a22d689f7f94b098e51';
arr['set_lottery_ct'] = '20e359c7b3da2474429aea83b3f5f4c1c1e9613f';
arr['set_lottery_wait_ct'] = 'a21222c2da752492604bf7ecfe61b5204708b5ed';

arr['get_lottery_wait_rc'] = '9521ce6863d085b2047d17bebb8baf57496bdfaf';
arr['lottery_bingo_rc'] = '82324fec522a6225d8d9d8b1b8a7b4f8b064e95d';
arr['set_lottery_rc'] = '296f1d01527075cc9b156504924edc6e94e2d7f4';
arr['set_lottery_wait_rc'] = '947101bd50d70b18893abbecc33321c0365d43f0';

arr['get_lottery_wait_pe'] = 'ad6a143c0405f0612202207df2422b4f05ce64cb';
arr['lottery_bingo_pe'] = 'b5fe1df43f13208ab5cfc8473f93e0364275c254';
arr['set_lottery_pe'] = 'b13faa1781b3e4c62bca2457e9af9e41025cdcaf';
arr['set_lottery_wait_pe'] = 'a47edddcb83901b213a67236b065979ed445002c';

arr['get_lottery_wait_pk'] = '3bcaf478b244eb845ead39ba779f577472139293';
arr['lottery_bingo_pk'] = '54c8b52ae0e71cb50a753a43c27340aafa7470c7';
arr['set_lottery_pk'] = 'b518129bb639cfc29e666e7bf1397f048cc23abc';
arr['set_lottery_wait_pk'] = 'ba416ede6ed06ddfbd72f40baeec4a1a9ab3f22d';

arr['get_lottery_wait_sy'] = 'd7ad69271b546b44a298c1039497d004e1c8df59';
arr['lottery_bingo_sy'] = '18fe5e34b13db445677518fc232be3d076a404d5';
arr['set_lottery_sy'] = '1e06396d20f85e36c863348beae56db131f8e66e';
arr['set_lottery_wait_sy'] = 'a975a0e3800be213709110cc197d83b177fcb3f8';

arr['get_lottery_wait_wn'] = '042fb65b0d094c2e48d416cbf831503c79a9c27c';
arr['lottery_bingo_wn'] = '471dc731f5bde53ce4d50a1640acb99d3ed9458e';
arr['set_lottery_wn'] = 'dbddff86f1334cfbbe0c5026a131a18e976a7ceb';
arr['set_lottery_wait_wn'] = '95a7738732ef5312d3a608440a62c85c123334d6';

module.exports = arr;
