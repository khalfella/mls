var mod_stream = require('stream');
var StringDecoder = require('string_decoder').StringDecoder;


module.exports = function () {
	var mls = new mod_stream.Transform();
	mls.decoder = new StringDecoder();
	mls.savedString = null;

	mls._transform = function (chunk, enc, cb) {
		// prepend the saved line to the decoded chunk
		var str = this.savedString === null ? '' : this.savedString;
		str += this.decoder.write(chunk);
		var idx = str.lastIndexOf('\n');

		// If all what we have is an incomplete line, then
		// we save it and push nothing down stream.
		if (idx === -1) {
			this.savedString = str;
			cb();
			return;
		}

		// Otherwise, we save the last incomplete line
		// and push rest downstream.
		this.savedString = str.slice(idx + 1);
		this.push(str.slice(0, idx + 1));
		cb();
	};

	mls._flush = function (cb) {
		 // In the case of empty input
		if (this.savedString === null) {
			cb();
			return;
		}
		var lastLine = this.savedString + this.decoder.end();
		if (lastLine !== '') {
			// Push the last incomplete line
			this.push(lastLine + '\n');
		}
		cb();
	};

	return mls;
}
