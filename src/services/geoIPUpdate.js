import geoip from "geoip-lite";
import { ANSIIColors } from "../utils/colors.js";

class GeoIPUpdateService {
	constructor() {
		// Initial update when service starts
		this.updateGeoIPDB();

		// Schedule weekly updates (7 days in milliseconds = 7 * 24 * 60 * 60 * 1000)
		setInterval(
			() => {
				this.updateGeoIPDB();
			},
			7 * 24 * 60 * 60 * 1000,
		);
	}

	updateGeoIPDB() {
		try {
			console.log(
				`${ANSIIColors.cyan}Starting GeoIP database update...${ANSIIColors.reset}`,
			);

			geoip.reloadData(() => {
				console.log(
					`${ANSIIColors.green}GeoIP database updated successfully${ANSIIColors.reset}`,
				);
			});
		} catch (error) {
			console.error(
				`${ANSIIColors.red}Error updating GeoIP database:${ANSIIColors.reset}`,
				error,
			);
		}
	}
}

// Create and export a single instance
export const geoIPUpdateService = new GeoIPUpdateService();
