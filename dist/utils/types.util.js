"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CostType = exports.PlotType = exports.CameraDirection = exports.RegionValidationStatus = exports.FileDetailMenu = void 0;
var FileDetailMenu;
(function (FileDetailMenu) {
    FileDetailMenu["Uploaded"] = "UPLOADED";
    FileDetailMenu["Pending"] = "PENDING";
    FileDetailMenu["Completed"] = "COMPLETED";
    FileDetailMenu["Video"] = "VIDEO";
    FileDetailMenu["Image"] = "IMAGE";
})(FileDetailMenu || (exports.FileDetailMenu = FileDetailMenu = {}));
var RegionValidationStatus;
(function (RegionValidationStatus) {
    RegionValidationStatus[RegionValidationStatus["Pending"] = 1] = "Pending";
    RegionValidationStatus[RegionValidationStatus["Processing"] = 2] = "Processing";
    RegionValidationStatus[RegionValidationStatus["Completed"] = 3] = "Completed";
    RegionValidationStatus[RegionValidationStatus["Failed"] = 4] = "Failed";
})(RegionValidationStatus || (exports.RegionValidationStatus = RegionValidationStatus = {}));
var CameraDirection;
(function (CameraDirection) {
    CameraDirection["Front"] = "Front";
    CameraDirection["Back"] = "Back";
    CameraDirection["Right"] = "Right";
    CameraDirection["Left"] = "Left";
})(CameraDirection || (exports.CameraDirection = CameraDirection = {}));
var PlotType;
(function (PlotType) {
    PlotType["PieChart"] = "Pie Chart";
    PlotType["HorizontalBarGraph"] = "Horizontal Bar Graph";
    PlotType["VerticalBarGraph"] = "Vertical Bar Graph";
})(PlotType || (exports.PlotType = PlotType = {}));
var CostType;
(function (CostType) {
    CostType["FIXED"] = "fixed";
    CostType["RANGE"] = "range";
})(CostType || (exports.CostType = CostType = {}));
//# sourceMappingURL=types.util.js.map