import dotenv from "dotenv"

type ConfigType = {
	db: string | undefined
	api: string | undefined
	port: number
	jwt: string | undefined
}

if (process.env.NODE_ENV === "production") {
	dotenv.config({ path: `${__dirname}/env/prod.env` })
} else {
	dotenv.config({ path: `${__dirname}/env/dev.env` })
}

const config: ConfigType = {
	db: process.env.DB,
	api: process.env.API,
	port: parseInt(process.env.PORT ?? "5000", 10),
	jwt: process.env.JWT,
}

export default config
