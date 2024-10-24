const BINLangCompilerNew = (function() {
const regex = /\[[A-Z0-9]+\]|"([^"\n\\]|\\([0-9]+|[^ 0-9\n\t]))*"|[a-zA-Z_]+|-?[0-9]+(\.[0-9]*)?|[\n;](?:[\n;]*)|[^ \t]/gms, reg2 = /CHAR/, zero = 0 >>> 0
const one = 1 >>> zero, two = 2 >>> zero, three = 3 >>> zero, four = 4 >>> zero, five = 5 >>> zero, six = 6 >>> zero, seven = 7 >>> zero, eight = 8 >>> zero, nine = 9 >>> zero, ten = 10 >>> zero, tff = 255 >>> zero, tfs = 256 >>> zero, note = -128, ote = 128 >>> zero, st = 65536 >>> zero, no = -1;
const typeOrder = {"UINT8":zero,"UINT16":one,"INT8":two,"UFLOAT16":three,"UTF8STRING":four,"BOOLEAN":eight}, stringEsc = {"n":ten,"t":nine,"\\":92>>>zero}, back = "\\", msgWarn = {"0": "Ending the string using a nullish character is NOT recommended! You should use the end of the string literal instead!", "65536": "This character (CHAR) cannot be escaped yet. Since this issue occurred, the unexpected escape sequence will be replaced with a null character to terminate the string."},
integ = {"STANDARD":zero,"INTEGER":one,"NONE":two}, lb = "[", rb = "]", newl = "\n", eco = "ECOM", trst = "TRUE", fast = "FALSE", blank = "\"\"";
return function(code, ret = "arraybuffer") {
	const array = [one], tokens = code.match(regex);
	const len = tokens.length >>> zero;
	let state = zero, token, lineCount = zero, identifiers = {}, amountOfIdentifiers = zero, substate = zero, valuePassed;
	function compress(ident, newi = false) {
		if (identifiers[ident]) return identifiers[ident];
		const ea = ((amountOfIdentifiers >> eight) + one) >>> zero, array = [];
		let id = amountOfIdentifiers;
		for (let i = zero; i !== ea; i++, i >>>= zero) {
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
	for (;i !== len; i++, i >>>= zero) {
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
				case "MCOM":
					state = two;
					break;
				case undefined:
					// Somehow, somewhere, a weird thing happened.
					i = (len - one) >>> zero;
					break;
				default:
					throw new SyntaxError("Unexpected token '" + token + "'");
			}
		} else if (state === one) {
			if (substate === zero) {
				array.push(...compress(token, true), zero);
				substate = one;
			} else if (substate === one) {
				if (token[zero] !== lb || token[token.length - one] !== rb) {
					throw new SyntaxError("The type has to be bracketed to signify that '" + token + "' is a proper type.")
				}
				const indext = typeOrder[token.slice(one, no)];
				if (indext === undefined) {
					throw new TypeError(token + " is not a valid type. The current types available are [UINT8], [UINT16], [INT8], [UFLOAT16], [UTF8STRING], and [BOOLEAN].")
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
				if (token === blank) {
					array.push(zero);
				} else {
					const dec = token.slice(one, no);
					const len = dec.length;
					let char = zero, end = true;
					if (valuePassed === zero) {
						let i = zero;
						for (;i < len; i++, i >>>= zero) {
							char = (dec[i] === back ? stringEsc[dec[i++ + one] || st] : dec.charCodeAt(i)) >>> zero;
							if (char > tff) throw new TypeError("Found a character outside of the UTF8 range: '" + dec[i] + "'. If you need to use a character outside of the UTF8 range, please use the [UTF16STRING] type.");
							if (char === zero || char === st) {
								console.warn(char === zero ? msgWarn[char] : msgWarn[char].replace(reg2, dec[i]));
								array.push(char);
								end = false;
								break;
							}
							array.push(char);
						}
					} else if (valuePassed === one) {
						let j = zero;
						for (;j !== len; j++, j >>>= zero) {
							char = (dec[j] === back ? st : dec.charCodeAt(j)) >>> zero;
							if (char === st) {
								if (isNaN(Number(dec[j + one]))) {
									console.warn("An empty escaper can be removed from the string entirely, since there is no character to represent");
								} else {
									j++;
									let code = "";
									// Using 'true', so the condition can be used in the loop. It's a bit unconventional, but I think it's worth it
									for (; true; j++, j >>>= zero) {
										if (isNaN(Number(dec[j]))) break;
										code += dec[j];
									}
									j--;
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
						for (let j = zero; j !== len; j++, j >>>= zero) {
							char = dec.charCodeAt(j) >>> zero;
							if (char > tff) throw new TypeError("Found a character outside of the UTF8 range: '" + dec[j] + "'. If you need to use a character outside of the UTF8 range, please use the [UTF16STRING] type.");
							array.push(char);
						}
					}
					if (end) array.push(zero);
				}
				state = zero;
				substate = zero;
			} else if (substate === eight) {
				const b = integ[token];
				if (b === undefined) throw new TypeError("If you want to know how to use [UTF16STRING] or [UTF8STRING], here is how you encountered this error:\nThe type would usually expect a setting that determines whether the string would allow backslash characters on numbers (e.g. \\0, \\1, etc.), and that setting can be rerpesented as either 'TRUE', or 'FALSE', without single quotes, respectively. And lastly\n\nUnexpected token '" + token + "'");
				valuePassed = b;
				substate -= two;
			} else if (substate === ten) {
				const b = token === trst;
				if (!b && token !== fast) {
					console.warn("Only two values (TRUE, FALSE) can be represented. The value that is represented was " + token + ". Defaulting to the FALSE boolean...");
					array.push(zero);
				} else {
					array.push(b >>> zero);
				}
				substate = zero;
				state = zero;
			}
		} else if (state === two) {
			while (token !== eco && i !== len) {
				token = tokens[i];
				i++;
			}
			state = zero;
			lineCount++, lineCount >>>= zero;
		} else if (state === three) {
			while (token[zero] !== newl && i !== len) {	
				token = tokens[i];
				i++;
			}
			state = zero;
			lineCount++, lineCount >>>= zero;
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
})();
