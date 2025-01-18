import { TypedFormData, TypedRoute } from "@nestia/core";
import { Controller } from "@nestjs/common";
import { IUpload } from "./api/structures/IUpload";
import FastifyMulter from "fastify-multer";

@Controller()
export class AppController {
  @TypedRoute.Post("upload")
  public upload(
    @TypedFormData.Body(() => FastifyMulter()) body: IUpload
  ): void {
    body;
  }
}
