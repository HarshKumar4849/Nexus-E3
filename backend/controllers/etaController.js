const Stop = require('../models/stop');
const { getRouteInfo } = require('../utils/osrmHelper');

/**
 * Calculates ETA between two stops.
 */
const calculateETA = async (req, res) => {
  try {
    const { startStopId, endStopId } = req.params;

    const startStop = await Stop.findById(startStopId);
    const endStop = await Stop.findById(endStopId);

    if (!startStop || !endStop) {
      return res.status(404).json({ message: 'One or both stops not found' });
    }

    if (!startStop.latitude || !startStop.longitude || !endStop.latitude || !endStop.longitude) {
      return res.status(400).json({ message: 'Coordinates missing for one or both stops' });
    }

    const routeInfo = await getRouteInfo(
      { lat: startStop.latitude, lng: startStop.longitude },
      { lat: endStop.latitude, lng: endStop.longitude }
    );

    res.status(200).json({
      startStop: startStop.name,
      endStop: endStop.name,
      distance: (routeInfo.distance / 1000).toFixed(2) + ' km',
      duration: (routeInfo.duration / 60).toFixed(2) + ' mins',
      raw: routeInfo
    });
  } catch (error) {
    console.error('ETA Calculation Error:', error.message);
    res.status(500).json({ message: 'Internal server error during ETA calculation', error: error.message });
  }
};

module.exports = { calculateETA };
