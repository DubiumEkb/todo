import dotenv from "dotenv"
import configure from "./configure.json"

type ConfigType = {
	db: string | undefined
	api: string | undefined
	port: number
	jwt: string | undefined
}

if (process.env.NODE_ENV === "production") {
	dotenv.config({ path: `${__dirname}/env/production.env` })
} else {
	dotenv.config({ path: `${__dirname}/env/development.env` })
}

export { configure }
export const config = {
	db: process.env.DB,
	api: process.env.API,
	port: parseInt(process.env.PORT ?? "5000", 10),
	jwt: process.env.JWT,
}
