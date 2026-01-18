// Centralized mock data generator for all features

export const generateActivityData = (days: number = 7) => {
    const data: { day: string; hour: number; minutes: number; language: string }[] = [];
    const dayNames = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    const languages = ["JavaScript", "Python", "TypeScript", "Java", "Go"];

    for (let d = 0; d < days; d++) {
        for (let h = 0; h < 24; h++) {
            // More activity during work hours (9-18)
            const isWorkHour = h >= 9 && h <= 18;
            const isWeekend = d >= 5;

            let minutes = 0;
            if (!isWeekend && isWorkHour) {
                minutes = Math.random() > 0.3 ? Math.floor(Math.random() * 120) + 30 : 0;
            } else if (!isWeekend) {
                minutes = Math.random() > 0.7 ? Math.floor(Math.random() * 60) : 0;
            } else {
                minutes = Math.random() > 0.8 ? Math.floor(Math.random() * 90) : 0;
            }

            data.push({
                day: dayNames[d],
                hour: h,
                minutes,
                language: languages[Math.floor(Math.random() * languages.length)]
            });
        }
    }

    return data;
};

export const generateCommitData = () => {
    return [
        {
            sha: "abc123def456",
            message: "Add user authentication system",
            date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
            repository: "awesome-project",
            filesChanged: 3,
            additions: 245,
            deletions: 12
        },
        {
            sha: "def456ghi789",
            message: "Fix memory leak in data processing",
            date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
            repository: "data-pipeline",
            filesChanged: 2,
            additions: 67,
            deletions: 34
        },
        {
            sha: "ghi789jkl012",
            message: "Implement dark mode toggle",
            date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
            repository: "portfolio-v2",
            filesChanged: 5,
            additions: 189,
            deletions: 23
        }
    ];
};

export const generateCodeDiff = () => {
    return `--- a/auth/login.js
+++ b/auth/login.js
@@ -1,10 +1,15 @@
 import bcrypt from 'bcrypt';
+import jwt from 'jsonwebtoken';
 
 export async function login(email, password) {
   const user = await findUserByEmail(email);
   
   if (!user) {
-    throw new Error('User not found');
+    return { success: false, error: 'Invalid credentials' };
   }
   
-  const isValid = await bcrypt.compare(password, user.password);
-  return isValid;
+  const isValid = await bcrypt.compare(password, user.passwordHash);
+  
+  if (isValid) {
+    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET);
+    return { success: true, token };
+  }
+  
+  return { success: false, error: 'Invalid credentials' };
 }`;
};

export const generateSkillTreeData = () => {
    return {
        nodes: [
            { id: "root", label: "Full Stack Developer", status: "current", level: 15, xp: 4580, maxXp: 5000, category: "general" },
            { id: "html-css", label: "HTML/CSS", status: "mastered", level: 10, xp: 2500, maxXp: 2500, category: "frontend" },
            { id: "javascript", label: "JavaScript", status: "mastered", level: 10, xp: 2500, maxXp: 2500, category: "frontend" },
            { id: "react", label: "React", status: "learning", level: 7, xp: 1750, maxXp: 2500, category: "frontend" },
            { id: "nextjs", label: "Next.js", status: "locked", level: 0, xp: 0, maxXp: 2500, category: "frontend" },
            { id: "nodejs", label: "Node.js", status: "mastered", level: 9, xp: 2250, maxXp: 2500, category: "backend" },
            { id: "express", label: "Express", status: "learning", level: 6, xp: 1500, maxXp: 2500, category: "backend" },
            { id: "mongodb", label: "MongoDB", status: "learning", level: 5, xp: 1250, maxXp: 2500, category: "database" },
            { id: "docker", label: "Docker", status: "locked", level: 0, xp: 0, maxXp: 2500, category: "devops" }
        ],
        edges: [
            { from: "root", to: "html-css" },
            { from: "html-css", to: "javascript" },
            { from: "javascript", to: "react" },
            { from: "react", to: "nextjs" },
            { from: "root", to: "nodejs" },
            { from: "nodejs", to: "express" },
            { from: "express", to: "mongodb" },
            { from: "nodejs", to: "docker" }
        ]
    };
};

export const generateChatMessages = () => {
    return [
        {
            id: "1",
            type: "ai",
            content: "Hi! I'm your AI coding mentor. What would you like to learn today?",
            timestamp: new Date(Date.now() - 10 * 60 * 1000).toISOString()
        },
        {
            id: "2",
            type: "user",
            content: "I want to understand React hooks better",
            timestamp: new Date(Date.now() - 9 * 60 * 1000).toISOString()
        },
        {
            id: "3",
            type: "ai",
            content: "Great choice! React Hooks are powerful. Let's start with useState. Here's an example:",
            code: "const [count, setCount] = useState(0);\n\nfunction increment() {\n  setCount(count + 1);\n}",
            language: "javascript",
            timestamp: new Date(Date.now() - 8 * 60 * 1000).toISOString()
        }
    ];
};

export const generateRoomParticipants = () => {
    return [
        {
            userId: "user1",
            displayName: "Alice Chen",
            role: "host",
            cursorColor: "#E74C3C",
            isActive: true,
            avatar: "",
            status: "online"
        },
        {
            userId: "user2",
            displayName: "Bob Smith",
            role: "participant",
            cursorColor: "#3498DB",
            isActive: true,
            avatar: "",
            status: "online"
        },
        {
            userId: "user3",
            displayName: "Carol Johnson",
            role: "participant",
            cursorColor: "#2ECC71",
            isActive: false,
            avatar: "",
            status: "away"
        }
    ];
};
