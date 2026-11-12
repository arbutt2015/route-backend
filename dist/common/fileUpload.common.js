"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.changeFileExtension = exports.convertKmlToGeoJson = exports.getMulterConfig = exports.getFileExtension = exports.readFile = exports.deleteFile = void 0;
exports.convertGeoJSONToCSV = convertGeoJSONToCSV;
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const tj = require("@tmcw/togeojson");
const jsdom_1 = require("jsdom");
const bbox_1 = require("@turf/bbox");
const deleteFile = (filePath) => {
    try {
        fs.unlinkSync(filePath);
    }
    catch (err) {
        console.error(err);
    }
};
exports.deleteFile = deleteFile;
const readFile = async (filePath) => {
    try {
        return fs.promises.readFile(filePath, "utf8");
    }
    catch (err) {
        console.error(err);
        return "null";
    }
};
exports.readFile = readFile;
const getFileExtension = (filename) => {
    return path.extname(filename).toLowerCase();
};
exports.getFileExtension = getFileExtension;
const getMulterConfig = (extensionNames, pathUpload) => {
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
                console.log(`[upload-file] REJECTED -> ${file.originalname} | ext: "${extname}" | allowed: ${extensionNames.join(",")} | mimetype: ${file.mimetype}`);
                cb(new Error("Invalid file type"), false);
            }
            else {
                console.log(`[upload-file] fileFilter ok -> ${file.originalname} | ext: "${extname}" | mimetype: ${file.mimetype}`);
                cb(null, true);
            }
        },
    };
};
exports.getMulterConfig = getMulterConfig;
function convertGeoJSONToCSV(geoJsonData) {
    const features = geoJsonData.features;
    const csvRows = ["SEGMENT ID,LINES"];
    const features_count = features.length.toString().length;
    features.forEach((feature, index) => {
        const segmentId = `SEG-${(index + 1).toString().padStart(features_count, "0")}`;
        const geometry = feature.geometry;
        const lines = [];
        if (geometry.type === "LineString") {
            lines.push(formatCoordinates(geometry.coordinates));
        }
        else if (geometry.type === "MultiLineString") {
            geometry.coordinates.forEach((subGeometry) => {
                lines.push(formatCoordinates(subGeometry));
            });
        }
        else if (geometry.type === "GeometryCollection") {
            geometry.geometries.forEach((subGeometry) => {
                lines.push(formatCoordinates(subGeometry.coordinates));
            });
        }
        const linesString = lines.map((line) => `[[${line.join(" ")}]]`).join("");
        csvRows.push(`"${segmentId}","${linesString}"`);
    });
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
        }
        else {
            newFeatures.push(feature);
        }
    });
    return {
        type: "FeatureCollection",
        features: newFeatures,
    };
}
const convertKmlToGeoJson = (kmlData) => {
    try {
        const dom = new jsdom_1.JSDOM(kmlData, { contentType: "text/xml" });
        const kml = dom.window.document;
        const geoJson = tj.kml(kml);
        const [minLng, minLat, maxLng, maxLat] = (0, bbox_1.bbox)(geoJson);
        const updatedGeoJson = flattenGeoJSON(geoJson);
        return {
            boundingBox: `${minLat},${maxLat},${minLng},${maxLng}`,
            kmlGeoJson: JSON.stringify(updatedGeoJson, null, 2),
        };
    }
    catch (error) {
        throw new Error(`Error converting KML to GeoJSON: ${error.message}`);
    }
};
exports.convertKmlToGeoJson = convertKmlToGeoJson;
const changeFileExtension = (fileName, newExtension) => {
    if (!newExtension.startsWith(".")) {
        newExtension = "." + newExtension;
    }
    const baseName = path.parse(fileName).name;
    return baseName + newExtension;
};
exports.changeFileExtension = changeFileExtension;
//# sourceMappingURL=fileUpload.common.js.map