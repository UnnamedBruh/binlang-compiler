const BINLangCompilerNew = function(code, ret = "arraybuffer") {
	const array = [1], tokens = code.match(/\[([A-Z0-9]+)\]|"([^"\n\\]|\\(["\\]|[0-9]+|\\[nt]))+"|[a-zA-Z]+|-?[0-9]+(\.[0-9]*)?|[\n;](?:[\n;]*)|[^ \t]/gms);
	const len = tokens.length >>> 0, zero = 0 >>> 0, one = 1 >>> 0, two = 2 >>> 0, three = 3 >>> 0, four = 4 >>> 0, five = 5 >>> 0, six = 6 >>> 0, seven = 7 >>> 0, eight = 8 >>> 0, nine = 9 >>> 0, tff = 255 >>> 0, tfs = 256 >>> 0, note = -128, ote = 128 >>> 0;
	const typeOrder = {"UINT8":zero,"UINT16":one,"INT8":two,"UFLOAT16":three,"UTF8STRING":four}, stringEsc = {"n":10>>>zero,"t":nine}, back = "\\";
	let state = zero, token, lineCount = zero, identifiers = {}, amountOfIdentifiers = zero, substate = zero, valuePassed;
	function compress(ident, newi = false) {
		if (identifiers[ident]) return identifiers[ident];
		const ea = (Math.floor(amountOfIdentifiers / tfs) + one) >>> zero, array = [];
		let id = amountOfIdentifiers;
		for (let i = 0; i !== ea; i++, i >>>= zero) {
			array.push(Math.min(tff, id));
			id -= tfs;
		}
		if (newi) {
			identifiers[ident] = new Uint8Array(array);
			amountOfIdentifiers++;
			return identifiers[ident];
		} else {
			return new Uint8Array(array);
		}
	}
	for (let i = 0; i !== len; i++, i >>>= zero) {
		token = tokens[i];
		if (state === zero) {
			switch (token) {
				case "\n":
				case ";":
					lineCount++, lineCount >>>= zero;
					break;
				case "SET":
					state = one;
					array.push(zero);
					break;
				case "COM":
					state = three;
					break;
				default:
					throw new SyntaxError("Unexpected token '" + token + "'");
			}
		} else if (state === one) {
			if (substate === zero) {
				array.push(...compress(token, true), zero);
				substate = one;
			} else if (substate === one) {
				if (token[0] !== "[" || token[token.length - one] !== "]") {
					throw new SyntaxError("The type has to be bracketed to signify that '" + token + "' is a proper type.")
				}
				const indext = typeOrder[token.slice(one, -1)];
				if (indext === undefined) {
					throw new TypeError(token + " is not a valid type. The current types available are [UINT8], [UINT16], [INT8], [UFLOAT16], [UTF8STRING], and [UTF16STRING].")
				}
				array.push(indext);
				substate = (indext + two + (indext === four ? two : zero)) >>> zero;
			} else if (substate === two || substate === four) {
				array.push(Math.max(substate === two ? zero : note, Math.min(+token + (substate === two ? zero : ote), tff)) >>> zero);
				substate = zero;
				state = zero;
			} else if (substate === three) {
				const val = Math.max(Math.min(tff, +token), zero);
				array.push((val % tfs) >>> zero, val >> eight);
				substate = zero;
				state = zero;
			} else if (substate === five) {
				// Make sure the values don't have any precision errors (TODO: update to make this more efficient later)
				let value = Math.max(Math.min(+token, tff), zero);
				let decimal = ((value % one) * tfs) >>> zero;
				value = value >>> zero;
				array.push(value, decimal);
				substate = zero;
				state = zero;
			} else if (substate === six) {
				const dec = token.slice(one, -1);
				const len = dec.length;
				let char = 0, end = true;
				if (valuePassed) {
					let i = zero;
					for (;i < len; i++, i >>>= zero) {
						char = (dec[i] === back ? stringEsc[dec[i++ + 1]] : dec.charCodeAt(i)) >>> 0;
						if (char > tff) throw new TypeError("Found a character outside of the UTF8 range: '" + dec[i] + "'. If you need to use a character outside of the UTF8 range, please use the [UTF16STRING] type.");
						if (char === zero) {
							console.warn("Ending the string using a nullish character is NOT recommended! You should use the end of the string literal instead!");
							array.push(char);
							end = false;
							break;
						}
						array.push(char);
					}
				} else {
					let i = zero;
					for (;i < len; i++, i >>>= zero) {
						char = (dec[i] === back ? 65536 : dec.charCodeAt(i)) >>> 0;
						if (char === 65536) {
							if (isNaN(+dec[i + one])) {
								console.warn("An empty backslash can be removed from the string entirely, since there is no character to represent without the integer after the backslash.");
							} else {
								i++;
								let code, ov = true;
								while (true) {
									if (isNaN(+dec[i])) break;
									code += dec[i];
									i++;
								}
								char = +code;
								i--;
							}
						}
						if (char > tff) throw new TypeError("Found a character outside of the UTF8 range: '" + dec[i] + "'. If you need to use a character outside of the UTF8 range, please use the [UTF16STRING] type.");
						if (char === zero) {
							console.warn("Ending the string using a nullish character is NOT recommended! You should use the end of the string literal instead!");
							c.push(char);
							end = false;
							break;
						}
						array.push(char);
					}
				}
				if (end) array.push(zero);
				state = zero;
				substate = zero;
			} else if (substate === eight) {
				const b = token !== "TRUE";
				if (b && token !== "FALSE") throw new TypeError("If you want to know how to use [UTF16STRING] or [UTF8STRING], here is how you encountered this error:\nThe type would usually expect a setting that determines whether the string would allow backslash characters on numbers (e.g. \\0, \\1, etc.), and that setting can be rerpesented as either 'TRUE', or 'FALSE', without single quotes, respectively. And lastly\n\nUnexpected token '" + token + "'");
				valuePassed = b;
				substate -= two;
			}
		} else if (state === three) {
			if (token === "\n") {
				state = zero;
				lineCount++;
			}
		}
	}
	if (state !== zero || substate !== zero) {
		throw new SyntaxError("Unexpected end of program");
	}
	const uin = new Uint8Array(array);
	if (ret === "arraybuffer") {
		return uin.buffer;
	} else if (ret === "array") {
		return array;
	} else {
		return uin;
	}
}
