"use client"

import { useState } from "react"
import {
    Box,
    Typography,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Snackbar,
    Alert
} from "@mui/material"
import { useRouter } from "next/navigation"

interface SubmitMenuUpdateProps {
    isMobile: boolean
}

export default function SubmitMenuUpdate({ isMobile }: SubmitMenuUpdateProps) {
    const [open, setOpen] = useState(false)
    const [snackbarOpen, setSnackbarOpen] = useState(false)
    const router = useRouter()
    const onSubmit = async () => {
        const stored = localStorage.getItem("menuCategory")
        if (!stored || JSON.parse(stored).length < 1) {
            return alert("Tidak terdapat perubahan")
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

        localStorage.removeItem("menuCategory")
        setSnackbarOpen(true)
        setTimeout(() => {
            router.push("/home")
        }, 2000)
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
                        fontSize: 18,
                        fontWeight: 600
                    }}
                >
                    Konfirmasi Perubahan
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
                        <Typography textAlign={"center"} fontSize='normal'>Apakah <b>CICA</b> yakin dengan perubahan yang sudah dibuat? <br /><br /> Tekan <b>YAKIN BANG!</b> jika sudah yakin. Tekan batal untuk kembali edit data!</Typography>
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
                            fontWeight: 600,
                            width: 200,
                            '&:hover': { backgroundColor: '#991f1f' },
                            '&:disabled': { backgroundColor: 'rgba(0,0,0,.1)' }
                        }}
                    >
                        YAKIN BANG!
                    </Button>
                </DialogActions>
            </Dialog>
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={4000}
                onClose={() => setSnackbarOpen(false)}
                anchorOrigin={{ vertical: "top", horizontal: "center" }}
            >
                <Alert
                    onClose={() => setSnackbarOpen(false)}
                    severity="success"
                    variant="filled"
                    sx={{
                        background: "linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)",
                        color: "#fff",
                        fontWeight: "bold",
                    }}
                >
                    Menu sedang di‐update… Sebentar lagi kita pindah ke beranda.
                </Alert>
            </Snackbar>
        </>
    )
}
