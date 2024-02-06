import { Pool } from "pg";
import Book from "../entity/Book";
import config from "../config";

const pool = new Pool(config.db);

export async function getAllBooks(): Promise<Book[]> {
  const { rows } = await pool.query("SELECT * FROM books");
  return rows;
}

export async function createBook(book: Book): Promise<Book> {
  const { title, writer, coverImage, point, tags } = book;
  const query =
    "INSERT INTO books (title, writer, cover_image, point, tags) VALUES ($1, $2, $3, $4, $5) RETURNING *";
  const values = [title, writer, coverImage, point, tags];
  const { rows } = await pool.query(query, values);
  return rows[0];
}

export const getBookById = async (bookId: number): Promise<Book | null> => {
  try {
    const query = "SELECT * FROM books WHERE id = $1";
    const { rows } = await pool.query(query, [bookId]);
    return rows.length ? rows[0] : null;
  } catch (error: any) {
    throw new Error("Error fetching book: " + error.message);
  }
};
