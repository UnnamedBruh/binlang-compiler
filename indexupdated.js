document.getElementById("compile").addEventListener("click", () => {
	const program = document.getElementById("program").value
	const time = performance.now()
	const program = BINLangCompilerNew(program, "arraybuffer")
	const t2 = performance.now()
	document.getElementById("timetook").textContent = "Time took: " + (t2 - time) + " ms"
	if (document.getElementById("downloadfile").checked) {
		const blob = new Blob([program], {type: "application/octet-stream"})
		const bu = URL.createObjectURL(blob)
		const a = document.createElement("a")
		a.href = bu
		a.download = "result.binl"
		a.click()
		a.remove()
		URL.revokeObjectURL(bu)
	}
})
