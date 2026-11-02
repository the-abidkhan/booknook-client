import { Search, BookMarked, RotateCcw } from 'lucide-react';

const steps = [
    {
        icon: Search,
        title: 'Find a Book',
        text: 'Browse the library and pick any book you like from our growing collection.',
    },
    {
        icon: BookMarked,
        title: 'Borrow It',
        text: 'Log in, open the book and borrow it for a few days with a single click.',
    },
    {
        icon: RotateCcw,
        title: 'Return It',
        text: 'Finished reading? Return the book from My Borrows so others can enjoy it.',
    },
];

export default function HowItWorks() {
    return (
        <section className="py-14 bg-[#F3E7D3]">
            <div className="mx-auto max-w-6xl px-4">
                <h2 className="text-center text-3xl font-bold text-[#3E2A1E]">
                    How Borrowing Works
                </h2>
                <p className="mt-2 text-center text-[#5C4433]">
                    Three simple steps to your next read
                </p>

                <div className="mt-10 grid gap-6 md:grid-cols-3">
                    {steps.map((step, i) => (
                        <div
                            key={step.title}
                            className="rounded-xl border border-[#E3D3BC] bg-[#FFFBF2] p-8 text-center shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
                        >
                            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#8B4A2B] text-white">
                                <step.icon className="h-7 w-7" />
                            </div>
                            <p className="mt-4 text-sm font-semibold text-[#8B4A2B]">Step {i + 1}</p>
                            <h3 className="mt-1 text-xl font-bold text-[#3E2A1E]">{step.title}</h3>
                            <p className="mt-2 text-sm text-[#5C4433]">{step.text}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}