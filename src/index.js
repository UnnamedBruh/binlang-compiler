// NAME: Unnamedbruh
// PLATFORM: GitHub
// PROFILE: https://github.com/apanentgithub2024
// LICENSE: MIT License
var BINLang = (function(code, o) {
	function compileIdentifier(id) {
		return new Uint8Array(id.split("").map(i => i.charCodeAt(0) - 65))
	}
	const reg = /(DEF|SET|UNL)\s+[a-zA-Z]*|[0-9]+/gm
	const array = [0], tokens = [...code.matchAll(reg).map(i => i.join(""))]
	let id = 0, c
	for (const token of tokens) {
		switch (id) {
			case 0:
				c = token.slice(0, 3)
				if (c === "DEF") {
					array.push(1)
					id = 1
				} else if (c === "SET") {
					array.push(2)
					id = 2
				} else if (c === "UNL") {
					array.push(3)
					id = 4
				} else {
					throw new SyntaxError("Unexpected token " + token)
				}
				break
			case 1:
				c = null
				if (token.length === 0) {
					throw new SyntaxError("Expected variable identifier after keyword 'DEF', got empty string")
				}
				array.push(0)
				const tok = compileIdentifier(token)
				array.push(...tok)
				array.push(255)
				array.push(0)
				id = 0
				break
			case 2:
				c = null
				if (token.length === 0) {
					throw new SyntaxError("Expected variable identifier after keyword 'SET', got empty string")
				}
				array.push(1)
				const tok2 = compileIdentifier(token)
				array.push(...tok2)
				array.push(255)
				array.push(1)
				id = 3
				break
			case 3:
				if (token.length === 0) {
					throw new SyntaxError("The 'SET' command must have an integer-based value")
				}
				c = Number(token)
				if (c > 255) {
					throw new TypeError("Integer values cannot exceed beyond 255 - for more info, 8 bits are used per integer type")
				}
				array.push(c)
				id = 0
				break
			case 4:
				c = null
				if (token.length === 0) {
					throw new SyntaxError("Expected variable identifier after keyword 'UNL', got empty string")
				}
				array.push(1)
				const tok2 = compileIdentifier(token)
				array.push(...tok2)
				array.push(255)
				array.push(1)
				id = 0
				break
		}
	}
	c = i = "collect this garbage"
	const arrbuffer = new ArrayBuffer(array.length)
	const uint = new Uint8Array(arrbuffer)
	uint.set(array)
	return o === "arraybuffer" || !o ? arrbuffer : uint
})
