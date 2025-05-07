import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export const verifyAdmin = async (req, res, next) => {
	const authHeader = req.headers.authorization;

	if (!authHeader || !authHeader.startsWith("Bearer ")) {
		const error = new Error("Access denied. No token provided.");
		error.status = 401;
		throw error;
	}

	const token = authHeader.split(" ")[1];
	const decoded = jwt.verify(token, JWT_SECRET);

	req.user = decoded; // Ajoute les informations de l'utilisateur au `req`

	// Vérifier si l'utilisateur est un administrateur
	if (decoded.role !== "admin") {
		const error = new Error("Access denied. Admins only.");
		error.status = 403;
		throw error;
	}

	next();
};
