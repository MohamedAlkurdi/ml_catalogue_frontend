'use client'
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { HugeiconsIcon } from '@hugeicons/react';
import { ChartScatterIcon, Tree07Icon, PieChart06Icon , Home09Icon, Call02Icon, Menu01Icon, Cancel01Icon } from '@hugeicons/core-free-icons';
import { useLocale } from "@/app/lib/i18n_context";
import useTranslation from "@/app/lib/useTranslation";
import Link from "next/link";

export default function SideNavigation() {
    const locale = useLocale()
    const translation = useTranslation(locale)
    const sections = translation.navigation
    const [open, setOpen] = useState(false);

    useEffect(() => {
        const handleEsc = (event) => {
            if (event.key === 'Escape') {
                setOpen(false);
            }
        };

        window.addEventListener('keydown', handleEsc);

        return () => {
            window.removeEventListener('keydown', handleEsc);
        };
    }, []);

    useEffect(() => {
        if (open) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [open]);

    let icons = {
        "home": Home09Icon,
        "knn": ChartScatterIcon,
        "decision-tree": Tree07Icon,
        "naive-bayes": PieChart06Icon ,
        "contact": Call02Icon
    };

    return (
        <>
            <button
                onClick={() => setOpen(!open)}
                className={`fixed top-3 ${locale == "ar" ? "right-3" : "left-3"} z-50 p-2 btn-color rounded-full shadow-lg`}
                aria-label="Toggle navigation"
            >
                <motion.div
                    initial={false}
                    animate={{ rotate: open ? 180 : 0 }}
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                >
                    {open ? (
                        <HugeiconsIcon icon={Cancel01Icon} size={24} className=" text-secondary cursor-pointer" />
                    ) : (
                        <HugeiconsIcon icon={Menu01Icon} size={24} className=" text-secondary cursor-pointer" />
                    )}
                </motion.div>
            </button>
            < AnimatePresence >
                {open && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="fixed inset-0 bg-opacity-50 backdrop-blur-sm z-40"
                        onClick={() => setOpen(false)}
                    />
                )
                }
            </AnimatePresence >

            < AnimatePresence >
                {open && (
                    <motion.div
                        initial={{ x: locale == 'ar' ? "100%" : "-100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: locale == 'ar' ? "100%" : "-100%" }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        className={`fixed inset-y-0 ${locale == "ar" ? "right-0" : "left-0"} w-full sm:w-80 lg:w-1/4 bg-primary z-40 shadow-xl flex flex-col`}
                        dir={locale == 'ar' ? "rtl" : "ltr"}
                    >
                        <div className="p-6 flex flex-col h-full bg-secondary text-white pt-16 shadow-lg">
                            <nav className="flex-1">
                                <ul className="space-y-4">
                                    {sections.map((item, index) => (
                                        <motion.li
                                            key={index}
                                            initial={{ opacity: 0, x: locale == 'ar' ? 100 : -100 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ duration: 0.5, delay: 0.1 * index }}
                                            className="relative"
                                        >
                                            <Link
                                                href={item.title === "Developer"
                                                    ? "https://muhammedalkurdiportfolio.vercel.app/en"
                                                    : `/${locale}/${item.href}`}
                                                onClick={() => setOpen(false)}
                                                prefetch={true}
                                                className="flex items-center gap-4 p-4 rounded-lg side-nav-item transition-colors group"
                                            >
                                                <motion.div
                                                    whileHover={{ scale: 1.2 }}
                                                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                                                    className="text-lightest dark:text-gray-300  group-hover:text-darkest"
                                                >
                                                    <HugeiconsIcon icon={icons[item.icon]} size={24} />
                                                </motion.div>
                                                <span className="text-lightest font-medium group-hover:text-darkest">
                                                    {item.title}
                                                </span>
                                            </Link>
                                        </motion.li>
                                    ))}
                                </ul>
                            </nav>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence >
        </>
    );
}
