import { Trophy } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card";
import { Badge } from "../ui/Badge";

export function DeveloperScore() {
    return (
        <Card className="col-span-3 lg:col-span-1 bg-gradient-to-br from-blue-600 to-indigo-600 text-white border-0 dark:from-blue-900 dark:to-indigo-900">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-blue-100">Dev Score</CardTitle>
                <Trophy className="h-4 w-4 text-yellow-300" />
            </CardHeader>
            <CardContent>
                <div className="flex flex-col items-center justify-center space-y-4 py-2">
                    <div className="text-5xl font-bold">850</div>
                    <Badge variant="secondary" className="bg-white/20 text-white hover:bg-white/30 border-0">
                        Elite Developer
                    </Badge>
                    <p className="text-xs text-blue-100 text-center">
                        Top 5% globally
                    </p>
                </div>
                <div className="mt-4 space-y-2">
                    <div className="text-xs flex justify-between text-blue-100">
                        <span>Code Quality</span>
                        <span>9.2/10</span>
                    </div>
                    <div className="h-1.5 w-full bg-black/20 rounded-full overflow-hidden">
                        <div className="h-full bg-white/80 w-[92%] rounded-full" />
                    </div>
                    <div className="text-xs flex justify-between text-blue-100">
                        <span>Consistency</span>
                        <span>8.8/10</span>
                    </div>
                    <div className="h-1.5 w-full bg-black/20 rounded-full overflow-hidden">
                        <div className="h-full bg-white/80 w-[88%] rounded-full" />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
