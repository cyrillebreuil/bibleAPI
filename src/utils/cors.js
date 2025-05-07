export const corsOptions = {
	origin: process.env.FRONT_URL || "http://localhost:5173",
	methods: "GET, POST, DELETE",
	credentials: true,
};
