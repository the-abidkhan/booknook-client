import Link from 'next/link';
import { BookOpen, GraduationCap, Compass, Smile, FolderKanban } from 'lucide-react';

const categories = [
    { name: 'Fiction', count: '15 Books', icon: BookOpen, href: '/books?category=Fiction' },
    { name: 'Science', count: '12 Books', icon: GraduationCap, href: '/books?category=Science' },
    { name: 'History', count: '10 Books', icon: Compass, href: '/books?category=History' },
    { name: 'Kids', count: '8 Books', icon: Smile, href: '/books?category=Kids' },
    { name: 'Others', count: '5 Books', icon: FolderKanban, href: '/books?category=Others' },
];

export default function TopCategories() {
    return (
        <section className="py-14 bg-[#F3E7D3]">
            <div className="mx-auto max-w-6xl px-4">
                <h2 className="text-center text-3xl font-bold text-[#3E2A1E]">
                    Top Categories
                </h2>
                <p className="mt-2 text-center text-[#5C4433]">
                    Explore books across our 50 curated collection
                </p>

                <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {categories.map((cat) => (
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
                                <p className="text-sm text-[#5C4433]">{cat.count}</p>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}