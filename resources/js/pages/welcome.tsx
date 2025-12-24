import { dashboard, login, register } from '@/routes';
import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { CheckCircle2, Users, Zap, Shield, BarChart3, Clock } from 'lucide-react';

export default function Welcome({
    canRegister = true,
}: {
    canRegister?: boolean;
}) {
    const { auth } = usePage<SharedData>().props;

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
                    <div className="text-center">
                        <h1 className="mb-6 text-5xl font-bold tracking-tight text-gray-900 sm:text-6xl md:text-7xl dark:text-white">
                            Manage Tasks with
                            <span className="block bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                                TaskFlow
                            </span>
                        </h1>
                        <p className="mx-auto mb-10 max-w-2xl text-lg text-gray-600 sm:text-xl dark:text-gray-300">
                            A powerful, role-based task management system designed for teams.
                            Assign tasks, track progress, and boost productivity with real-time updates.
                        </p>
                        <div className="flex flex-wrap items-center justify-center gap-4">
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
                        </div>
                    </div>
                </section>

                {/* Features Grid */}
                <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
                    <div className="mb-16 text-center">
                        <h2 className="mb-4 text-3xl font-bold text-gray-900 sm:text-4xl dark:text-white">
                            Everything you need to stay organized
                        </h2>
                        <p className="mx-auto max-w-2xl text-lg text-gray-600 dark:text-gray-300">
                            Powerful features designed to help your team collaborate and achieve more
                        </p>
                    </div>

                    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                        {/* Feature 1 */}
                        <div className="group rounded-2xl border border-gray-200 bg-white p-8 shadow-lg transition-all hover:shadow-2xl hover:scale-105 dark:border-gray-700 dark:bg-gray-800">
                            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-blue-600">
                                <Users className="h-6 w-6 text-white" />
                            </div>
                            <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
                                Role-Based Access
                            </h3>
                            <p className="text-gray-600 dark:text-gray-300">
                                Project managers assign tasks to team members. Developers see only their assigned work.
                            </p>
                        </div>

                        {/* Feature 2 */}
                        <div className="group rounded-2xl border border-gray-200 bg-white p-8 shadow-lg transition-all hover:shadow-2xl hover:scale-105 dark:border-gray-700 dark:bg-gray-800">
                            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-indigo-600">
                                <Zap className="h-6 w-6 text-white" />
                            </div>
                            <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
                                Real-Time Updates
                            </h3>
                            <p className="text-gray-600 dark:text-gray-300">
                                Smart polling system refreshes only when data changes. Get instant notifications for new tasks.
                            </p>
                        </div>

                        {/* Feature 3 */}
                        <div className="group rounded-2xl border border-gray-200 bg-white p-8 shadow-lg transition-all hover:shadow-2xl hover:scale-105 dark:border-gray-700 dark:bg-gray-800">
                            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500 to-purple-600">
                                <BarChart3 className="h-6 w-6 text-white" />
                            </div>
                            <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
                                Analytics Dashboard
                            </h3>
                            <p className="text-gray-600 dark:text-gray-300">
                                Track completion rates, task status, and priority levels with beautiful visualizations.
                            </p>
                        </div>

                        {/* Feature 4 */}
                        <div className="group rounded-2xl border border-gray-200 bg-white p-8 shadow-lg transition-all hover:shadow-2xl hover:scale-105 dark:border-gray-700 dark:bg-gray-800">
                            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-green-500 to-green-600">
                                <CheckCircle2 className="h-6 w-6 text-white" />
                            </div>
                            <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
                                Task Management
                            </h3>
                            <p className="text-gray-600 dark:text-gray-300">
                                Create, assign, and track tasks with subtasks, priorities, and due dates.
                            </p>
                        </div>

                        {/* Feature 5 */}
                        <div className="group rounded-2xl border border-gray-200 bg-white p-8 shadow-lg transition-all hover:shadow-2xl hover:scale-105 dark:border-gray-700 dark:bg-gray-800">
                            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-orange-500 to-orange-600">
                                <Clock className="h-6 w-6 text-white" />
                            </div>
                            <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
                                Deadline Tracking
                            </h3>
                            <p className="text-gray-600 dark:text-gray-300">
                                Never miss a deadline with upcoming task alerts and overdue notifications.
                            </p>
                        </div>

                        {/* Feature 6 */}
                        <div className="group rounded-2xl border border-gray-200 bg-white p-8 shadow-lg transition-all hover:shadow-2xl hover:scale-105 dark:border-gray-700 dark:bg-gray-800">
                            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-red-500 to-red-600">
                                <Shield className="h-6 w-6 text-white" />
                            </div>
                            <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
                                Secure & Private
                            </h3>
                            <p className="text-gray-600 dark:text-gray-300">
                                Two-factor authentication and role-based security keep your data safe.
                            </p>
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                {!auth.user && (
                    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
                        <div className="rounded-3xl bg-gradient-to-r from-blue-600 to-indigo-600 p-12 shadow-2xl">
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
                        </div>
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
