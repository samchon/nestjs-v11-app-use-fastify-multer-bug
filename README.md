Reproducing bug of NestJS v11 with `fastify-multer`.

When using `fastify-multer` library with NestJS, there had not been any yproblem until NestJS v10. However, since v11 update, `fastify-multer` suddenly be broken.

```typescript
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
```

> ```bash
> HttpError: {
>   "statusCode":415,
>   "message":
>     Unsupported Media Type: 
>       multipart/form-data;
>       boundary=----formdata-undici-073632887489"
> }
> ```

Here is the reproducible script of such bug.

No bug occurs in the `setup:v10` mode, but `setup:v11` mode makes above bug.

```bash
git clone https://github.com/samchon/nestjs-v11-app-use-fastify-multer-bug
npm install
npm run build

# WORKING PROPERLY
npm run setup:v10
npm run test

# ERROR OCCURES
npm run setup:v11
npm run test
```