import Book from "../entity/Book";
import * as bookRepository from "../repository/bookRepository";

export const getAllBooks = async (): Promise<Book[]> => {
  return await bookRepository.getAllBooks();
};

export const createBook = async (
  title: string,
  writer: string,
  coverImage: string,
  point: number,
  tags: string[]
): Promise<Book> => {
  const newBook = new Book(title, writer, coverImage, point, tags);
  return await bookRepository.createBook(newBook);
};

export const getBookById = async (bookId: number): Promise<Book | null> => {
  try {
    const book = await bookRepository.getBookById(bookId);
    return book;
  } catch (error: any) {
    throw new Error("Error fetching book: " + error.message);
  }
};

export const updateBook = async (
  bookId: number,
  book: Book
): Promise<Book | null> => {
  try {
    const updatedBook = await bookRepository.updateBook(bookId, book);
    if (!updatedBook) {
      throw new Error(`Book with ID ${bookId} not found`);
    }
    return updatedBook;
  } catch (error: any) {
    throw new Error("Error updating book: " + error.message);
  }
};

export const deleteBook = async (bookId: number): Promise<void> => {
  try {
    const existingBook = await bookRepository.getBookById(bookId);
    if (!existingBook) {
      throw new Error(`Book with ID ${bookId} not found`);
    }
    await bookRepository.deleteBook(bookId);
  } catch (error: any) {
    throw new Error("Error deleting book: " + error.message);
  }
};
