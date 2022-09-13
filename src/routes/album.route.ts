import { Router } from 'express';
import { AlbumController } from "../controllers/album.controller"

export const albumRouter = Router();

albumRouter.get("/");
albumRouter.post("/");
albumRouter.post("/:albumName")

// export default albumRouter;
