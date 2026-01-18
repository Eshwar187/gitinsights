import { useState } from "react";
import { SkillsSummaryHeader } from "../components/skills/SkillsSummaryHeader";
import { SkillTreeVisualization } from "../components/skills/SkillTreeVisualization";
import { SkillDetailsPanel } from "../components/skills/SkillDetailsPanel";
import { generateSkillTreeData } from "../utils/mockData";

export default function SkillTree() {
    const [selectedSkillId, setSelectedSkillId] = useState<string | null>(null);
    const { nodes } = generateSkillTreeData();

    const selectedSkill = selectedSkillId
        ? nodes.find(n => n.id === selectedSkillId) || null
        : null;

    return (
        <div className="flex flex-col h-[calc(100vh-4rem)]">
            <SkillsSummaryHeader />

            <div className="flex-1 overflow-hidden p-6 bg-slate-50 dark:bg-slate-950/50">
                <div className="max-w-7xl mx-auto h-full grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* Main Tree Visual (Left 2/3) */}
                    <div className="lg:col-span-2 h-full min-h-[500px]">
                        <h2 className="text-lg font-semibold mb-4 text-slate-700 dark:text-slate-300">Skill Map</h2>
                        <SkillTreeVisualization onSelectSkill={setSelectedSkillId} />
                    </div>

                    {/* Details Panel (Right 1/3) */}
                    <div className="h-full overflow-hidden">
                        <SkillDetailsPanel skill={selectedSkill} />
                    </div>

                </div>
            </div>
        </div>
    );
}
