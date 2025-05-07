import geoip from "geoip-lite";
import net from "net";

// In-memory cache to reduce database lookups
const geoCache = {};

const lookupIpLocation = async (req, res) => {
	const { ip } = req.params;

	// Check for invalid IP format
	if (!ip || !isValidIpAddress(ip)) {
		const error = new Error("Invalid IP address format");
		error.status = 400;
		error.details = "Please provide a valid IPv4 or IPv6 address";
		throw error;
	}

	// Return cached data if available
	if (geoCache[ip]) {
		return res.json(geoCache[ip]);
	}

	// Look up IP data
	const geoData = geoip.lookup(ip);

	// Determine IP version
	const ipVersion = net.isIP(ip) === 4 ? "IPv4" : "IPv6";

	// Create result object with more friendly structure
	const result = geoData
		? {
				ip,
				ipVersion,
				country: geoData.country,
				countryCode: geoData.country,
				region: geoData.region,
				city: geoData.city,
				timezone: geoData.timezone,
				location: {
					latitude: geoData.ll[0],
					longitude: geoData.ll[1],
				},
				range: geoData.range,
				eu: geoData.eu,
				area: geoData.area,
				metro: geoData.metro,
				accuracy: geoData.accuracy,
			}
		: {
				ip,
				ipVersion,
				error: "Location not found",
			};

	// Cache the result
	geoCache[ip] = result;

	return res.json(result);
};

// Validate IP address using Node's built-in net module
function isValidIpAddress(ip) {
	return net.isIP(ip) !== 0;
}

export { lookupIpLocation };
