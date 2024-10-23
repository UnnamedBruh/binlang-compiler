document.getElementById("compile").addEventListener("click", () => {
	const program = BINLangCompiledNew(document.getElementById("program").value, "arraybuffer")
	const blob = new Blob([program], {type: "application/octet-stream"})
	const bu = URL.createObjectURL(blob)
	const a = document.createElement("a")
	a.href = bu
	a.download = "result.binl"
	a.click()
	a.remove()
	URL.revokeObjectURL(bu)
})
