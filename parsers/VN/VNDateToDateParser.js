/*
	A Vietnamese date parser for "from time - date to time - date" format.
	Example: từ 08:30 - 17/05/2014 đến 16:30 - 25/05/2014
*/
(function () {

    if (typeof chrono == 'undefined')
        throw 'Cannot find the chrono main module';

	// thứ 7, 26-04-2014
    var PATTERN = /(\W|^)(từ|tu)\s*([0-9]{1,2})(\.|\:|\：)([0-9]{1,2})\s*-\s*([0-9]{1,2})[\/\.-]([0-9]{1,2})[\/\.-]([0-9]{4}|[0-9]{2})\s*(đến|den)\s*([0-9]{1,2})(\.|\:|\：)([0-9]{1,2})\s*-\s*([0-9]{1,2})[\/\.-]([0-9]{1,2})[\/\.-]([0-9]{4}|[0-9]{2})(\W|$)/i;

    /**
     * DayOfWeekParser - Create a parser object
     *
     * @param  { String }           text - Orginal text to be parsed
     * @param  { Date, Optional }   ref  - Referenced date
     * @param  { Object, Optional } opt  - Parsing option
     * @return { CNParser }
     */
    function VNDateToDateParser(text, ref, opt) {

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
            text = matchedTokens[0].substr(0, matchedTokens[0].length - matchedTokens[12].length - matchedTokens[1].length);

			var fromHours = parseInt(matchedTokens[3]);
			var fromMinutes = parseInt(matchedTokens[5]);
            var fromDays = parseInt(matchedTokens[6]);
            var fromMonths = parseInt(matchedTokens[7]) - 1; //JS month
            var fromYears = parseInt(matchedTokens[8]);
			
			var toHours = parseInt(matchedTokens[10]);
			var toMinutes = parseInt(matchedTokens[12]);
			var toDays = parseInt(matchedTokens[13]);
			var toMonths = parseInt(matchedTokens[14]) - 1;
			var toYears = parseInt(matchedTokens[15]);

            if (fromYears < 100) {
                if (fromYears > 50) fromYears = fromYears + 1900; //01 - 20
                else fromYears = fromYears + 2000;
            }
			
			if (toYears < 100) {
                if (toYears > 50) toYears = toYears + 1900; //01 - 20
                else toYears = toYears + 2000;
            }
			
            var fromDate = moment([fromYears, fromMonths, fromDays, fromHours, fromMinutes]);
			var toDate = moment([toYears, toMonths, toDays, toHours, toMinutes]);

            //Hit some impossible date or invalid date
            if (fromDate.date() != fromDays || fromDate.month() != fromMonths || fromDate.year() != fromYears || fromDate.hour() != fromHours || fromDate.minute() != fromMinutes) {
                return null;
            }
			
			if (toDate.date() != toDays || toDate.month() != toMonths || toDate.year() != toYears || toDate.hour() != toHours || toDate.minute() != toMinutes) {
                return null;
            }

            return new chrono.ParseResult({
                referenceDate: ref,
                text: text,
                index: index,
                start: {
                    day: fromDate.date(),
                    month: fromDate.month(),
                    year: fromDate.year(),
					hour: fromDate.hour(),
					minute: fromDate.minute(),
                    dayOfWeek: fromDate.day(),
					impliedComponents: ['ngày', 'tháng', 'năm']
                },
				end: {
					day: toDate.date(),
					month: toDate.month(),
					year: toDate.year(),
					hour: toDate.hour(),
					minute: toDate.minute(),
					dayOfWeek: toDate.day(),
					impliedComponents: ['ngày', 'tháng', 'năm']
				}
            });
        };
		
        return parser;
    }

    chrono.parsers.VNDateToDateParser = VNDateToDateParser;
})();