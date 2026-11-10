import { Response } from "express";

export enum FileDetailMenu {
  Uploaded = "UPLOADED",
  Pending = "PENDING",
  Completed = "COMPLETED",
  Video = "VIDEO",
  Image = "IMAGE",
}

export enum RegionValidationStatus {
  Pending = 1,
  Processing = 2,
  Completed = 3,
  Failed = 4,
}

export enum CameraDirection {
  Front = "Front",
  Back = "Back",
  Right = "Right",
  Left = "Left",
}

export interface FlushableResponse extends Response {
  flushHeaders: () => void;
  flush: () => void;
}

export interface GPSPoint {
  timestamp: number;
  relativeTime: number;
  latitude: number;
  longitude: number;
  altitude: number;
  speed: number;
  accuracy: number;
  bearing: number;
}

export interface GPSData {
  videoFileName: string;
  gpsTrack: GPSPoint[];
  startTime: number;
  endTime: number;
  duration: number;
}

export interface InterpolationCSVRow {
  "IMAGE NAME": string;
  "IMAGE LATITUDE": string;
  "IMAGE LONGITUDE": string;
  "COLLECTION DATE": string;
  DISTANCE_THRESHOLD_MET: string;
  "SPEED (m/s)": string;
  "BEARING (degrees)": string;
  FRAME_TIMESTAMP: string;
}

export enum PlotType {
  PieChart = "Pie Chart",
  HorizontalBarGraph = "Horizontal Bar Graph",
  VerticalBarGraph = "Vertical Bar Graph",
}

export enum CostType {
  FIXED = "fixed",
  RANGE = "range",
}

export interface IAppliedFilter {
  assetId: number;
  assetName: string;
  attributeId: number;
  attributeName: string;
  operatorId: number;
  valueType: "Number" | "Select";
  value: string;
  regionId: number;
  regionName: string;
  logicalOperator: "AND" | "OR";
}
