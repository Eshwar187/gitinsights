import { Wrench, RefreshCw } from "lucide-react";
import { Button } from "../components/ui/Button";

export default function MaintenancePage() {
    return (
        <div className="min-h-screen bg-[#0c1222] flex items-center justify-center p-4">
            {/* Background Gradients */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-amber-600/5 rounded-full blur-[100px]" />
                <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-rose-600/5 rounded-full blur-[100px]" />
            </div>

            <div className="relative z-10 text-center max-w-lg">
                <div className="inline-flex p-4 bg-amber-500/10 rounded-full mb-6">
                    <Wrench className="h-12 w-12 text-amber-500 animate-pulse" />
                </div>

                <h1 className="text-4xl font-bold text-white mb-4">
                    Under Maintenance
                </h1>

                <p className="text-lg text-slate-400 mb-8">
                    We're currently performing scheduled maintenance to improve GitInsights.
                    We'll be back shortly!
                </p>

                <div className="space-y-4">
                    <Button
                        onClick={() => window.location.reload()}
                        className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
                    >
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Try Again
                    </Button>

                    <p className="text-sm text-slate-500">
                        If maintenance takes longer than expected, please check back in a few minutes.
                    </p>
                </div>

                <div className="mt-12 pt-8 border-t border-gray-800/50">
                    <p className="text-xs text-slate-600">
                        Need urgent support? Contact{" "}
                        <a
                            href="mailto:support@gitinsights.com"
                            className="text-amber-400 hover:underline"
                        >
                            support@gitinsights.com
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
}
