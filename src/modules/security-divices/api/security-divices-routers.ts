import {Router} from "express";
import {getAllPostsHandler} from "../../posts/api/handlers/get-all-posts-handler";
import {getAllActiveSessionsHandler} from "./handlers/get-all-active-sessions-handler";
import {authMiddleware} from "../../../common/middleware/auth-middleware";
import {deleteSessionByDeviceIdHandler} from "./handlers/delete-session-by-deviceId-handler";
import {deleteAllSessionsHandler} from "./handlers/delete-all-sessions-handler";
import {deviceIdValidation} from "../validation/deviceId-validation";

export const securityDeviceRouter = Router({})

securityDeviceRouter.get("/", getAllActiveSessionsHandler)
securityDeviceRouter.delete("/", deleteAllSessionsHandler)
securityDeviceRouter.delete("/:deviceId", deviceIdValidation, deleteSessionByDeviceIdHandler)
