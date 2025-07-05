// resources/js/Components/GradientBackground.tsx (or wherever your components live)

import { PropsWithChildren } from 'react';

export default function GradientBackground({ children }: PropsWithChildren) {
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

            {children}

            {/* Reusable animated curves */}
            <div className="animate-spin-slow absolute bottom-28 left-12 h-10 w-10 rounded-full border-4 border-[#FFB800] border-t-transparent border-r-transparent" />
            <div className="animate-spin-slow-reverse absolute top-32 right-16 h-10 w-10 rounded-full border-4 border-[#FFB800] border-b-transparent border-l-transparent" />
        </div>
    );
}
