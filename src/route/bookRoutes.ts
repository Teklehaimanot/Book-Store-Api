import express from "express";
import * as bookController from "../controller/bookController";

const router = express.Router();

router.get("/", bookController.getBooks);
router.get("/:bookId", bookController.getBookById);
router.post("/", bookController.createBook);
router.put("/:bookId", bookController.updateBook);
router.delete("/:bookId", bookController.deleteBook);

export default router;
