export declare const UPLOAD_DIR = "./temp-data-file";
export declare const STATIC_DATA_DIR = "./static-data/16. Signal Devices_San Diego.csv";
export declare const STATIC_DATA_MODULE = "./static-data/module-feature-data.json";
export declare const NOMINATIM_URL = "https://nominatim.openstreetmap.org/search.php?country=COUNTRY&state=STATE_CODE&polygon_geojson=1&format=jsonv2";
export declare const STATUS_ENUM: {
    PENDING: number;
    BLUR: number;
    GLARE: number;
    MISSING_GPS: number;
    VALIDATED: number;
    FILE_NOT_FOUND: number;
    NOT_APPLICABLE: number;
};
export declare const IMAGE_TYPE_ENUM: {
    VIDEO: number;
    IMAGE: number;
    MEDIA_EXTRACTION: number;
};
export declare const INTERVAL_TYPE_ENUM: {
    TIME: number;
    DISTANCE: number;
};
export declare const VIDEO_EXTENSIONS: string[];
export declare const IMAGE_EXTENSIONS: string[];
export declare const ENDPOINTS: {
    readonly LANE_MARKINGS: "lane-markings";
    readonly PAVEMENT_MARKINGS: "pavement-markings";
    readonly TRAFFIC_SIGNS: "traffic-signs";
    readonly PASER_MARKINGS: "paser-markings";
};
