"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const core_1 = require("@nestjs/core");
const swagger_1 = require("@nestjs/swagger");
const app_module_1 = require("./app.module");
const graylog_common_1 = require("./common/graylog.common");
const compression = require("compression");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.setGlobalPrefix("api");
    app.enableCors({
        origin: "*",
        methods: "*",
        allowedHeaders: "*",
    });
    const logger = app.get(graylog_common_1.LoggingService);
    const config = new swagger_1.DocumentBuilder()
        .setTitle("Route Api Documentation")
        .setDescription("These API only for Route")
        .setVersion("1.0")
        .addBearerAuth({
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
        in: "header",
    }, "access-token")
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    app.use("/api/swagger/index.html", (req, res) => res.redirect("/api/swagger"));
    swagger_1.SwaggerModule.setup("api/swagger", app, document);
    app.useLogger(logger);
    app.use(compression());
    const port = process.env.PORT || 5001;
    await app.listen(port);
    console.log(`Server started at http://localhost:${port}/api`);
}
bootstrap();
//# sourceMappingURL=main.js.map