import GradientBackground from '@/MyComponents/GradientBackground';
import Navbar from '@/MyComponents/Navbar';
import { Link } from '@inertiajs/react';

export default function WelcomePage() {
    return (
        <GradientBackground>
            <Navbar />

            <div className="relative z-10 mt-20 flex flex-col items-center justify-center px-6 text-center">
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
        </GradientBackground>
    );
}
