"use client"

import { Box, Fade } from "@mui/material"

interface ToTopButtonProps {
    showBackToTop: boolean
}
export default function ToTopButton({ showBackToTop }: ToTopButtonProps) {
    return (
        <Fade in={showBackToTop}>
            <Box
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                tabIndex={0}
                sx={{
                    position: "fixed",
                    bottom: "4.5rem",
                    right: "1rem",
                    zIndex: 100,
                    backgroundColor: "#b82828",
                    color: "#fae89f",
                    padding: "0.5rem 0.75rem",
                    borderRadius: "999px",
                    fontWeight: "bold",
                    fontSize: "0.875rem",
                    cursor: "pointer",
                    transition: "all 0.7s ease-in-out",
                    transform: showBackToTop ? "translateY(0)" : "translateY(20px)",
                    ":hover, :focus, :active": {
                        opacity: 1,
                    },
                }}
            >
                ↑ Top
            </Box>
        </Fade>
    )
}