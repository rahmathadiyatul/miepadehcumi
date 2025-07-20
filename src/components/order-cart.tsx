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
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import { OrderData } from "@/app/menu/MenuClient"

interface OrderCartProps {
    orderData: OrderData
    onSubmit: () => void
}

export default function OrderCart({ orderData, onSubmit }: OrderCartProps) {
    const [open, setOpen] = useState(false)

    // ambil array item yang dipesan
    const items = Object.entries(orderData.quantities)
        .filter(([, qty]) => qty > 0)
        .map(([title, qty]) => ({
            title,
            qty,
            note: orderData.notes[title] || ""
        }))

    return (
        <>
            <Box
                tabIndex={0}
                onClick={() => setOpen(true)}
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    position: "fixed",
                    bottom: "4.5rem",
                    left: "1rem",
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
                <ShoppingCartIcon fontSize="small" sx={{ mr: 0.5 }} />
                <Typography fontWeight="bold" variant="caption">
                    Order Sekarang
                </Typography>
            </Box>

            <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="sm">
                <DialogTitle
                    sx={{
                        backgroundColor: '#b82828',
                        color: '#fae89f',
                        fontWeight: 'bold',
                        borderRadius: '10px'
                    }}
                >
                    Daftar Pesanan
                </DialogTitle>
                <DialogContent dividers>
                    {items.length > 0 ? (
                        items.map(item => (
                            <Box
                                key={item.title}
                                sx={{
                                    display: "grid",
                                    gridTemplateColumns: "auto 1fr auto", // Qty | Judul | Note
                                    alignItems: "center",
                                    gap: 2,
                                    mb: 1,
                                }}
                            >
                                <Typography fontWeight={700} textAlign="center">
                                    {item.qty}
                                </Typography>
                                <Typography fontWeight={700}>
                                    {item.title}
                                </Typography>
                                <Typography fontSize="0.875rem" color="text.secondary">
                                    {item.note}
                                </Typography>
                            </Box>
                        ))
                    ) : (
                        <Typography color="text.secondary">
                            Belum ada item di keranjang.
                        </Typography>
                    )}
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <Button
                        sx={{
                            fontWeight: 'bold',
                            color: '#991f1f',
                            border: '.5px solid #991f1f',
                            borderRadius: '0.75rem',
                            width: 100
                        }}
                        onClick={() => setOpen(false)}
                    >
                        Batal
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
                            width: 100,
                            '&:hover': { backgroundColor: '#991f1f' },
                            '&:disabled': { backgroundColor: 'rgba(0,0,0,.1)' }
                        }}
                        disabled={items.length === 0}
                    >
                        Kirim
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    )
}
