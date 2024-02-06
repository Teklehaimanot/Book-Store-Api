class Book {
  constructor(
    public title: string,
    public writer: string,
    public coverImage: string,
    public point: number,
    public tags: string[]
  ) {}
}

export default Book;
