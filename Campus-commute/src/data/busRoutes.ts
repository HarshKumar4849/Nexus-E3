export const busRoutes = [
  {
    "busNumber": "CUTTACK-1-A",
    "busName": "CUTTACK - 1 (A)",
    "routeName": "CUTTACK - 1 (A) Morning Route",
    "startPoint": {
      "name": "TRISULIA",
      "coordinates": { "lat": 20.431078, "lng": 85.833733 }
    },
    "stoppages": [
      { "name": "TRISULIA", "coordinates": { "lat": 20.431078, "lng": 85.833733 }, "sequenceOrder": 0, "arrivalTime": null },
      { "name": "CDA NAIBANDHA TO CDA BIJUPATTNAIK PARK", "coordinates": { "lat": 20.472141, "lng": 85.839427 }, "sequenceOrder": 1, "arrivalTime": null },
      { "name": "BIJUPATTNAIK PARK", "coordinates": { "lat": 20.482959, "lng": 85.813846 }, "sequenceOrder": 2, "arrivalTime": null },
      { "name": "DANIBARA SQR", "coordinates": { "lat": 20.475799, "lng": 85.821243 }, "sequenceOrder": 3, "arrivalTime": null },
      { "name": "JUSTIC SQR", "coordinates": { "lat": 20.465297, "lng": 85.859848 }, "sequenceOrder": 4, "arrivalTime": null },
      { "name": "ITER", "coordinates": { "lat": 20.352000, "lng": 85.817000 }, "sequenceOrder": 27, "arrivalTime": "07:45 AM" }
    ],
    "endPoint": {
      "name": "ITER",
      "coordinates": { "lat": 20.352000, "lng": 85.817000 }
    },
    "classTime": "08:00 AM TO 1:00 PM",
    "arrivalBus": "OD 02 BE 4144",
    "drivers": [],
    "isActive": true,
    "remarks": "ARRIVAL AT ITER 07:45AM, DEPARTURE FROM ITER 1:15PM"
  },
  {
    "busNumber": "PATIA-1-A",
    "busName": "PATIA 1 (A)",
    "routeName": "PATIA 1 (A) Morning Route",
    "startPoint": {
      "name": "DASH PUR",
      "coordinates": { "lat": 20.337346, "lng": 85.802718 }
    },
    "stoppages": [
      { "name": "DASH PUR", "coordinates": { "lat": 20.337346, "lng": 85.802718 }, "sequenceOrder": 0, "arrivalTime": null },
      { "name": "CHANDAKA", "coordinates": { "lat": 20.3314, "lng": 85.8038 }, "sequenceOrder": 1, "arrivalTime": null },
      { "name": "SIKHARCHANDI", "coordinates": { "lat": 20.3362, "lng": 85.8174 }, "sequenceOrder": 2, "arrivalTime": null },
      { "name": "RAGHUNATH PUR", "coordinates": { "lat": 20.3329, "lng": 85.8297 }, "sequenceOrder": 3, "arrivalTime": null },
      { "name": "STUVART SCHOOL", "coordinates": { "lat": 20.2769, "lng": 85.8739 }, "sequenceOrder": 17, "arrivalTime": null }
    ],
    "endPoint": {
      "name": "STUVART SCHOOL",
      "coordinates": { "lat": 20.2769, "lng": 85.8739 }
    },
    "classTime": "08:00 AM TO 1:00 PM",
    "arrivalBus": "OD 02 CX 3983",
    "drivers": [],
    "isActive": true,
    "remarks": null
  },
  {
    "busNumber": "UTARA-1-A",
    "busName": "UTARA 1 (A)",
    "routeName": "UTARA 1 (A) Morning Route",
    "startPoint": {
      "name": "GUDIA POKHARI",
      "coordinates": { "lat": 20.166697, "lng": 85.856354 }
    },
    "stoppages": [
      { "name": "GUDIA POKHARI", "coordinates": { "lat": 20.166697, "lng": 85.856354 }, "sequenceOrder": 0, "arrivalTime": "6:10 AM" },
      { "name": "UTTARA", "coordinates": { "lat": 20.196864, "lng": 85.859598 }, "sequenceOrder": 1, "arrivalTime": "6:15 AM" },
      { "name": "DHAULI CHHAKA", "coordinates": { "lat": 20.196864, "lng": 85.859598 }, "sequenceOrder": 2, "arrivalTime": "6:15 AM" },
      { "name": "ITER", "coordinates": { "lat": 20.352000, "lng": 85.817000 }, "sequenceOrder": 26, "arrivalTime": null }
    ],
    "endPoint": {
      "name": "ITER",
      "coordinates": { "lat": 20.352000, "lng": 85.817000 }
    },
    "classTime": "08:00 AM TO 1:00 PM",
    "arrivalBus": "OR 02 BZ 7144",
    "drivers": [
      { "name": "BENUDHAR MARTHA", "contact": "9438847419" },
      { "name": "PRASANNA SETHY", "contact": "9438661579" }
    ],
    "isActive": true,
    "remarks": "ARRIVAL AT ITER 07:45AM, DEPARTURE FROM ITER 1:15PM"
  }
];

export type BusRoute = typeof busRoutes[0];
export type Stoppage = BusRoute["stoppages"][0];
