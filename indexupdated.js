document.getElementById("compile").addEventListener("click", () => {
	const time = performance.now()
	const program = BINLangCompilerNew(document.getElementById("program").value, "arraybuffer")
	const t2 = performance.now()
	document.getElementById("timetook").textContent = "Time took: " + (t2 - time) + " ms"
	const blob = new Blob([program], {type: "application/octet-stream"})
	const bu = URL.createObjectURL(blob)
	const a = document.createElement("a")
	a.href = bu
	a.download = "result.binl"
	a.click()
	a.remove()
	URL.revokeObjectURL(bu)
})
