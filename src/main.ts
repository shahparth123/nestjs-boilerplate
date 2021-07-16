import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as config from 'config';
import { AppModule } from './app.module';
//import { SecretsService } from './providers/secrets/secrets.service';
import * as bodyParser from 'body-parser';
import * as helmet from 'helmet';

async function bootstrap() {
    // Pull secrets from Secret Manager
    // const secretsService = new SecretsService();
    //await secretsService.getSecrets();

    // Swagger API Doc
    const app = await NestFactory.create(AppModule);
    app.use(bodyParser.json({ limit: '50mb' }));
    app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
    app.use(helmet());

    app.enableCors();
    const options = new DocumentBuilder()
        .setTitle('NestJS API')
        .setDescription('NestJS API Swagger Doc')
        .setVersion('1.0')
        .addTag('api')
        .addBearerAuth()
        .build();
    app.useGlobalPipes(
        new ValidationPipe({
            transform: true,
            //whitelist: true,
            //forbidNonWhitelisted: true,
        }),
    );
    const swagger = config.has('swagger') ? config.get('swagger') : process.env.SWAGGER == 'true';
    console.log(typeof swagger, swagger == 'true')
    if (swagger == true) {
        const document = SwaggerModule.createDocument(app, options);
        SwaggerModule.setup('api', app, document);
    }
    const port = config.has('port') ? config.get('port') : process.env.PORT || 5000;
    await app.listen(port);
    console.log(`Server listening at port: ${port}`);
}

bootstrap();
