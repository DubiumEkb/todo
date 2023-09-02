import fs from "node:fs"
import http from "node:http"
import morgan from "morgan"
import finalhandler from "finalhandler"
import path from "node:path"
import config from "./config"
const accessLogStream = fs.createWriteStream(path.join(__dirname, "logs", "access.log"), { flags: "a" })
const logger = morgan("combined", { stream: accessLogStream })

const server = http.createServer((request, response) => {
	// Begin - CORS
	response.setHeader("Access-Control-Allow-Origin", "*")
	response.setHeader("Access-Control-Allow-Methods", "OPTIONS, GET, POST, PATCH, DELETE")
	response.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization")

	// End - CORS

	const done = finalhandler(request, response)
	logger(request, response, (error) => {
		if (error) {
			response.statusCode = 500
			response.setHeader("Content-Type", "application/json")
			response.end(JSON.stringify({ success: false, message: `${http.STATUS_CODES[500]}` }))
			return done(error)
		} else {
			if (request.url === "/" && request.method === "GET") {
				response.statusCode = 200
				response.setHeader("Content-Type", "application/json")
				response.end(
					JSON.stringify({
						success: true,
						message: `${http.STATUS_CODES[200]}`,
					}),
				)
			} else {
				response.statusCode = 404
				response.setHeader("Content-Type", "application/json")
				response.end(
					JSON.stringify({
						success: false,
						message: `${http.STATUS_CODES[404]}`,
					}),
				)
			}
		}
	})
})

const start = async () => {
	try {
		server.listen(config.port, () => {
			console.log(`Start server: ${config.port}`)
		})
	} catch (error) {
		console.log(error)
	}
}

start()
