/*
* Function Throttle
* Control how often a function gets invoked from within the function itself.
* Copyright (c) 2018 Thom Hines
* Licensed under MIT.
* @author Thom Hines
* https://github.com/thomhines/Function-Throttle
* @version 2
*/


var ft_timers = {}, ft_maxwait_timers = {}, ft_trailing_disabled = {};

// Prevent function from running until wait number of milliseconds has passed without it being triggered.
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

	// If maxWait is triggered, reset maxWait timer, disable trailing trigger (for now), and run function
	if(ft_maxwait_timers[func] == 'run_immediately') {
		clearTimeout(ft_maxwait_timers[func]);
		ft_maxwait_timers[func] = null;
		ft_trailing_disabled[func] = 1; // turn off trailing function if no additional triggers happen after this point
		return false; // don't wait
	}

	ft_trailing_disabled[func] = 0; // turn on trailing functions again

	// If debounce timer is run, clear ALL timers and run function
	if(ft_timers[func] == 'run_immediately') {
		clearTimeout(ft_timers[func]);
		clearTimeout(ft_maxwait_timers[func]);
		ft_timers[func] = null;
		ft_maxwait_timers[func] = null;
		return false; // don't wait
	}

	// Run function immediately on initial run if leading trigger is set to true
	var run_immediately = false;
	if(options.leading && ft_timers[func] == null) run_immediately = true;

	// Set timers
	clearTimeout(ft_timers[func]);
	ft_timers[func] = setTimeout(function() {
		if(options.trailing && !ft_trailing_disabled[func]) {
			ft_timers[func] = 'run_immediately';
			fn();
		} else {
			ft_timers[func] = null;
		}
	}, wait);

	if(options.maxWait && !ft_maxwait_timers[func]) {
		ft_maxwait_timers[func] = setTimeout(function() {
			if(options.leading)	{
				clearTimeout(ft_timers[func]);
				clearTimeout(ft_maxwait_timers[func]);
				ft_timers[func] = null;
				ft_maxwait_timers[func] = null;
			}
			if(options.trailing)	{
				ft_maxwait_timers[func] = 'run_immediately';
				fn();
			}
		}, options.maxWait);
	}

	if(run_immediately) return false; // Let function run

	return true; // Don't let function run

}



// Prevent function more than once every wait milliseconds.
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
	if(!options) options = {leading: true, trailing: false};

	options.maxWait = wait;

	return debounce(func, wait, options);
}
