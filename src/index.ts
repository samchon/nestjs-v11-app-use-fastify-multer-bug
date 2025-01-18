import { NestFactory } from "@nestjs/core";
import {
  FastifyAdapter,
  NestFastifyApplication,
} from "@nestjs/platform-fastify";
import FastifyMulter from "fastify-multer";

import { AppModule } from "./AppModule";
import api from "./api";

const main = async (): Promise<void> => {
  const app: NestFastifyApplication = await NestFactory.create(
    AppModule,
    new FastifyAdapter(),
    {
      logger: false,
    }
  );
  await app.register(FastifyMulter.contentParser as any);
  await app.listen(3_000);

  await api.functional.upload(
    {
      host: "http://localhost:3000",
    },
    {
      file: new File(["Hello, World!"], "hello.txt"),
    }
  );
  await app.close();
};
main().catch((error) => {
  console.log(error);
  process.exit(-1);
});
