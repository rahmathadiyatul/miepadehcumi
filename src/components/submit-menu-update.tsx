"use client"

import { useState } from "react"
import {
    Box,
    Typography,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button
} from "@mui/material"
import { useRouter } from "next/navigation"

interface SubmitMenuUpdateProps {
    isMobile: boolean
}

export default function SubmitMenuUpdate({ isMobile }: SubmitMenuUpdateProps) {
    const [open, setOpen] = useState(false)
    const router = useRouter()
    const onSubmit = async () => {
        const stored = localStorage.getItem("menuCategory")
        if (!stored) {
            return alert("Nothing to submit!")
        }
        const navMain = JSON.parse(stored)

        const res = await fetch("/api/update-menu", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ navMain }),
        })

        if (!res.ok) {
            const err = await res.json().catch(() => ({}))
            console.error("Update failed:", err)
            return alert("Failed to update menu – see console")
        }

        alert("Menu updated! Rebuild should start shortly.")
        router.refresh()
    }

    return (
        <>
            <Box
                tabIndex={0}
                onClick={() => setOpen(true)}
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    position: "fixed",
                    bottom: isMobile ? "4.5rem" : "2rem",
                    left: isMobile ? "1rem" : "auto",
                    right: isMobile ? "auto" : "1rem",
                    zIndex: 100,
                    bgcolor: "#b82828",
                    color: "#fae89f",
                    p: "0.5rem 0.75rem",
                    borderRadius: "999px",
                    fontWeight: "bold",
                    fontSize: "0.875rem",
                    cursor: "pointer",
                    transition: "all 0.7s ease-in-out",
                    ":hover, :focus, :active": { opacity: 1 },
                }}
            >
                <Typography fontWeight="bold" variant="caption">
                    SELESAI UPDATE MENU
                </Typography>
            </Box>

            <Dialog
                open={open}
                onClose={() => setOpen(false)}
                fullWidth
                maxWidth="sm"
                PaperProps={{
                    sx: {
                        borderRadius: '10px',
                    },
                }}
            >
                <DialogTitle
                    sx={{
                        backgroundColor: '#b82828',
                        color: '#fae89f',
                        borderRadius: '10px',
                        fontSize: 18
                    }}
                >
                    KONFIRMASI
                </DialogTitle>
                <DialogContent
                    dividers
                >
                    <Box
                        sx={{
                            display: "grid",
                            gridTemplateColumns: "auto 1fr auto",
                            alignItems: "left",
                            gap: 2,
                            mb: 1,
                        }}
                    >
                        <Typography fontSize='normal'>Apakah <b>ICA</b> yakin dengan perubahan yang sudah dibuat? Tekan <b>YAKIN TUAN</b> jika sudah yakin. Tekan batal untuk kembali edit data</Typography>
                    </Box>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <Button
                        sx={{
                            fontWeight: 'bold',
                            color: '#991f1f',
                            border: '.5px solid #991f1f',
                            borderRadius: '0.75rem',
                            width: 200
                        }}
                        onClick={() => setOpen(false)}
                    >
                        BATAL
                    </Button>
                    <Button
                        variant="contained"
                        onClick={() => {
                            onSubmit()
                            setOpen(false)
                        }}
                        sx={{
                            backgroundColor: '#b82828',
                            color: '#fae89f',
                            borderRadius: '0.75rem',
                            fontWeight: 'bold',
                            width: 200,
                            '&:hover': { backgroundColor: '#991f1f' },
                            '&:disabled': { backgroundColor: 'rgba(0,0,0,.1)' }
                        }}
                    >
                        YAKIN TUAN
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    )
}
