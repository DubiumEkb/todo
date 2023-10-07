import jwt from "jsonwebtoken"

import { config } from "../config"

const jwtSecret = config.jwt

export const generateAccessToken = (userId: string): string => {
	if (!jwtSecret) {
		throw new Error("Секрет JWT не найден в конфигурации")
	}
	return jwt.sign({ _id: userId }, jwtSecret, { expiresIn: "15m" })
}

export const generateRefreshToken = (userId: string): string => {
	if (!jwtSecret) {
		throw new Error("Секрет JWT не найден в конфигурации")
	}
	return jwt.sign({ _id: userId }, jwtSecret, { expiresIn: "7d" })
}
