import { Github, MapPin, Link as LinkIcon } from "lucide-react";
import { Button } from "../components/ui/Button";
import { Card, CardContent } from "../components/ui/Card";
import { ContributionHeatmap } from "../components/charts/ContributionHeatmap";
import { TopLanguages } from "../components/charts/TopLanguages";
import { Badge } from "../components/ui/Badge";

export default function PublicPortfolio() {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto space-y-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div className="flex items-center gap-6">
                        <div className="w-24 h-24 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-2xl font-bold">
                            JD
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold">John Doe</h1>
                            <p className="text-lg text-slate-600 dark:text-slate-400">Full Stack Developer</p>
                            <div className="flex flex-wrap gap-4 mt-2 text-sm text-slate-500">
                                <span className="flex items-center gap-1"><MapPin className="h-4 w-4" /> San Francisco, CA</span>
                                <span className="flex items-center gap-1"><LinkIcon className="h-4 w-4" /> johndoe.com</span>
                                <span className="flex items-center gap-1"><Github className="h-4 w-4" /> @johndoe</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <Button>Follow</Button>
                        <Button variant="outline">Contact</Button>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Card>
                        <CardContent className="p-4 text-center">
                            <div className="text-2xl font-bold">1.2k</div>
                            <div className="text-xs text-slate-500">Commits</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-4 text-center">
                            <div className="text-2xl font-bold">42</div>
                            <div className="text-xs text-slate-500">Repositories</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-4 text-center">
                            <div className="text-2xl font-bold">892</div>
                            <div className="text-xs text-slate-500">Stars</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-4 text-center">
                            <div className="text-2xl font-bold">A+</div>
                            <div className="text-xs text-slate-500">Rank</div>
                        </CardContent>
                    </Card>
                </div>

                {/* Heatmap */}
                <Card>
                    <CardContent className="p-6">
                        <h3 className="text-lg font-semibold mb-4">Contribution Graph</h3>
                        <ContributionHeatmap />
                    </CardContent>
                </Card>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-1">
                        <TopLanguages />
                    </div>
                    <div className="md:col-span-2 space-y-4">
                        <h3 className="text-lg font-semibold">Featured Projects</h3>
                        {[1, 2, 3].map(i => (
                            <Card key={i}>
                                <CardContent className="p-6">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h4 className="font-semibold text-blue-600">Project Name {i}</h4>
                                            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                                                A brief description of this awesome project and what it does.
                                            </p>
                                            <div className="flex gap-2 mt-3">
                                                <Badge variant="secondary">TypeScript</Badge>
                                                <Badge variant="secondary">React</Badge>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-1 text-xs text-slate-500">
                                            45 <span className="opacity-50">★</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
