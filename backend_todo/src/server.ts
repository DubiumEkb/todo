import express, { NextFunction, Request, Response } from "express"
import cors from "cors"
import csrf from "csurf"
import { config, configure } from "./config"
import cookieParser from "cookie-parser"
import log4js from "log4js"
import { Routes } from "./routes"
import { connect } from "mongoose"

// Конфигурация логгера Log4js
log4js.configure(configure)
const logger = log4js.getLogger()

const app = express()

// Используйте cors middleware перед вашими маршрутами
app.use(
	cors({
		credentials: true,
		methods: ["OPTIONS", "GET", "POST", "PATCH", "DELETE"],
		origin: config.clientUrl,
	}),
)

// Используйте middleware для работы с куками
app.use(cookieParser())

// Используйте csurf middleware после cookieParser, но до ваших маршрутов
app.use(csrf({ cookie: true }))

// Используйте express.json() для разбора JSON-запросов
app.use(express.json())

// Middleware для настройки заголовков ответа и CORS
app.use((request: Request, response: Response, next: NextFunction) => {
	response.setHeader("X-Frame-Options", "SAMEORIGIN")
	if (config.clientUrl) {
		response.setHeader("Access-Control-Allow-Origin", config.clientUrl)
	}
	response.setHeader("Access-Control-Allow-Methods", "OPTIONS, GET, POST, PATCH, DELETE")
	response.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization")
	response.setHeader("Access-Control-Allow-Credentials", "true")
	next()
})

// Обработка ваших маршрутов
app.use("/v1", Routes)

// Middleware для обработки 404 ошибки
app.use("*", (request: Request, response: Response) => {
	return response.status(404).send({ success: false, message: "Не найдено" })
})

// Запуск сервера
const startServer = async () => {
	try {
		// Подключение к базе данных MongoDB (используя mongoose)
		await connect(config.db || "")

		// Запуск HTTP-сервера
		const server = app.listen(config.port, () => {
			console.log(`⚡️[server]: Server is running at ${config.api}:${config.port}`)
		})

		// Обработка сигнала SIGTERM (например, при завершении работы Docker-контейнера)
		process.on("SIGTERM", () => {
			console.log("SIGTERM signal received: closing HTTP server")

			server.close(() => {
				console.log("HTTP server closed")
			})
		})
	} catch (error) {
		console.error(`Ошибка: ${error}`)
	}
}

// Запускаем сервер
startServer()
