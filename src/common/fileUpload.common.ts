import * as multer from "multer";
import * as path from "path";
import * as fs from "fs";
import * as tj from "@tmcw/togeojson";
import { JSDOM } from "jsdom";
import { bbox } from "@turf/bbox";

export const deleteFile = (filePath: string) => {
  try {
    fs.unlinkSync(filePath);
  } catch (err) {
    console.error(err);
  }
};

export const readFile = async (filePath: string) => {
  try {
    return fs.promises.readFile(filePath, "utf8");
  } catch (err) {
    console.error(err);
    return "null"; // add a return statement here
  }
};

export const getFileExtension = (filename: string) => {
  return path.extname(filename).toLowerCase();
};

export const getMulterConfig = (
  extensionNames: string[],
  pathUpload: string,
) => {
  const storage = multer.diskStorage({
    destination: (_req, _file, cb) => {
      if (!fs.existsSync(pathUpload)) {
        fs.mkdirSync(pathUpload, { recursive: true });
      }
      cb(null, pathUpload);
    },
    filename: (_req, file, cb) => {
      const timestamp = Date.now();
      const fileName = `${timestamp}-${file.originalname}`;
      cb(null, fileName);
    },
  });

  return {
    storage: storage,
    fileFilter: (_req, file, cb) => {
      const extname = path.extname(file.originalname).toLowerCase();
      if (extensionNames.length > 0 && !extensionNames.includes(extname)) {
        console.log(
          `[upload-file] REJECTED -> ${file.originalname} | ext: "${extname}" | allowed: ${extensionNames.join(",")} | mimetype: ${file.mimetype}`,
        );
        cb(new Error("Invalid file type"), false);
      } else {
        console.log(
          `[upload-file] fileFilter ok -> ${file.originalname} | ext: "${extname}" | mimetype: ${file.mimetype}`,
        );
        cb(null, true);
      }
    },
  };
};
export function convertGeoJSONToCSV(geoJsonData) {
  // Read the GeoJSON file
  const features = geoJsonData.features;
  // Prepare CSV header
  const csvRows = ["SEGMENT ID,LINES"];
  const features_count = features.length.toString().length;
  // Process each feature
  features.forEach((feature, index) => {
    const segmentId = `SEG-${(index + 1).toString().padStart(features_count, "0")}`;
    const geometry = feature.geometry;
    const lines = [];
    if (geometry.type === "LineString") {
      // Single LineString case
      lines.push(formatCoordinates(geometry.coordinates));
    } else if (geometry.type === "MultiLineString") {
      // Multiple LineStrings in GeometryCollection
      geometry.coordinates.forEach((subGeometry) => {
        lines.push(formatCoordinates(subGeometry));
      });
    } else if (geometry.type === "GeometryCollection") {
      // Multiple LineStrings in GeometryCollection
      geometry.geometries.forEach((subGeometry) => {
        lines.push(formatCoordinates(subGeometry.coordinates));
      });
    }
    // Ensure multiple lines are formatted as separate lists
    const linesString = lines.map((line) => `[[${line.join(" ")}]]`).join("");
    csvRows.push(`"${segmentId}","${linesString}"`);
  });
  // Save the CSV file

  const csvData = csvRows.join("\n");
  return csvData;
}
function formatCoordinates(coordinates) {
  return coordinates.map(([lon, lat]) => `${lon},${lat}`);
}
function flattenGeoJSON(geojson) {
  const newFeatures = [];

  geojson.features.forEach((feature) => {
    if (feature.geometry.type === "GeometryCollection") {
      feature.geometry.geometries.forEach((geometry) => {
        newFeatures.push({
          type: "Feature",

          properties: { ...feature.properties },

          geometry: geometry,
        });
      });
    } else {
      newFeatures.push(feature);
    }
  });

  return {
    type: "FeatureCollection",

    features: newFeatures,
  };
}

export const convertKmlToGeoJson = (kmlData: any) => {
  try {
    const dom = new JSDOM(kmlData, { contentType: "text/xml" });
    const kml = dom.window.document;
    const geoJson = tj.kml(kml);
    const [minLng, minLat, maxLng, maxLat] = bbox(geoJson);
    const updatedGeoJson = flattenGeoJSON(geoJson);
    return {
      boundingBox: `${minLat},${maxLat},${minLng},${maxLng}`,
      kmlGeoJson: JSON.stringify(updatedGeoJson, null, 2),
    };
  } catch (error) {
    throw new Error(`Error converting KML to GeoJSON: ${error.message}`);
  }
};

export const changeFileExtension = (fileName: string, newExtension: string) => {
  // Ensure the new extension starts with a dot
  if (!newExtension.startsWith(".")) {
    newExtension = "." + newExtension;
  }

  // Return the file name with the new extension
  // Get the file name without the extension
  const baseName = path.parse(fileName).name;

  // Return the file name with the new extension
  return baseName + newExtension;
};
