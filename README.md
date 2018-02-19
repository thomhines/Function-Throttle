# Function Throttle

### [Check out the demo page](http://projects.thomhines.com/Function-Throttle/) for more details on how to use this thing.

##### Control how often a function gets invoked from within the function itself.

Debounce/throttle functions similar to lodash, but meant to be be run within the function itself instead of on an event so that functions are consistently limited no matter how it's triggered or how many triggers there might be.


#### throttle

throttle([wait=100], [options={}])

#### debounce

throttle([wait=100], [options={}])


### Usage

	function someFunction() {
		// Ensure that function runs no more than once every 1000ms
		if(throttle(1000)) return;

		// the rest of your function code...
	}

Note: If you are needing to support much older browsers and they are not compatible with caller..., you can refer to the function with the function name and arguments in the and it will run without issue:

	function someFunction(args) {
		if(debounce(1000, {function: 'someFunction', arguments: args})) return;
		...
	}
