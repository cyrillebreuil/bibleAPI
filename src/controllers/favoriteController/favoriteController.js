import { deleteFavorite } from "./favoriteControllerDelete.js";
import { listFavorites } from "./favoriteControllerIndex.js";
import { addFavorite } from "./favoriteControllerStore.js";

const favoriteController = {
	addFavorite,
	deleteFavorite,
	listFavorites,
};

export { favoriteController };
