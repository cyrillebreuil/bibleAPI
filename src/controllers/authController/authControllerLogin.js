import jwt from "jsonwebtoken";
import { User } from "../../models/Associations.js"; // Correction du chemin et de l'import

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"; // À mettre en variable d'environnement

const auth = async (req, res) => {
	const { username, password } = req.body;

	// Rechercher l'utilisateur dans la base de données
	const user = await User.findOne({ where: { username } });

	if (!user) {
		return res
			.status(404)
			.json({ success: false, message: "User Not Found" });
	}

	// Vérifier le mot de passe directement sans bcrypt
	const isPasswordValid = password === user.password;
	if (!isPasswordValid) {
		return res
			.status(401)
			.json({ success: false, message: "Incorrect Password" });
	}

	// Générer un token JWT valide 7 jours
	const token = jwt.sign(
		{ id: user.id, username: user.username, role: user.role },
		JWT_SECRET,
		{ expiresIn: "7d" },
	);

	return res.status(200).json({
		success: true,
		token,
		user: { id: user.id, username: user.username, role: user.role },
	});
};

export { auth };
