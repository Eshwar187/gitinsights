import { motion, AnimatePresence } from "framer-motion";
import { type ReactNode } from "react";
import { useLocation } from "react-router-dom";

interface PageTransitionProps {
    children: ReactNode;
}

const variants = {
    initial: { opacity: 0, y: 20, scale: 0.98 },
    enter: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
            duration: 0.4,
            ease: [0.61, 1, 0.88, 1] as [number, number, number, number],
            staggerChildren: 0.1
        }
    },
    exit: {
        opacity: 0,
        y: -20,
        scale: 0.98,
        transition: {
            duration: 0.3,
            ease: [0.61, 1, 0.88, 1] as [number, number, number, number]
        }
    }
};

export const PageTransition: React.FC<PageTransitionProps> = ({ children }) => {
    const location = useLocation();

    return (
        <AnimatePresence mode="wait">
            <motion.div
                key={location.pathname}
                initial="initial"
                animate="enter"
                exit="exit"
                variants={variants}
                className="h-full w-full"
            >
                {children}
            </motion.div>
        </AnimatePresence>
    );
};
