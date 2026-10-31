'use client';
import { useEffect, useState } from 'react';

interface Book {
  _id: string;
  title: string;
  author: string;
  price?: number;
}

export default function Home() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetch('http://localhost:5000/books')
      .then((res) => res.json())
      .then((data: Book[]) => {
        setBooks(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching books:', err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="p-8 text-xl">Loading books...</div>;
  }

  return (
    <main className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">BookNook Collection</h1>
      {books.length === 0 ? (
        <p className="text-center text-gray-500">No books found in the database.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {books.map((book) => (
            <div key={book._id} className="p-4 border rounded-lg shadow-sm hover:shadow-md transition">
              <h2 className="text-xl font-semibold">{book.title}</h2>
              <p className="text-gray-600">Author: {book.author}</p>
              {book.price && <p className="text-green-600 font-medium">Price: ${book.price}</p>}
            </div>
          ))}
        </div>
      )}
    </main>
  );
}