export async function CallApiGet(apiUrl) {

	return await fetch(apiUrl, {
	                          method: 'GET',
	                          headers: {
	                            'Accept': 'application/json',
	                            'Content-Type': 'application/json;charset=UTF-8',
	                          }	                          
	                        });
}

export async function CallApiPost(apiUrl, body) {

	return await fetch(apiUrl, {
	                          method: 'POST',
	                          headers: {
	                            'Accept': 'application/json',
	                            'Content-Type': 'application/json;charset=UTF-8',
	                          },
	                          body : body	                          	                         
	                        });
}

export function isValidDate(dateString)
{
		var regex_date = /^\d{4}\-\d{1,2}\-\d{1,2}$/;

		if(!regex_date.test(dateString))
		{
				return 'error';
		}

		// Parse the date parts to integers
		var parts   = dateString.split("-");
		var day     = parseInt(parts[2], 10);
		var month   = parseInt(parts[1], 10);
		var year    = parseInt(parts[0], 10);

		// Check the ranges of month and year
		if(year < 1000 || year > 3000 || month === 0 || month > 12)
		{
				return 'error';
		}

		var monthLength = [ 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31 ];

		// Adjust for leap years
		if(year % 400 === 0 || (year % 100 !== 0 && year % 4 === 0))
		{
				monthLength[1] = 29;
		}

		// Check the range of the day
		if(day > 0 && day <= monthLength[month - 1])
			return 'success';
		return 'error';
}

export function validateEmail(email) {
	var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	return re.test(String(email).toLowerCase()) ? 'success' : 'error';
}