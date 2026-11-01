import Link from 'next/link';

type Book = {
  _id: string;
  title: string;
  author: string;
  category: string;
  image: string;
};

async function getLatestBooks(): Promise<Book[]> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/books?sort=latest&limit=6`,
      { cache: 'no-store' }
    );
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

export default async function NewArrivals() {
  const books = await getLatestBooks();

  return (
    <section className="bg-[#F3E7D3] py-14">
      <div className="mx-auto max-w-6xl px-4">
        <h2 className="text-center text-3xl font-bold text-[#3E2A1E]">
          New Arrivals
        </h2>
        <p className="mt-2 text-center text-[#5C4433]">
          The latest books added to our library
        </p>

        {books.length === 0 ? (
          <p className="mt-10 text-center text-[#5C4433]">
            No books found right now.
          </p>
        ) : (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {books.map((book) => (
              <div
                key={book._id}
                className="group flex flex-col overflow-hidden rounded-xl border border-[#E3D3BC] bg-[#FFFBF2] shadow-sm transition-all duration-300 hover:-translate-y-2 hover:border-[#8B4A2B] hover:shadow-xl"
              >
                <div className="h-72 overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={book.image}
                    alt={book.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <span className="w-fit rounded-full bg-[#8B4A2B]/10 px-3 py-1 text-xs font-semibold text-[#8B4A2B]">
                    {book.category}
                  </span>
                  <h3 className="mt-3 text-lg font-bold text-[#3E2A1E]">
                    {book.title}
                  </h3>
                  <p className="mt-1 mb-4 text-sm text-[#5C4433]">
                    by {book.author}
                  </p>
                  <Link
                    href={`/books/${book._id}`}
                    className="mt-auto rounded-lg bg-[#8B4A2B] px-4 py-2 text-center font-semibold text-white transition-colors hover:bg-[#723B22]"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-10 text-center">
          <Link
            href="/books"
            className="inline-block rounded-lg border-2 border-[#8B4A2B] px-6 py-3 font-semibold text-[#8B4A2B] transition-colors hover:bg-[#8B4A2B] hover:text-white"
          >
            See All Books
          </Link>
        </div>
      </div>
    </section>
  );
}