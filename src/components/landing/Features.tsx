import { BarChart2, Brain, Layout, Award } from "lucide-react";

const features = [
    {
        name: 'Deep Analytics',
        description:
            'Gain insights into your coding habits, peak productivity hours, and language proficiency trends.',
        icon: BarChart2,
    },
    {
        name: 'AI-Powered Insights',
        description:
            'Get personalized recommendations to improve your code quality and consistency from our AI engine.',
        icon: Brain,
    },
    {
        name: 'One-Click Portfolio',
        description:
            'Generate a beautiful, professional portfolio website from your GitHub profile in seconds.',
        icon: Layout,
    },
    {
        name: 'Developer Ranking',
        description:
            'Compare your performance with global standards and earn badges as you level up your skills.',
        icon: Award,
    },
];

export function Features() {
    return (
        <div className="bg-white py-24 sm:py-32 dark:bg-slate-950">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="mx-auto max-w-2xl lg:text-center">
                    <h2 className="text-base font-semibold leading-7 text-blue-600">Everything you need</h2>
                    <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
                        Supercharge your developer profile
                    </p>
                    <p className="mt-6 text-lg leading-8 text-slate-600 dark:text-slate-400">
                        GitInsights provides all the tools you need to understand your growth and showcase your talent to the world.
                    </p>
                </div>
                <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
                    <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-y-16">
                        {features.map((feature) => (
                            <div key={feature.name} className="relative pl-16">
                                <dt className="text-base font-semibold leading-7 text-slate-900 dark:text-white">
                                    <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600">
                                        <feature.icon className="h-6 w-6 text-white" aria-hidden="true" />
                                    </div>
                                    {feature.name}
                                </dt>
                                <dd className="mt-2 text-base leading-7 text-slate-600 dark:text-slate-400">{feature.description}</dd>
                            </div>
                        ))}
                    </dl>
                </div>
            </div>
        </div>
    );
}
