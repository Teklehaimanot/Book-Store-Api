import express from "express";
import * as bookController from "../controller/bookController";

const router = express.Router();

router.get("/", bookController.getBooks);
router.post("/", bookController.createBook);

export default router;
