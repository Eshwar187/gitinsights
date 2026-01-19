import { Button } from "../ui/Button";
import { Github } from "lucide-react";

export function Hero() {
    return (
        <div className="relative isolate pt-14 dark:bg-slate-950">
            <div
                className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
                aria-hidden="true"
            >
                <div
                    className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
                    style={{
                        clipPath:
                            "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
                    }}
                />
            </div>
            <div className="py-24 sm:py-32 lg:pb-40">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="mx-auto max-w-2xl text-center">
                        <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-6xl">
                            Transform Your GitHub Activity Into A <span className="text-blue-600">Stunning Portfolio</span>
                        </h1>
                        <p className="mt-6 text-lg leading-8 text-slate-600 dark:text-slate-300">
                            Showcase your work, analyze your contributions, and rank among the best developers with AI-powered insights and professional portfolios.
                        </p>
                        <div className="mt-10 flex items-center justify-center gap-x-6">
                            <a href="http://localhost:5000/api/auth/github">
                                <Button size="lg" className="rounded-full px-8">
                                    <Github className="mr-2 h-5 w-5" />
                                    Connect with GitHub
                                </Button>
                            </a>
                        </div>
                        <div className="mt-8 flex justify-center gap-4 text-sm text-slate-500">
                            <span className="flex items-center gap-1"><Github className="h-4 w-4" /> Trusted by 10,000+ developers</span>
                        </div>
                    </div>
                    <div className="mt-16 flow-root sm:mt-24">
                        <div className="-m-2 rounded-xl bg-slate-900/5 p-2 ring-1 ring-inset ring-slate-900/10 dark:bg-white/5 dark:ring-white/10 lg:-m-4 lg:rounded-2xl lg:p-4">
                            <img
                                src="https://placehold.co/2432x1442/1e293b/white?text=Dashboard+Preview"
                                alt="App screenshot"
                                width={2432}
                                height={1442}
                                className="rounded-md shadow-2xl ring-1 ring-slate-900/10 dark:ring-white/10"
                            />
                        </div>
                    </div>
                </div>
            </div>
            <div
                className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]"
                aria-hidden="true"
            >
                <div
                    className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
                    style={{
                        clipPath:
                            "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
                    }}
                />
            </div>
        </div>
    );
}
