import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { createLogger, transports, format } from 'winston';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as winston from 'winston';
async function bootstrap() {
  let baseUrl = '';

  const app = await NestFactory.create(AppModule, {
    logger: winston.createLogger({
      transports: [
        // let's log errors into its own file
        new transports.File({
          filename: `logs/error.log`,
          level: 'error',
          format: format.combine(format.timestamp(), format.json()),
        }),
        // logging all level
        new transports.File({
          filename: `logs/combined.log`,
          format: format.combine(format.timestamp(), format.json()),
        }),
        // we also want to see logs in our console
        new transports.Console({
          format: format.combine(
            format.cli(),
            format.splat(),
            format.timestamp(),
            format.printf((info) => {
              return `${info.timestamp} ${info.level}: ${info.message}`;
            }),
          ),
        }),
      ],
    }),
  });
  app.setGlobalPrefix('api/v1');
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    //allowedHeaders: 'Content-Type,Authorization',
  });
  const config = new DocumentBuilder()
    .setTitle('MeFriend')
    .setDescription('Api documentation for the project MeFriend')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  // Manually add the header parameter to all paths and methods
  // for (const path in document.paths) {
  //   for (const method in document.paths[path]) {
  //     if (document.paths[path][method].parameters) {
  //       document.paths[path][method].parameters.push({
  //         name: 'x-merchant-id',
  //         in: 'header',
  //         required: true,
  //         schema: {
  //           type: 'string',
  //         },
  //       });
  //     } else {
  //       document.paths[path][method].parameters = [
  //         {
  //           name: 'x-merchant-id',
  //           in: 'header',
  //           required: true,
  //           schema: {
  //             type: 'string',
  //           },
  //         },
  //       ];
  //     }
  //   }
  // }

  SwaggerModule.setup('api', app, document);
  await app.listen(3004);
  baseUrl = 'http://13.232.168.4';
  global['baseUrl'] = baseUrl;
}
bootstrap();
