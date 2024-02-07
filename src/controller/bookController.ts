import { Request, Response } from "express";
import * as bookService from "../service/bookService";
import Book from "../entity/Book";

const validTags = ["fiction", "non-fiction", "science", "essay"];

export const createBook = async (
  req: Request,
  res: Response
): Promise<void> => {
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
};

export const getBooks = async (req: Request, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = (page - 1) * limit;

    const { books, totalCount } = await bookService.getAllBooks(offset, limit);

    const totalPages = Math.ceil(totalCount / limit);
    const nextPage = page < totalPages ? page + 1 : null;
    const prevPage = page > 1 ? page - 1 : null;

    res.json({ books, totalPages, nextPage, prevPage });
  } catch (error) {
    console.error("Error fetching books:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const updateBook = async (
  req: Request,
  res: Response
): Promise<void> => {
  const bookId = parseInt(req.params.bookId);
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
    const updatedBook = await bookService.updateBook(bookId, {
      title,
      writer,
      coverImage,
      point,
      tags: newTags,
    });
    if (!updatedBook) {
      res.status(404).json({ error: "Book not found" });
      return;
    }
    res.status(200).json(updatedBook);
  } catch (error) {
    console.error("Error updating book:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getBookById = async (
  req: Request,
  res: Response
): Promise<void> => {
  const bookId = parseInt(req.params.bookId);
  try {
    const book = await bookService.getBookById(bookId);
    if (book) {
      res.status(200).json(book);
    } else {
      res.status(404).json({ message: "Book not found" });
      return;
    }
  } catch (error) {
    console.error("Error fetching book:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteBook = async (
  req: Request,
  res: Response
): Promise<void> => {
  const bookId = parseInt(req.params.bookId);
  try {
    const book: Book | null = await bookService.getBookById(bookId);
    if (!book) {
      res.status(404).json({ error: "Book not found" });
      return;
    }
    await bookService.deleteBook(bookId);
    res.sendStatus(204);
  } catch (error) {
    console.error("Error deleting book:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
