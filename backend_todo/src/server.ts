import http from "http"
import { config, configure } from "./config"

import log4js from "log4js"
import { routes } from "./routes"

log4js.configure(configure)
const logger = log4js.getLogger()

const server = http.createServer(async (request, response) => {
	try {
		// Begin - CORS
		response.setHeader("Access-Control-Allow-Origin", "*")
		response.setHeader("Access-Control-Allow-Methods", "OPTIONS, GET, POST, PATCH, DELETE")
		response.setHeader("Access-Control-Max-Age", 60 * 60 * 24 * 30)
		response.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization")
		// End - CORS

		// Begin - API
		await routes(request, response)
		// End - API
	} catch (error) {
		logger.error(error)
		response.statusCode = 500
		response.setHeader("Content-Type", "application/json")
		response.end(
			JSON.stringify({
				success: false,
				message: http.STATUS_CODES[500],
			}),
		)
	}
})

const serverStart = () => {
	server.listen(config.port, () => {
		logger.info(`Starting server on port: ${config.port}`)
	})
}

serverStart()
