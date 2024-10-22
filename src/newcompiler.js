const BINLangCompilerNew = function(code, ret = "arraybuffer") {
	const array = [1], tokens = code.match(/\[[A-Z0-9]+\]|[a-zA-Z]+|[0-9]+(\.[0-9]*)?|\n|;/gm);
	const len = tokens.length >>> 0, zero = 0 >>> 0, one = 1 >>> 0, two = 2 >>> 0, three = 3 >>> 0, four = 4 >>> 0;
	let state = zero, token, lineCount = zero, identifiers = {}, amountOfIdentifiers, substate = zero;
	function compress(ident, newi = false) {
		if (identifiers[ident]) return identifiers[ident];
		const ea = Math.floor(amountOfIdentifiers / 256) >>> zero, array = [];
		let id = amountOfIdentifiers;
		for (let i = 0; i !== ea; i++, i >>>= zero) {
			array.push(Math.min(255, id));
			id -= 256;
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
		console.log(state, substate, tokens[i]);
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
				const type = token.slice(one, -1);
				const indext = ({"UINT8":zero,"UINT16":one,"INT8":two})[type];
				array.push(indext);
				substate = (indext + two) >>> zero;
			} else if (substate === two || substate === four) {
				array.push(Math.min(+token, 255) >>> zero);
				substate = zero;
				state = zero;
			} else if (substate === three) {
				const val = Math.min(+token, 65535);
				array.push((val % 256) >>> zero, val >> 8);
				substate = zero;
				state = zero;
			}
		} else if (state === three) {
			if (token === "\n" || token === ";") {
				state = zero;
				lineCount++;
			}
		}
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
