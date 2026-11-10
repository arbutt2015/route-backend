import "reflect-metadata";
import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { AppModule } from "./app.module";
import { LoggingService } from "./common/graylog.common";
import * as compression from "compression";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix("api");
  app.enableCors({
    origin: "*",
    methods: "*",
    allowedHeaders: "*",
  });
  const logger = app.get(LoggingService);
  const config = new DocumentBuilder()
    .setTitle("Route Api Documentation")
    .setDescription("These API only for Route")
    .setVersion("1.0")
    .addBearerAuth(
      {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
        in: "header",
      },
      "access-token",
    )
    .build();
  const document = SwaggerModule.createDocument(app, config);
  app.use("/api/swagger/index.html", (req, res) => res.redirect("/api/swagger"));
  SwaggerModule.setup("api/swagger", app, document);
  app.useLogger(logger);
  app.use(compression());
  const port = process.env.PORT || 5001;
  await app.listen(port);
  console.log(`Server started at http://localhost:${port}/api`);
}
bootstrap();
