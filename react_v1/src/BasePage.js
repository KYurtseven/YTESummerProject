export async function CallApiGet(apiUrl) {

	return await fetch(apiUrl, {
	                          method: 'GET',
	                          headers: {
	                            'Accept': 'application/json',
	                            'Content-Type': 'application/json;charset=UTF-8',
	                          }	                          
	                        });
}