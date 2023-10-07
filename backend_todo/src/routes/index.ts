export const routes = (request: any, response: any) => {
	if (request.url === "/") {
		if (request.method === "GET") {
			response.end("Welcome!")
		} else if (request.method === "POST") {
		} else if (request.method === "PATCH") {
		} else if (request.method === "DELETE") {
		}
	} else if (request.url === "/about") {
		if (request.method === "GET") {
			response.end("About!")
		}
	}

	console.log(request.method, request.url)
}
