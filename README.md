Reproducing bug of `@nestjs/platform-fastify`.

When install NestJS v11, its `@nestjs/platform-fastify` has a wrong `peerDependency` to the `@nestjs/core` that referencing the previous major version `10.0.1`.

```bash
npm warn Could not resolve dependency:
npm warn peer @nestjs/common@"^10.0.0" from @nestjs/platform-fastify@11.0.1
npm warn node_modules/@nestjs/platform-fastify
npm warn   @nestjs/platform-fastify@"11" from the root project
```

If I ignore the bug and try to set it up with the `npm install --force` option, it breaks the `NestFastifyApplication.use()` function like below.

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

Here is the reproducible script of such bugs.

No bug occurs in the `setup:v10` mode, but `setup:v11` mode makes above bug.

```bash
# CLONE
git clone https://github.com/samchon/nestjs-v11-platform-fastify-dependency-bug
cd nestjs-v11-platform-fastify-dependency-bug

# WORKING PROPERTY IN V10
npm install
npm run build
npm run test

# FAILED TO SETUP IN V11
npm run setup:v11

# FORCE SETUP OCCURS RUNTIME ERROR
npm run setup:v11:force
npm run test
```