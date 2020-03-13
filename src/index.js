var features = require("../tests/fixtures/roads.json").features;
var features = require("../tests/fixtures/vancouver-blocks.json").features;

function featuresToArrays({ features }) {
  const points = {
    positions: [],
    objectIds: []
  };
  const lines = {
    pathIndices: [0],
    positions: [],
    objectIds: []
  };
  const polygons = {
    polygonIndices: [0],
    primitivePolygonIndices: [0],
    positions: [],
    objectIds: []
  };

  let featureCounter = 0;

  for (const feature of features) {
    const geometry = feature.geometry;

    if (geometry.type === "Point") {
      points.objectIds.push(featureCounter);
      points.positions.push(...geometry.coordinates);
    } else if (geometry.type === "MultiPoint") {
      points.objectIds.push(featureCounter);
      points.positions.push(...geometry.coordinates.flat());
    } else if (geometry.type === "LineString") {
      lines.objectIds.push(featureCounter);
      const index = lines.positions.push(...geometry.coordinates.flat());
      lines.pathIndices.push(index);
    } else if (geometry.type === "MultiLineString") {
      lines.objectIds.push(featureCounter);
      for (const line of geometry.coordinates) {
        const index = lines.positions.push(...line.flat());
        lines.pathIndices.push(index);
      }
    } else if (geometry.type === "Polygon") {
      polygons.objectIds.push(featureCounter);

      let linearRingCounter = 0;
      for (const linearRing of geometry.coordinates) {
        const index = polygons.positions.push(...linearRing.flat());
        polygons.primitivePolygonIndices.push(index);
        if (linearRingCounter === 0) polygons.polygonIndices.push(index);
        linearRingCounter++;
      }
    } else if (geometry.type === "MultiPolygon") {
      polygons.objectIds.push(featureCounter);

      for (const polygon of geometry.coordinates) {
        let linearRingCounter = 0;
        for (const linearRing of polygon) {
          const index = polygons.positions.push(...linearRing.flat());
          polygons.primitivePolygonIndices.push(index);
          if (linearRingCounter === 0) polygons.polygonIndices.push(index);
          linearRingCounter++;
        }
      }
    }

    featureCounter++;
  }

  return {
    points: {
      positions: Float32Array.from(points.positions),
      objectIds: Uint32Array.from(points.objectIds)
    },
    lines: {
      pathIndices: Uint32Array.from(lines.pathIndices),
      positions: Float32Array.from(lines.positions),
      objectIds: Uint32Array.from(lines.objectIds)
    },
    polygons: {
      polygonIndices: Uint32Array.from(polygons.polygonIndices),
      primitivePolygonIndices: Uint32Array.from(
        polygons.primitivePolygonIndices
      ),
      positions: Float32Array.from(polygons.positions),
      objectIds: Uint32Array.from(polygons.objectIds)
    }
  };
}
