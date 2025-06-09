import { Link } from '@inertiajs/react';

export default function Navbar() {
    return (
        <div className="relative z-10 flex items-center justify-between px-8 py-6 text-white">
            <div className="text-2xl font-bold">🎓 LearnSpace</div>
            {/* <div className="hidden space-x-6 text-sm md:flex">
                <a href="#" className="hover:text-blue-300">
                    Home
                </a>
                <a href="#" className="hover:text-blue-300">
                    Pricing
                </a>
                <a href="#" className="hover:text-blue-300">
                    Use Cases
                </a>
                <a href="#" className="hover:text-blue-300">
                    Location
                </a>
                <a href="#" className="hover:text-blue-300">
                    FAQ
                </a>
                <a href="#" className="hover:text-blue-300">
                    Company
                </a>
            </div> */}
            <Link href="/login" className="rounded-full bg-[#00AEEF] px-5 py-2 text-sm font-semibold text-white shadow transition hover:bg-[#0094cc]">
                Login
            </Link>
        </div>
    );
}
