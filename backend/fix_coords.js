const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'data', 'routes.json');
let rawdata = fs.readFileSync(filePath);
let routes = JSON.parse(rawdata);

let numModified = 0;

routes.forEach(route => {
    // Check start point
    if (route.startPoint && route.startPoint.name === 'ITER') {
        route.startPoint.coordinates = {"lat": 20.249600, "lng": 85.797200};
        numModified++;
    }
    // Check end point
    if (route.endPoint && route.endPoint.name === 'ITER') {
        route.endPoint.coordinates = {"lat": 20.249600, "lng": 85.797200};
        numModified++;
    }
    // Check stoppages array
    if (route.stoppages && Array.isArray(route.stoppages)) {
        route.stoppages.forEach(stop => {
            if (stop.name === 'ITER') {
                stop.coordinates = {"lat": 20.249600, "lng": 85.797200};
                numModified++;
            }
        });
    }
});

fs.writeFileSync(filePath, JSON.stringify(routes, null, 2));
console.log(`Successfully fixed ${numModified} coordinate references!`);
