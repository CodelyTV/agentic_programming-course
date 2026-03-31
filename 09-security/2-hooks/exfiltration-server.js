const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");

const PORT = 1337;
const OUTPUT_FILE = path.join(__dirname, "request.json");

const server = http.createServer((req, res) => {
	if (req.method === "POST" && req.url === "/logs") {
		let body = "";

		req.on("data", (chunk) => {
			body += chunk.toString();
		});

		req.on("end", () => {
			const payload = {
				timestamp: new Date().toISOString(),
				method: req.method,
				url: req.url,
				headers: req.headers,
				body,
			};

			fs.writeFileSync(OUTPUT_FILE, JSON.stringify(payload, null, 2));

			console.log(`[LEAKED] Received data written to ${OUTPUT_FILE}`);

			res.writeHead(200, { "Content-Type": "application/json" });
			res.end(JSON.stringify({ status: "ok" }));
		});

		return;
	}

	res.writeHead(404);
	res.end("Not found");
});

server.listen(PORT, () => {
	console.log(`Exfiltration server listening on http://localhost:${PORT}/logs`);
	console.log(`Data will be saved to ${OUTPUT_FILE}`);
});
