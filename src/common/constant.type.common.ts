export const UPLOAD_DIR = "./temp-data-file";
export const STATIC_DATA_DIR = "./static-data/16. Signal Devices_San Diego.csv";
export const STATIC_DATA_MODULE = "./static-data/module-feature-data.json";

export const NOMINATIM_URL =
  "https://nominatim.openstreetmap.org/search.php?country=COUNTRY&state=STATE_CODE&polygon_geojson=1&format=jsonv2";

export const STATUS_ENUM = {
  PENDING: 0,
  BLUR: 1,
  GLARE: 2,
  MISSING_GPS: 3,
  VALIDATED: 4,
  FILE_NOT_FOUND: 5,
  NOT_APPLICABLE: 6,
};

export const IMAGE_TYPE_ENUM = {
  VIDEO: 1,
  IMAGE: 0,
  MEDIA_EXTRACTION: 2,
};

export const INTERVAL_TYPE_ENUM = {
  TIME: 1,
  DISTANCE: 2,
};

export const VIDEO_EXTENSIONS = [
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
export const IMAGE_EXTENSIONS = [
  "jpg",
  "jpeg",
  "png",
  "gif",
  "bmp",
  "JPG",
  "JPEG",
  "PNG",
];

export const ENDPOINTS = {
  LANE_MARKINGS: "lane-markings",
  PAVEMENT_MARKINGS: "pavement-markings",
  TRAFFIC_SIGNS: "traffic-signs",
  PASER_MARKINGS: "paser-markings",
} as const;
