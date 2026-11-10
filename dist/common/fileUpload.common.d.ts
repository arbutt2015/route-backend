import * as multer from "multer";
export declare const deleteFile: (filePath: string) => void;
export declare const readFile: (filePath: string) => Promise<string>;
export declare const getFileExtension: (filename: string) => string;
export declare const getMulterConfig: (extensionNames: string[], pathUpload: string) => {
    storage: multer.StorageEngine;
    fileFilter: (_req: any, file: any, cb: any) => void;
};
export declare function convertGeoJSONToCSV(geoJsonData: any): string;
export declare const convertKmlToGeoJson: (kmlData: any) => {
    boundingBox: string;
    kmlGeoJson: string;
};
export declare const changeFileExtension: (fileName: string, newExtension: string) => string;
