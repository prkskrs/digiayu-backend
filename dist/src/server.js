"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const express_1 = __importDefault(require("express"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const app = (0, express_1.default)();
const port = process.env.PORT;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.use((0, cookie_parser_1.default)());
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const admin_routes_1 = __importDefault(require("./routes/admin.routes"));
const doctor_routes_1 = __importDefault(require("./routes/doctor.routes"));
const patient_routes_1 = __importDefault(require("./routes/patient.routes"));
const appointment_routes_1 = __importDefault(require("./routes/appointment.routes"));
const diagnosis_routes_1 = __importDefault(require("./routes/diagnosis.routes"));
const category_routes_1 = __importDefault(require("./routes/category.routes"));
const chat_routes_1 = __importDefault(require("./routes/chat.routes"));
app.use((0, morgan_1.default)("short", {
    skip: (req, res) => {
        return req.originalUrl === "/status";
    },
}));
app.get("/", (req, res) => {
    throw new Error("Something went wrong");
});
app.get("/status", (req, res) => {
    res.status(200).end();
});
app.use("/api/auth", auth_routes_1.default);
app.use("/api/admin", admin_routes_1.default);
app.use("/api/doctor", doctor_routes_1.default);
app.use("/api/patient", patient_routes_1.default);
app.use("/api/appointment", appointment_routes_1.default);
app.use("/api/diagnosis", diagnosis_routes_1.default);
app.use("/api/product", auth_routes_1.default);
app.use("/api/category", category_routes_1.default);
app.use("/api/chat", chat_routes_1.default);
app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
app.use(function onError(error, req, res, next) {
    const { status = 500 } = error;
    const is_error_array = Array.isArray(error);
    console.log({ url: req.url, body: req.body, error });
    res.status(status).json({
        success: false,
        message: `Something went wrong. Please try again later.`,
        errorTrace: is_error_array
            ? new Error(JSON.stringify(error))
            : new Error(error),
    });
});
//# sourceMappingURL=server.js.map