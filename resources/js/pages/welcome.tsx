import { dashboard, login, register } from '@/routes';
import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { CheckCircle2, Users, Zap, Shield, BarChart3, Clock, Star, TrendingUp, Target, Award } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

export default function Welcome({
    canRegister = true,
}: {
    canRegister?: boolean;
}) {
    const { auth } = usePage<SharedData>().props;
    
    // Animated counter for stats
    const [stats, setStats] = useState({ users: 0, tasks: 0, teams: 0, completion: 0 });
    
    useEffect(() => {
        const targets = { users: 2500, tasks: 15000, teams: 350, completion: 98 };
        const duration = 2000;
        const steps = 60;
        const interval = duration / steps;
        
        let step = 0;
        const timer = setInterval(() => {
            step++;
            const progress = step / steps;
            
            setStats({
                users: Math.floor(targets.users * progress),
                tasks: Math.floor(targets.tasks * progress),
                teams: Math.floor(targets.teams * progress),
                completion: Math.floor(targets.completion * progress),
            });
            
            if (step >= steps) clearInterval(timer);
        }, interval);
        
        return () => clearInterval(timer);
    }, []);

    return (
        <>
            <Head title="Welcome" />
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
                {/* Header */}
                <header className="border-b border-gray-200/50 bg-white/50 backdrop-blur-lg dark:border-gray-700/50 dark:bg-gray-900/50">
                    <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600">
                                    <CheckCircle2 className="h-6 w-6 text-white" />
                                </div>
                                <span className="text-xl font-bold text-gray-900 dark:text-white">
                                    TaskFlow
                                </span>
                            </div>
                            <nav className="flex items-center gap-4">
                                {auth.user ? (
                                    <Link
                                        href={dashboard()}
                                        className="rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-2.5 text-sm font-medium text-white shadow-lg shadow-blue-500/50 transition-all hover:shadow-xl hover:shadow-blue-500/50 hover:scale-105"
                                    >
                                        Go to Dashboard
                                    </Link>
                                ) : (
                                    <>
                                        <Link
                                            href={login()}
                                            className="rounded-lg px-6 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
                                        >
                                            Log in
                                        </Link>
                                        {canRegister && (
                                            <Link
                                                href={register()}
                                                className="rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-2.5 text-sm font-medium text-white shadow-lg shadow-blue-500/50 transition-all hover:shadow-xl hover:shadow-blue-500/50 hover:scale-105"
                                            >
                                                Get Started
                                            </Link>
                                        )}
                                    </>
                                )}
                            </nav>
                        </div>
                    </div>
                </header>

                {/* Hero Section */}
                <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
                    <motion.div 
                        className="text-center"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <motion.h1 
                            className="mb-6 text-5xl font-bold tracking-tight text-gray-900 sm:text-6xl md:text-7xl dark:text-white"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                        >
                            Manage Tasks with
                            <span className="block bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                                TaskFlow
                            </span>
                        </motion.h1>
                        <motion.p 
                            className="mx-auto mb-10 max-w-2xl text-lg text-gray-600 sm:text-xl dark:text-gray-300"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.8, delay: 0.4 }}
                        >
                            A powerful, role-based task management system designed for teams.
                            Assign tasks, track progress, and boost productivity with real-time updates.
                        </motion.p>
                        <motion.div 
                            className="flex flex-wrap items-center justify-center gap-4"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.6 }}
                        >
                            {!auth.user && (
                                <>
                                    {canRegister && (
                                        <Link
                                            href={register()}
                                            className="rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-4 text-base font-medium text-white shadow-lg shadow-blue-500/50 transition-all hover:shadow-xl hover:shadow-blue-500/50 hover:scale-105"
                                        >
                                            Start Free Today
                                        </Link>
                                    )}
                                    <Link
                                        href={login()}
                                        className="rounded-lg border-2 border-gray-300 bg-white px-8 py-4 text-base font-medium text-gray-700 transition-all hover:border-gray-400 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:hover:border-gray-500 dark:hover:bg-gray-700"
                                    >
                                        Sign In
                                    </Link>
                                </>
                            )}
                        </motion.div>
                    </motion.div>
                </section>

                {/* Features Grid */}
                <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
                    <motion.div 
                        className="mb-16 text-center"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <h2 className="mb-4 text-3xl font-bold text-gray-900 sm:text-4xl dark:text-white">
                            Everything you need to stay organized
                        </h2>
                        <p className="mx-auto max-w-2xl text-lg text-gray-600 dark:text-gray-300">
                            Powerful features designed to help your team collaborate and achieve more
                        </p>
                    </motion.div>

                    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                        {/* Feature 1 */}
                        <motion.div 
                            className="group rounded-2xl border border-gray-200 bg-white p-8 shadow-lg transition-all hover:shadow-2xl hover:scale-105 dark:border-gray-700 dark:bg-gray-800"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                        >
                            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-blue-600">
                                <Users className="h-6 w-6 text-white" />
                            </div>
                            <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
                                Role-Based Access
                            </h3>
                            <p className="text-gray-600 dark:text-gray-300">
                                Project managers assign tasks to team members. Developers see only their assigned work.
                            </p>
                        </motion.div>

                        {/* Feature 2 */}
                        <motion.div 
                            className="group rounded-2xl border border-gray-200 bg-white p-8 shadow-lg transition-all hover:shadow-2xl hover:scale-105 dark:border-gray-700 dark:bg-gray-800"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                        >
                            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-indigo-600">
                                <Zap className="h-6 w-6 text-white" />
                            </div>
                            <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
                                Real-Time Updates
                            </h3>
                            <p className="text-gray-600 dark:text-gray-300">
                                Smart polling system refreshes only when data changes. Get instant notifications for new tasks.
                            </p>
                        </motion.div>

                        {/* Feature 3 */}
                        <motion.div 
                            className="group rounded-2xl border border-gray-200 bg-white p-8 shadow-lg transition-all hover:shadow-2xl hover:scale-105 dark:border-gray-700 dark:bg-gray-800"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                        >
                            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500 to-purple-600">
                                <BarChart3 className="h-6 w-6 text-white" />
                            </div>
                            <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
                                Analytics Dashboard
                            </h3>
                            <p className="text-gray-600 dark:text-gray-300">
                                Track completion rates, task status, and priority levels with beautiful visualizations.
                            </p>
                        </motion.div>

                        {/* Feature 4 */}
                        <motion.div 
                            className="group rounded-2xl border border-gray-200 bg-white p-8 shadow-lg transition-all hover:shadow-2xl hover:scale-105 dark:border-gray-700 dark:bg-gray-800"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.4 }}
                        >
                            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-green-500 to-green-600">
                                <CheckCircle2 className="h-6 w-6 text-white" />
                            </div>
                            <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
                                Task Management
                            </h3>
                            <p className="text-gray-600 dark:text-gray-300">
                                Create, assign, and track tasks with subtasks, priorities, and due dates.
                            </p>
                        </motion.div>

                        {/* Feature 5 */}
                        <motion.div 
                            className="group rounded-2xl border border-gray-200 bg-white p-8 shadow-lg transition-all hover:shadow-2xl hover:scale-105 dark:border-gray-700 dark:bg-gray-800"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.5 }}
                        >
                            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-orange-500 to-orange-600">
                                <Clock className="h-6 w-6 text-white" />
                            </div>
                            <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
                                Deadline Tracking
                            </h3>
                            <p className="text-gray-600 dark:text-gray-300">
                                Never miss a deadline with upcoming task alerts and overdue notifications.
                            </p>
                        </motion.div>

                        {/* Feature 6 */}
                        <motion.div 
                            className="group rounded-2xl border border-gray-200 bg-white p-8 shadow-lg transition-all hover:shadow-2xl hover:scale-105 dark:border-gray-700 dark:bg-gray-800"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.6 }}
                        >
                            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-red-500 to-red-600">
                                <Shield className="h-6 w-6 text-white" />
                            </div>
                            <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
                                Secure & Private
                            </h3>
                            <p className="text-gray-600 dark:text-gray-300">
                                Two-factor authentication and role-based security keep your data safe.
                            </p>
                        </motion.div>
                    </div>
                </section>

                {/* Stats Section */}
                <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
                    <motion.div 
                        className="rounded-3xl bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 p-12 shadow-2xl"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="grid gap-8 md:grid-cols-4">
                            <div className="text-center">
                                <motion.div 
                                    className="mb-2 text-5xl font-bold text-white"
                                    initial={{ scale: 0 }}
                                    whileInView={{ scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: 0.2 }}
                                >
                                    {stats.users.toLocaleString()}+
                                </motion.div>
                                <div className="text-blue-100">Active Users</div>
                            </div>
                            <div className="text-center">
                                <motion.div 
                                    className="mb-2 text-5xl font-bold text-white"
                                    initial={{ scale: 0 }}
                                    whileInView={{ scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: 0.3 }}
                                >
                                    {stats.tasks.toLocaleString()}+
                                </motion.div>
                                <div className="text-blue-100">Tasks Completed</div>
                            </div>
                            <div className="text-center">
                                <motion.div 
                                    className="mb-2 text-5xl font-bold text-white"
                                    initial={{ scale: 0 }}
                                    whileInView={{ scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: 0.4 }}
                                >
                                    {stats.teams.toLocaleString()}+
                                </motion.div>
                                <div className="text-blue-100">Teams Powered</div>
                            </div>
                            <div className="text-center">
                                <motion.div 
                                    className="mb-2 text-5xl font-bold text-white"
                                    initial={{ scale: 0 }}
                                    whileInView={{ scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: 0.5 }}
                                >
                                    {stats.completion}%
                                </motion.div>
                                <div className="text-blue-100">Satisfaction Rate</div>
                            </div>
                        </div>
                    </motion.div>
                </section>

                {/* Testimonials Section */}
                <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
                    <motion.div 
                        className="mb-16 text-center"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <h2 className="mb-4 text-3xl font-bold text-gray-900 sm:text-4xl dark:text-white">
                            Loved by teams worldwide
                        </h2>
                        <p className="mx-auto max-w-2xl text-lg text-gray-600 dark:text-gray-300">
                            See what our users have to say about TaskFlow
                        </p>
                    </motion.div>

                    <div className="grid gap-8 md:grid-cols-3">
                        <motion.div 
                            className="rounded-2xl border border-gray-200 bg-white p-8 shadow-lg dark:border-gray-700 dark:bg-gray-800"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                        >
                            <div className="mb-4 flex gap-1">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                                ))}
                            </div>
                            <p className="mb-4 text-gray-700 dark:text-gray-300">
                                "TaskFlow transformed how our development team collaborates. The role-based system is exactly what we needed!"
                            </p>
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 text-white font-semibold">
                                    JS
                                </div>
                                <div>
                                    <div className="font-semibold text-gray-900 dark:text-white">John Smith</div>
                                    <div className="text-sm text-gray-600 dark:text-gray-400">Tech Lead at StartupCo</div>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div 
                            className="rounded-2xl border border-gray-200 bg-white p-8 shadow-lg dark:border-gray-700 dark:bg-gray-800"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                        >
                            <div className="mb-4 flex gap-1">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                                ))}
                            </div>
                            <p className="mb-4 text-gray-700 dark:text-gray-300">
                                "The real-time updates and analytics dashboard help us stay on track. Best task manager we've used!"
                            </p>
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-pink-500 text-white font-semibold">
                                    SD
                                </div>
                                <div>
                                    <div className="font-semibold text-gray-900 dark:text-white">Sarah Davis</div>
                                    <div className="text-sm text-gray-600 dark:text-gray-400">Project Manager at TechCorp</div>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div 
                            className="rounded-2xl border border-gray-200 bg-white p-8 shadow-lg dark:border-gray-700 dark:bg-gray-800"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                        >
                            <div className="mb-4 flex gap-1">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                                ))}
                            </div>
                            <p className="mb-4 text-gray-700 dark:text-gray-300">
                                "Intuitive interface, powerful features. TaskFlow helped us increase productivity by 40%!"
                            </p>
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-green-500 to-teal-500 text-white font-semibold">
                                    MJ
                                </div>
                                <div>
                                    <div className="font-semibold text-gray-900 dark:text-white">Michael Johnson</div>
                                    <div className="text-sm text-gray-600 dark:text-gray-400">CEO at InnovateLab</div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* Why Choose Us Section */}
                <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
                    <div className="grid gap-12 lg:grid-cols-2 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                        >
                            <h2 className="mb-6 text-3xl font-bold text-gray-900 sm:text-4xl dark:text-white">
                                Why teams choose TaskFlow
                            </h2>
                            <div className="space-y-6">
                                <div className="flex gap-4">
                                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900">
                                        <TrendingUp className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                                    </div>
                                    <div>
                                        <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
                                            Boost Productivity
                                        </h3>
                                        <p className="text-gray-600 dark:text-gray-300">
                                            Streamlined workflows and automated notifications keep your team focused on what matters most.
                                        </p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-indigo-100 dark:bg-indigo-900">
                                        <Target className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                                    </div>
                                    <div>
                                        <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
                                            Stay Organized
                                        </h3>
                                        <p className="text-gray-600 dark:text-gray-300">
                                            Prioritize tasks, set deadlines, and track progress with our intuitive interface.
                                        </p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900">
                                        <Award className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                                    </div>
                                    <div>
                                        <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
                                            Achieve More Together
                                        </h3>
                                        <p className="text-gray-600 dark:text-gray-300">
                                            Collaborate seamlessly with team members and celebrate milestones together.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            className="rounded-3xl bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 p-12 shadow-2xl"
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                        >
                            <div className="space-y-6 text-white">
                                <div className="flex items-center gap-4">
                                    <CheckCircle2 className="h-8 w-8 shrink-0" />
                                    <span className="text-lg">Easy to set up in minutes</span>
                                </div>
                                <div className="flex items-center gap-4">
                                    <CheckCircle2 className="h-8 w-8 shrink-0" />
                                    <span className="text-lg">No credit card required</span>
                                </div>
                                <div className="flex items-center gap-4">
                                    <CheckCircle2 className="h-8 w-8 shrink-0" />
                                    <span className="text-lg">24/7 customer support</span>
                                </div>
                                <div className="flex items-center gap-4">
                                    <CheckCircle2 className="h-8 w-8 shrink-0" />
                                    <span className="text-lg">Regular updates & improvements</span>
                                </div>
                                <div className="flex items-center gap-4">
                                    <CheckCircle2 className="h-8 w-8 shrink-0" />
                                    <span className="text-lg">Secure & GDPR compliant</span>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* CTA Section */}
                {!auth.user && (
                    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
                        <motion.div 
                            className="rounded-3xl bg-gradient-to-r from-blue-600 to-indigo-600 p-12 shadow-2xl"
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                        >
                            <div className="text-center">
                                <h2 className="mb-4 text-3xl font-bold text-white sm:text-4xl">
                                    Ready to boost your productivity?
                                </h2>
                                <p className="mx-auto mb-8 max-w-2xl text-lg text-blue-100">
                                    Join teams who are already managing their tasks smarter with TaskFlow
                                </p>
                                {canRegister && (
                                    <Link
                                        href={register()}
                                        className="inline-block rounded-lg bg-white px-8 py-4 text-base font-medium text-blue-600 shadow-lg transition-all hover:bg-gray-50 hover:scale-105"
                                    >
                                        Get Started Free
                                    </Link>
                                )}
                            </div>
                        </motion.div>
                    </section>
                )}

                {/* Footer */}
                <footer className="border-t border-gray-200 bg-white/50 backdrop-blur-lg dark:border-gray-700 dark:bg-gray-900/50">
                    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                        <p className="text-center text-sm text-gray-600 dark:text-gray-400">
                            &copy; {new Date().getFullYear()} TaskFlow. All rights reserved.
                        </p>
                    </div>
                </footer>
            </div>
        </>
    );
}
