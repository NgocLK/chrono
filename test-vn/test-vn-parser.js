//var chrono = require('../chrono');
//require('../parsers/VN/VNAllNumericFormParser');

var text = "26/04/2014";
var results = chrono.parse(text);
console.log(results);

text = "26.04.2014";
results = chrono.parse(text);
console.log(results);

text = "thứ 7, 26-04-2014";
results = chrono.parse(text);
console.log(results);

text = 'Từ 08:30 - 17/05/2014 đến 16:30 - 25/05/2014';
results = chrono.parse(text);
console.log(results);

text = 'Từ 17:30 đến 19:00 Ngày 24/04/2014';
results = chrono.parse(text);
console.log(results);