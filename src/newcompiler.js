const BINLangCompilerNew = function(code, ret = "arraybuffer") {
	const array = [1 >>> 0], tokens = code.match(/\[[A-Z0-9]+\]|"([^"\n\\]|\\([0-9]+|[^ 0-9\n\t]))+"|[a-zA-Z]+|-?[0-9]+(\.[0-9]*)?|[\n;](?:[\n;]*)|[^ \t]/gms);
	const len = tokens.length >>> 0, zero = 0 >>> 0, one = 1 >>> 0, two = 2 >>> 0, three = 3 >>> 0, four = 4 >>> 0, five = 5 >>> 0, six = 6 >>> 0, seven = 7 >>> 0, eight = 8 >>> 0, nine = 9 >>> 0, ten = 10 >>> 0, tff = 255 >>> 0, tfs = 256 >>> 0, note = -128, ote = 128 >>> 0;
	const typeOrder = {"UINT8":zero,"UINT16":one,"INT8":two,"UFLOAT16":three,"UTF8STRING":four,"BOOLEAN":ten}, stringEsc = {"n":ten,"t":nine,"\\":92>>>zero}, back = "\\", msgWarn = {"0": "Ending the string using a nullish character is NOT recommended! You should use the end of the string literal instead!", "65536": "This character (CHAR) cannot be escaped yet. Since this issue occurred, the unexpected escape sequence will be replaced with a null character to terminate the string."},
		integ = {"STANDARD":zero,"INTEGER":one,"NONE":two};
	let state = zero, token, lineCount = zero, identifiers = {}, amountOfIdentifiers = zero, substate = zero, valuePassed;
	function compress(ident, newi = false) {
		if (identifiers[ident]) return identifiers[ident];
		const ea = ((amountOfIdentifiers >> eight) + one) >>> zero, array = [];
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
	let i = zero;
	function debug() {
		console.log(token, state, substate)
	}
	for (;i !== len; i++, i >>>= zero) {
		token = tokens[i];
		debug()
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
				case "MCOM":
					state = two;
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
					throw new TypeError(token + " is not a valid type. The current types available are [UINT8], [UINT16], [INT8], [UFLOAT16], [UTF8STRING], [UTF16STRING], and [BOOLEAN].")
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
				if (valuePassed === 0) {
					let i = zero;
					for (;i < len; i++, i >>>= zero) {
						char = (dec[i] === back ? stringEsc[dec[i++ + one] || 65536] : dec.charCodeAt(i)) >>> zero;
						if (char > tff) throw new TypeError("Found a character outside of the UTF8 range: '" + dec[i] + "'. If you need to use a character outside of the UTF8 range, please use the [UTF16STRING] type.");
						if (char === zero || char === 65536) {
							console.warn(char === zero ? msgWarn[char] : msgWarn[char].replace(/CHAR/, dec[i]));
							array.push(char);
							end = false;
							break;
						}
						array.push(char);
					}
				} else if (valuePassed === 1) {
					let j = zero;
					for (;j < len; j++, j >>>= zero) {
						char = (dec[j] === back ? 65536 : dec.charCodeAt(j)) >>> 0;
						if (char === 65536) {
							if (isNaN(Number(dec[j + 1]))) {
								console.warn("An empty escaper can be removed from the string entirely, since there is no character to represent");
							} else {
								j++;
								let code = "";
								// Using 'true', so the condition can be used in the loop. It's a bit unconventional, but I think it's worth it
								for (; true; j++, j >>>= zero) {
									if (isNaN(Number(dec[j]))) break;
									code += dec[j];
								}
								i--;
								char = Number(code);
							}
						}
						if (char > tff && dec[j] !== back) throw new TypeError("Found a character outside of the UTF8 range: '" + dec[j] + "'. If you need to use a character outside of the UTF8 range, please use the [UTF16STRING] type.");
						if (char === zero) {
							console.warn("Ending the string using a nullish character in the literal is NOT recommended! You should use the end of the string literal instead!");
							array.push(char);
							end = false;
							break;
						}
						array.push(char);
					}
				} else {
					for (let j = zero; j < len; j++, j >>>= zero) {
						char = dec.charCodeAt(j) >>> 0;
						if (char > tff) throw new TypeError("Found a character outside of the UTF8 range: '" + dec[j] + "'. If you need to use a character outside of the UTF8 range, please use the [UTF16STRING] type.");
						array.push(char);
					}
				}
				if (end) array.push(zero);
				state = zero;
				substate = zero;
			} else if (substate === eight) {
				const b = integ[token];
				if (b === undefined) throw new TypeError("If you want to know how to use [UTF16STRING] or [UTF8STRING], here is how you encountered this error:\nThe type would usually expect a setting that determines whether the string would allow backslash characters on numbers (e.g. \\0, \\1, etc.), and that setting can be rerpesented as either 'TRUE', or 'FALSE', without single quotes, respectively. And lastly\n\nUnexpected token '" + token + "'");
				valuePassed = b;
				substate -= two;
			} else if (substate === ten) {
				const b = token === "TRUE";
				if (!b && token !== "FALSE") {
					console.warn("Only two values (TRUE, FALSE) can be represented. The value that is represented was " + token + ". Defaulting to the FALSE boolean...");
					array.push(zero);
				} else {
					array.push(b >>> zero);
				}
				substate = zero;
				state = zero;
			}
		} else if (state === two) {
			while (token !== "ECOM" && i !== len) {
				token = tokens[i];
				debug()
				i++;
			}
			state = zero;
			lineCount++, lineCount >>>= 0;
		} else if (state === three) {
			while (token[0] !== "\n" && i !== len) {	
				token = tokens[i];
				debug()
				i++;
			}
			state = zero;
			lineCount++, lineCount >>>= 0;
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
