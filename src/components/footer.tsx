"use client"

import { MenuCategory } from "@/database/page"
import { Box, Typography } from "@mui/material"
import { RefObject } from "react"

interface FooterProps {
    menuCategory: MenuCategory[]
    footerRefs: RefObject<RefObject<HTMLDivElement | null>[]>
    handleScrollToCategory: (categoryTitle: string, index: number) => void
    selectedCategory: string
}

export default function Footer({ menuCategory, footerRefs, handleScrollToCategory, selectedCategory }: FooterProps) {
    return (
        <Box
            sx={{
                display: { xs: "flex", md: "none" },
                flexDirection: "row",
                overflowX: "auto",
                whiteSpace: "nowrap",
                padding: ".5rem 1.25rem",
                gap: 2,
                position: "fixed",
                bottom: 0,
                width: "100vw",
                backgroundColor: "#b82828",
                zIndex: 100,
            }}
        >
            {(menuCategory ?? []).map((menu, index) => (
                <Typography
                    ref={footerRefs.current[index]}
                    onClick={() => handleScrollToCategory(menu.title, index)}
                    sx={{
                        color: "#fae89f",
                        fontWeight: menu.title === selectedCategory ? "bolder" : 350,
                        cursor: "pointer",
                        borderBottom: menu.title === selectedCategory ? "2px solid #fae89f" : "none"
                    }}
                    key={index}
                >
                    {menu.title}
                </Typography>
            ))}
        </Box>
    )
}