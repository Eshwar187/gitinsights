import { Button } from "../components/ui/Button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card";
import { Input } from "../components/ui/Input";
import { Save, Eye, Share2 } from "lucide-react";

export default function Editor() {
    return (
        <div className="h-[calc(100vh-8rem)] flex flex-col md:flex-row gap-6">
            {/* Left Panel - Editor */}
            <div className="w-full md:w-1/3 flex flex-col gap-4 overflow-y-auto pr-2">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold">Editor</h2>
                    <Button size="sm"><Save className="h-4 w-4 mr-2" /> Save</Button>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm">Basic Info</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-xs font-medium">Title</label>
                            <Input defaultValue="John Doe" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-medium">Tagline</label>
                            <Input defaultValue="Full Stack Developer" />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm">Theme</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 gap-2">
                            <div className="h-20 bg-white border border-blue-500 rounded-lg flex items-center justify-center text-xs font-semibold text-blue-600 cursor-pointer">Minimal</div>
                            <div className="h-20 bg-slate-900 border border-transparent hover:border-blue-500 rounded-lg flex items-center justify-center text-xs font-semibold text-white cursor-pointer">Dark</div>
                            <div className="h-20 bg-gradient-to-br from-blue-100 to-indigo-100 border border-transparent hover:border-blue-500 rounded-lg flex items-center justify-center text-xs font-semibold text-blue-900 cursor-pointer">Glass</div>
                            <div className="h-20 bg-white border border-transparent hover:border-blue-500 rounded-lg flex items-center justify-center text-xs font-semibold text-slate-900 cursor-pointer">Professional</div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-sm">Sections</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <div className="flex items-center gap-2">
                            <input type="checkbox" checked readOnly className="rounded border-slate-300" /> <span className="text-sm">Hero</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <input type="checkbox" checked readOnly className="rounded border-slate-300" /> <span className="text-sm">About</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <input type="checkbox" checked readOnly className="rounded border-slate-300" /> <span className="text-sm">Projects</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <input type="checkbox" checked readOnly className="rounded border-slate-300" /> <span className="text-sm">Skills</span>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Right Panel - Preview */}
            <div className="w-full md:w-2/3 flex flex-col gap-4">
                <div className="flex items-center justify-between bg-slate-100 dark:bg-slate-800 p-2 rounded-lg">
                    <div className="flex gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-400" />
                        <div className="w-3 h-3 rounded-full bg-yellow-400" />
                        <div className="w-3 h-3 rounded-full bg-green-400" />
                    </div>
                    <div className="text-xs text-slate-500">portfolio.gitinsights.dev/johndoe</div>
                    <div className="flex gap-2">
                        <Button size="sm" variant="ghost" className="h-6 w-6 p-0"><Eye className="h-4 w-4" /></Button>
                        <Button size="sm" variant="ghost" className="h-6 w-6 p-0"><Share2 className="h-4 w-4" /></Button>
                    </div>
                </div>
                <div className="flex-1 bg-white border border-slate-200 shadow-sm rounded-lg overflow-hidden relative">
                    {/* Mock Preview */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8">
                        <h1 className="text-4xl font-bold">John Doe</h1>
                        <p className="text-xl text-slate-500 mt-2">Full Stack Developer</p>
                        <div className="mt-8 flex gap-4">
                            <Button>View Projects</Button>
                            <Button variant="outline">Contact Me</Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
