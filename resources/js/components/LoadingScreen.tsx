import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { CheckSquare } from 'lucide-react';

export default function LoadingScreen({ onLoadingComplete }: { onLoadingComplete: () => void }) {
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        // Simulate minimum loading time for smooth animation
        const timer = setTimeout(() => {
            setIsLoaded(true);
            setTimeout(() => {
                onLoadingComplete();
            }, 500); // Wait for fade out animation
        }, 1500); // Show loading screen for 1.5 seconds

        return () => clearTimeout(timer);
    }, [onLoadingComplete]);

    return (
        <motion.div
            initial={{ opacity: 1 }}
            animate={{ opacity: isLoaded ? 0 : 1 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900"
        >
            <div className="flex flex-col items-center gap-8">
                {/* Animated Logo */}
                <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ 
                        scale: [0.5, 1.2, 1],
                        opacity: 1,
                    }}
                    transition={{
                        duration: 0.8,
                        ease: "easeOut",
                    }}
                    className="relative"
                >
                    {/* Blue mail/envelope logo container */}
                    <motion.div
                        className="flex aspect-square size-32 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-2xl dark:bg-blue-500"
                        animate={{
                            scale: [1, 1.05, 1],
                        }}
                        transition={{
                            duration: 1.5,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                    >
                        <motion.div
                            initial={{ pathLength: 0, opacity: 0 }}
                            animate={{ 
                                pathLength: [0, 1, 1, 0],
                                opacity: [0, 1, 1, 0]
                            }}
                            transition={{
                                duration: 2,
                                repeat: Infinity,
                                ease: "easeInOut",
                                times: [0, 0.4, 0.6, 1]
                            }}
                        >
                            <CheckSquare className="size-20" strokeWidth={2.5} />
                        </motion.div>
                    </motion.div>

                    {/* Glow effect */}
                    <motion.div
                        className="absolute inset-0 blur-3xl opacity-60"
                        animate={{
                            scale: [1, 1.3, 1],
                            opacity: [0.4, 0.6, 0.4],
                        }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                    >
                        <div className="w-full h-full bg-blue-500" />
                    </motion.div>
                </motion.div>

                {/* TaskFlow text */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                    className="text-center"
                >
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                        TaskFlow
                    </h1>
                </motion.div>

                {/* Loading dots */}
                <div className="flex gap-2">
                    {[0, 1, 2].map((i) => (
                        <motion.div
                            key={i}
                            className="w-3 h-3 bg-indigo-600 dark:bg-indigo-400 rounded-full"
                            animate={{
                                y: [0, -12, 0],
                                scale: [1, 1.2, 1],
                            }}
                            transition={{
                                duration: 0.6,
                                repeat: Infinity,
                                delay: i * 0.2,
                                ease: "easeInOut",
                            }}
                        />
                    ))}
                </div>

                {/* Loading text */}
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="text-gray-600 dark:text-gray-300 text-lg font-medium"
                >
                    Loading TaskFlow...
                </motion.p>
            </div>
        </motion.div>
    );
}
