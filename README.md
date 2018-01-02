# Throttle

Debounce/throttle functions similar to lodash, but meant to be be run within the function itself instead of on an event so that they are consistently throttled no matter how many triggers there might be.


#### throttle

throttle([func=current_function_name], [wait=100], [options={}])

#### debounce

throttle([func=current_function_name], [wait=100], [options={}])


### Usage

	function someFunction() {
		// Place this at the top of your function to ensure that function runs no more than once every second
		if(throttle(1000)) return;

		// if not throttled, continue executing the rest of your function code...
	}

Note: If you are needing to support much older browsers and they are not compatible with caller..., you can refer to the function with the function name and it will run without issue:

	function someFunction() {
		// Place this at the top of your function to ensure that function runs no more than once every second
		if(debounce('someFunction', 1000, {leading: true, maxWait: 3000})) return;

		// if not throttled, continue executing the rest of your function code...
	}
