
var debounce_timers = {}, maxwait_timers = {}, trailing_disabled = {};

function debounce(_func, _wait, _options) { // leading=true, trailing=false, maxWait = 0

	// Interpret arguments
	var func, wait, options;
	if(typeof _func === 'string') func = _func;
	else if(_func === parseInt(_func)) wait = _func;
	else if(typeof _func === 'object') options = _func;
	if(_wait === parseInt(_wait)) wait = _wait;
	else if(typeof _wait === 'object') options = _wait;
	if(_options) options = _options;

	// Set defaults
	if(!func) func = arguments.callee.caller.name;
	if(!wait) wait = 100;
	if(!options) options = {};
	if(options.leading == undefined) options.leading = false;
	if(options.trailing == undefined) options.trailing = true;
	if(options.maxWait == undefined) options.maxWait = false;

	// Get function from function name
	var fn = window[func];

	// If maxWait is triggered, reset timers and run function
	if(maxwait_timers[func] == 'run_immediately') {
		clearTimeout(maxwait_timers[func]);
		maxwait_timers[func] = null;
		trailing_disabled[func] = 1; // turn off trailing function if no additional triggers happen after this point
		return false; // don't wait
	}

	trailing_disabled[func] = 0; // turn on trailing functions again

	if(debounce_timers[func] == 'run_immediately') {
		clearTimeout(debounce_timers[func]);
		clearTimeout(maxwait_timers[func]);
		debounce_timers[func] = null;
		maxwait_timers[func] = null;
		return false; // don't wait
	}




	var run_immediately = false;
	if(options.leading && debounce_timers[func] == null) run_immediately = true;

	// Set timers
	clearTimeout(debounce_timers[func]);
	debounce_timers[func] = setTimeout(function() {
		if(options.trailing && !trailing_disabled[func]) {
			debounce_timers[func] = 'run_immediately';
			fn();
		} else {
			debounce_timers[func] = null;
		}
	}, wait);

	if(options.maxWait && !maxwait_timers[func]) {
		maxwait_timers[func] = setTimeout(function() { maxwait_timers[func] = 'run_immediately'; fn(); }, options.maxWait);
	}

	if(run_immediately) return false

	return true;
}

//
function throttle(_func, _wait, _options) {
	var func, wait, options;
	if(typeof _func === 'string') func = _func;
	else if(_func === parseInt(_func)) wait = _func;
	else if(typeof _func === 'object') options = _func;
	if(_wait === parseInt(_wait)) wait = _wait;
	else if(typeof _wait === 'object') options = _wait;
	if(_options) options = _options;

	// Set defaults
	if(!func) func = arguments.callee.caller.name;
	if(!wait) wait = 100;
	if(!options) options = {};

	options.maxWait = wait;

	return debounce(func, wait, options);
}
