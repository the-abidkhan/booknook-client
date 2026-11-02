import Link from 'next/link';
import { BookOpen, GraduationCap, Compass, Smile, FolderKanban } from 'lucide-react';

const categories = [
    { name: 'Fiction', icon: BookOpen },
    { name: 'Science', icon: GraduationCap },
    { name: 'History', icon: Compass },
    { name: 'Kids', icon: Smile },
    { name: 'Others', icon: FolderKanban },
];

type Book = { category: string };

async function getBooks(): Promise<Book[]> {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/books`, {
            cache: 'no-store',
        });
        if (!res.ok) return [];
        return res.json();
    } catch {
        return [];
    }
}

export default async function TopCategories() {
    const books = await getBooks();

    const counts = categories.map((cat) => ({
        ...cat,
        count: books.filter((b) => b.category === cat.name).length,
        href: `/books?category=${cat.name}`,
    }));

    return (
        <section className="py-14 bg-[#F3E7D3]">
            <div className="mx-auto max-w-6xl px-4">
                <h2 className="text-center text-3xl font-bold text-[#3E2A1E]">
                    Top Categories
                </h2>
                <p className="mt-2 text-center text-[#5C4433]">
                    Explore books across our {books.length} curated collection
                </p>

                <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {counts.map((cat) => (
                        <Link
                            key={cat.name}
                            href={cat.href}
                            className="group flex items-center gap-4 rounded-xl border border-[#E3D3BC] bg-[#FFFBF2] p-6 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:border-[#8B4A2B] hover:shadow-xl"
                        >
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-[#8B4A2B] text-white transition-transform group-hover:scale-110">
                                <cat.icon className="h-6 w-6" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-[#3E2A1E] group-hover:text-[#8B4A2B]">
                                    {cat.name}
                                </h3>
                                <p className="text-sm text-[#5C4433]">
                                    {cat.count} {cat.count === 1 ? 'Book' : 'Books'}
                                </p>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}