export const corsOptions = {
	origin: process.env.FRONT_URL || "http://localhost:5173",
	methods: "GET",
	credentials: true,
};
