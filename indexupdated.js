const x = "arraybuffer", y = "result.binl";
document.getElementById("compile").addEventListener("click", () => {
	const h = document.getElementById("program").value || "";
	try {
		const a = performance.now();
		const p = BINLangCompilerNew(h, x);
		const b = performance.now();
		document.getElementById("timetook").textContent = "Time took: " + (b - a) + " ms";
		if (document.getElementById("downloadfile").checked) {
			const c = new Blob([p], {type: "application/octet-stream"});
			const d = URL.createObjectURL(c);
			const a = document.createElement("a");
			a.href = d;
			a.download = y;
			a.click();
			a.remove();
			URL.revokeObjectURL(d);
		}
	} catch (error) {
		alert(error.name + ": " + error.message);
	}
})
