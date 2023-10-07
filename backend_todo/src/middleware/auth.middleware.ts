import { NextFunction, Request, Response } from "express"
import jwt, { JwtPayload } from "jsonwebtoken"

import { config } from "../config"

export interface DecodedToken extends JwtPayload {
	_id: string
}

export class AuthMiddleware {
	static async check(request: Request, response: Response, next: NextFunction) {
		try {
			if (!config.jwt) {
				return response.status(500).json({ success: false, message: "Токен JWT не найден в конфигурации" })
			}

			const token = (request.headers.authorization || "").replace(/Bearer\s?/, "")

			if (!token) {
				return response.status(401).json({ success: false, message: "Необходимо предоставить токен." })
			}

			const decodedToken = jwt.decode(token) as JwtPayload

			if (decodedToken?.exp && Math.floor(Date.now() / 1000) > decodedToken.exp) {
				return response.status(401).json({ success: false, message: "Токен протух." })
			}

			const decoded = (await jwt.verify(token, config.jwt, { algorithms: ["HS256"] })) as DecodedToken

			response.locals.userId = decoded._id

			next()
		} catch (error) {
			response.status(401).json({ success: false, message: "Неверный токен." })
			return next(error)
		}
	}
}
