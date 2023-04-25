import { NestFactory } from "@nestjs/core";
import { IoModule } from "./root/IoModule";

async function bootstrap() {
  const app = await NestFactory.create(IoModule, {
    abortOnError: false,
    cors: true,
  });
  await app.listen(2000);
}

bootstrap().catch((reason) => {
  console.error(reason);
});
