import { Pool } from "pg";
import Book from "../entity/Book";
import config from "../config";

const pool = new Pool(config.db);

export const getAllBooks = async (
  offset: number,
  limit: number
): Promise<Book[]> => {
  const { rows } = await pool.query("SELECT * FROM books LIMIT $1 OFFSET $2", [
    limit,
    offset,
  ]);
  return rows;
};

export const getTotalCount = async (): Promise<number> => {
  const { rows } = await pool.query("SELECT COUNT(*) FROM books");
  return parseInt(rows[0].count);
};

export const createBook = async (book: Book): Promise<Book> => {
  const { title, writer, coverImage, point, tags } = book;
  const query =
    "INSERT INTO books (title, writer, cover_image, point, tags) VALUES ($1, $2, $3, $4, $5) RETURNING *";
  const values = [title, writer, coverImage, point, tags];
  const { rows } = await pool.query(query, values);
  return rows[0];
};

export const getBookById = async (bookId: number): Promise<Book | null> => {
  try {
    const query = "SELECT * FROM books WHERE id = $1";
    const { rows } = await pool.query(query, [bookId]);
    return rows.length ? rows[0] : null;
  } catch (error: any) {
    throw new Error("Error fetching book: " + error.message);
  }
};

export const updateBook = async (
  bookId: number,
  book: Book
): Promise<Book | null> => {
  const { title, writer, coverImage, point, tags } = book;
  try {
    const query =
      "UPDATE books SET title = $1, writer = $2, cover_image = $3, point = $4, tags = $5 WHERE id = $6 RETURNING *";
    const values = [title, writer, coverImage, point, tags, bookId];
    const { rows } = await pool.query(query, values);
    return rows.length ? rows[0] : null;
  } catch (error: any) {
    throw new Error("Error updating book: " + error.message);
  }
};

export const deleteBook = async (bookId: number): Promise<void> => {
  try {
    const query = "DELETE FROM books WHERE id = $1";
    await pool.query(query, [bookId]);
  } catch (error: any) {
    throw new Error("Error deleting book: " + error.message);
  }
};
