/*
	A Vietnamese date parser for "from time - date to time - date" format.
	Example: từ 08:30 đến 17:00 Ngày 17/05/2014
*/
(function () {

    if (typeof chrono == 'undefined')
        throw 'Cannot find the chrono main module';

    var PATTERN = /(\W|^)(từ|tu)\s*([0-9]{1,2})(\.|\:|\：)([0-9]{1,2})\s*(đến|den)\s*([0-9]{1,2})(\.|\:|\：)([0-9]{1,2})\s*(ngày|ngay)\s*([0-9]{1,2})[\/\.-]([0-9]{1,2})[\/\.-]([0-9]{4}|[0-9]{2})(\W|$)/i;

    /**
     * DayOfWeekParser - Create a parser object
     *
     * @param  { String }           text - Orginal text to be parsed
     * @param  { Date, Optional }   ref  - Referenced date
     * @param  { Object, Optional } opt  - Parsing option
     * @return { CNParser }
     */
    function VNTimeInDateParser(text, ref, opt) {

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
            text = matchedTokens[0].substr(0, matchedTokens[0].length - matchedTokens[14].length - matchedTokens[1].length);

			var fromHours = parseInt(matchedTokens[3]);
			var fromMinutes = parseInt(matchedTokens[5]);
			var toHours = parseInt(matchedTokens[7]);
			var toMinutes = parseInt(matchedTokens[9]);
            var days = parseInt(matchedTokens[11]);
            var months = parseInt(matchedTokens[12]) - 1; //JS month
            var years = parseInt(matchedTokens[13]);

            if (years < 100) {
                if (years > 50) years = years + 1900; //01 - 20
                else years = years + 2000;
            }
			
            var fromDate = moment([years, months, days, fromHours, fromMinutes]);
			var toDate = moment([years, months, days, toHours, toMinutes]);

            //Hit some impossible date or invalid date
            if (fromDate.date() != days || fromDate.month() != months || fromDate.year() != years || fromDate.hour() != fromHours || fromDate.minute() != fromMinutes) {
                return null;
            }
			
			if (toDate.date() != days || toDate.month() != months || toDate.year() != years || toDate.hour() != toHours || toDate.minute() != toMinutes) {
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

    chrono.parsers.VNTimeInDateParser = VNTimeInDateParser;
})();