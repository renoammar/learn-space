import Navbar from '@/MyComponents/Navbar';
import { Link } from '@inertiajs/react';

export default function WelcomePage() {
    return (
        <div className="bg-gradient relative min-h-screen overflow-hidden text-white">
            <style>
                {`
                    .bg-gradient {
                        background: linear-gradient(-45deg, #0A92DD, #100F57);
                        background-size: 400% 400%;
                        animation: gradient 12s ease infinite;
                    }

                    @keyframes gradient {
                        0% { background-position: 0% 50%; }
                        50% { background-position: 100% 50%; }
                        100% { background-position: 0% 50%; }
                    }

                    @keyframes spin-slow {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                    }

                    @keyframes spin-slow-reverse {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(-360deg); }
                    }

                    .animate-spin-slow {
                        animation: spin-slow 6s linear infinite;
                    }

                    .animate-spin-slow-reverse {
                        animation: spin-slow-reverse 7s linear infinite;
                    }
                `}
            </style>

            <Navbar />

            {/* Hero Section */}
            <div className="relative z-10 mt-20 flex flex-col items-center justify-center px-6 text-center">
                {/* <button className="mb-4 rounded-full border border-[#FFB800] px-4 py-1 text-sm text-[#FFB800]">Get Your Free Consultation Now</button> */}
                <h1 className="mb-4 text-4xl leading-tight font-bold md:text-5xl">
                    Manage your team <br /> easily with task man
                </h1>
                <p className="mb-6 max-w-xl text-base text-gray-200 md:text-lg">
                    LearnSpace is a school management solution that offers a personalized portal to each type of user,
                </p>
                <Link href="/login" className="rounded-full bg-[#00AEEF] px-6 py-3 font-semibold transition hover:bg-[#0094cc]">
                    Get Started
                </Link>
            </div>

            {/* Curve Elements */}
            <div className="animate-spin-slow absolute bottom-28 left-12 h-10 w-10 rounded-full border-4 border-[#FFB800] border-t-transparent border-r-transparent"></div>
            <div className="animate-spin-slow-reverse absolute top-32 right-16 h-10 w-10 rounded-full border-4 border-[#FFB800] border-b-transparent border-l-transparent"></div>
        </div>
    );
}
