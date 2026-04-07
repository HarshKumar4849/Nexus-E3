const axios = require('axios');

/**
 * Fetches routing information from OSRM API.
 * 
 * @param {Object} start - { lat: Number, lng: Number }
 * @param {Object} end - { lat: Number, lng: Number }
 * @returns {Promise<Object>} - { distance: Number (meters), duration: Number (seconds) }
 */
const getRouteInfo = async (start, end) => {
  try {
    const url = `http://router.project-osrm.org/route/v1/driving/${start.lng},${start.lat};${end.lng},${end.lat}?overview=false`;
    const response = await axios.get(url);

    if (response.data && response.data.routes && response.data.routes.length > 0) {
      const route = response.data.routes[0];
      return {
        distance: route.distance, // in meters
        duration: route.duration  // in seconds
      };
    } else {
      throw new Error('No route found');
    }
  } catch (error) {
    console.error('OSRM API Error:', error.message);
    throw new Error('Failed to fetch routing data from OSRM');
  }
};

module.exports = { getRouteInfo };
