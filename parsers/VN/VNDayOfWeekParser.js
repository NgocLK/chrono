/*
	A Vietnamese date parser for day of week.
	Example: thứ 7, 26/04/2014
*/
(function () {

    if (typeof chrono == 'undefined')
        throw 'Cannot find the chrono main module';

	// thứ 7, 26-04-2014
    var PATTERN = /(\W|^)(thứ [2-7]|chủ nhật|CN|T[2-7]|thu [2-7]|chu nhat|thứ hai|thứ ba|thứ tư|thứ năm|thứ sáu|thứ bảy|thu hai|thu ba|thu tu|thu nam|thu sau|thu bay)\s*,*\s*([0-9]{1,2})[\/\.-]([0-9]{1,2})[\/\.-]([0-9]{4}|[0-9]{2})(\W|$)/i;
	
	var DAYS_OFFSET = {
		'chủ nhật': 0, 'chu nhat': 0, 'cn': 0,
		'thứ 2': 1, 'thu 2': 1, 't2': 1, 'thu hai': 1,
		'thứ 3': 2, 'thu 3': 2, 't3': 2, 'thu ba': 2,
		'thứ 4': 3, 'thu 4': 3, 't4': 3, 'thu tu': 3,
		'thứ 5': 4, 'thu 5': 4, 't5': 4, 'thu nam': 4,
		'thứ 6': 5, 'thu 6': 5, 't6': 5, 'thu sau': 5,
		'thứ 7': 6, 'thu 7': 6, 't7': 6, 'thu bay': 6 };
		

    /**
     * DayOfWeekParser - Create a parser object
     *
     * @param  { String }           text - Orginal text to be parsed
     * @param  { Date, Optional }   ref  - Referenced date
     * @param  { Object, Optional } opt  - Parsing option
     * @return { CNParser }
     */
    function VNDayOfWeekParser(text, ref, opt) {

        opt = opt || {};
        ref = ref || new Date();
        var parser = chrono.Parser(text, ref, opt);

        parser.pattern = function () {
            return PATTERN;
        }

        parser.extract = function (text, index) {

            var matchedTokens = text.substr(index).match(PATTERN);
            if (matchedTokens == null) {
                finished = true;
                return;
            }

            var text = matchedTokens[0];
            text = matchedTokens[0].substr(0, matchedTokens[0].length - matchedTokens[6].length - matchedTokens[1].length);

			var dayOfWeek = matchedTokens[2];
			var offset = DAYS_OFFSET[dayOfWeek];
            var days = parseInt(matchedTokens[3]);
            var months = parseInt(matchedTokens[4]) - 1; //JS month
            var years = parseInt(matchedTokens[5]);
			if(offset === undefined)
				return null;

            if (years < 100) {
                if (years > 50) years = years + 1900; //01 - 20
                else years = years + 2000;
            }

            var date = moment([years, months, days]);

            //Hit some impossible date or invalid date
            if (date.date() != days || date.month() != months || date.year() != years) {
                return null;
            }

            return new chrono.ParseResult({
                referenceDate: ref,
                text: text,
                index: index,
                start: {
                    day: date.date(),
                    month: date.month(),
                    year: date.year(),
                    dayOfWeek: offset,
					impliedComponents: ['ngày', 'tháng', 'năm']
                }
            });
        };

        return parser;
    }

    chrono.parsers.VNDayOfWeekParser = VNDayOfWeekParser;
})();