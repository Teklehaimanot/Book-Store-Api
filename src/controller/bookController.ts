import { Request, Response } from "express";
import * as bookService from "../service/bookService";

const validTags = ["fiction", "non-fiction", "science", "essay"];

export async function createBook(req: Request, res: Response): Promise<void> {
  const { title, writer, coverImage, point, tags } = req.body;
  const newTags = Array.isArray(tags)
    ? tags.filter((tag) => validTags.includes(tag))
    : [];
  if (newTags.length !== tags.length) {
    res.status(400).json({ error: "Invalid tags provided" });
    return;
  }
  if (!title || !writer || !coverImage || !point || !tags) {
    res.status(400).json({ error: "All fields are required" });
    return;
  }
  try {
    const createdBook = await bookService.createBook(
      title,
      writer,
      coverImage,
      point,
      newTags
    );
    res.status(201).json(createdBook);
  } catch (error) {
    console.error("Error creating book:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}

export async function getBooks(req: Request, res: Response): Promise<void> {
  try {
    const books = await bookService.getAllBooks();
    res.json(books);
  } catch (error) {
    console.error("Error fetching books:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
