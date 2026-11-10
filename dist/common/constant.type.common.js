"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ENDPOINTS = exports.IMAGE_EXTENSIONS = exports.VIDEO_EXTENSIONS = exports.INTERVAL_TYPE_ENUM = exports.IMAGE_TYPE_ENUM = exports.STATUS_ENUM = exports.NOMINATIM_URL = exports.STATIC_DATA_MODULE = exports.STATIC_DATA_DIR = exports.UPLOAD_DIR = void 0;
exports.UPLOAD_DIR = "./temp-data-file";
exports.STATIC_DATA_DIR = "./static-data/16. Signal Devices_San Diego.csv";
exports.STATIC_DATA_MODULE = "./static-data/module-feature-data.json";
exports.NOMINATIM_URL = "https://nominatim.openstreetmap.org/search.php?country=COUNTRY&state=STATE_CODE&polygon_geojson=1&format=jsonv2";
exports.STATUS_ENUM = {
    PENDING: 0,
    BLUR: 1,
    GLARE: 2,
    MISSING_GPS: 3,
    VALIDATED: 4,
    FILE_NOT_FOUND: 5,
    NOT_APPLICABLE: 6,
};
exports.IMAGE_TYPE_ENUM = {
    VIDEO: 1,
    IMAGE: 0,
    MEDIA_EXTRACTION: 2,
};
exports.INTERVAL_TYPE_ENUM = {
    TIME: 1,
    DISTANCE: 2,
};
exports.VIDEO_EXTENSIONS = [
    "mp4",
    "avi",
    "mkv",
    "mov",
    "wmv",
    "lrv",
    "flv",
    "MP4",
    "LRV",
    "MOV",
    "MKV",
    "AVI",
    "WMV",
];
exports.IMAGE_EXTENSIONS = [
    "jpg",
    "jpeg",
    "png",
    "gif",
    "bmp",
    "JPG",
    "JPEG",
    "PNG",
];
exports.ENDPOINTS = {
    LANE_MARKINGS: "lane-markings",
    PAVEMENT_MARKINGS: "pavement-markings",
    TRAFFIC_SIGNS: "traffic-signs",
    PASER_MARKINGS: "paser-markings",
};
//# sourceMappingURL=constant.type.common.js.map