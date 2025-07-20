"use client"

import { ChangeEvent, Dispatch, SetStateAction, useEffect, useState } from "react"
import { MenuCard } from "@/database/page"
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, TextField, Typography } from "@mui/material"
import { useSearchParams } from "next/navigation"
import { OrderData } from "@/app/menu/MenuClient"

export interface ItemOrderDialogProps {
    openOrderModal: boolean
    setOpenOrderModal: Dispatch<SetStateAction<boolean>>
    activeMenuItem: MenuCard | null
    setActiveMenuItem: Dispatch<SetStateAction<MenuCard | null>>
    setOrderData: Dispatch<SetStateAction<OrderData>>
}

export default function ItemOrderDialog({ openOrderModal, setOpenOrderModal, activeMenuItem, setActiveMenuItem, setOrderData }: ItemOrderDialogProps) {
    const [tempQuantity, setTempQuantity] = useState<number>(0)
    const [tempNote, setTempNote] = useState("")
    const [hydrated, setHydrated] = useState(false)

    const searchParams = useSearchParams()

    const handleOnChangeQuantity = (e: ChangeEvent<HTMLInputElement>,) => {
        const val = Number(e.target.value.replace(/^0+(?!$)/, ""))
        if (val < 1) setTempNote("")
        if (!isNaN(val) && val >= 0) setTempQuantity(val)
    }

    const handleSaveOrderModal = (tempQuantity: number, tempNote: string) => {
        if (!activeMenuItem) return

        setOrderData(prev => {
            const newQuantities = { ...prev.quantities }
            const newNotes = { ...prev.notes }

            if (tempQuantity > 0) {
                newQuantities[activeMenuItem.title] = tempQuantity
                newNotes[activeMenuItem.title] = tempNote
            } else {
                delete newQuantities[activeMenuItem.title]
                delete newNotes[activeMenuItem.title]
            }

            return {
                ...prev,
                quantities: newQuantities,
                notes: newNotes,
            }
        })
        setOpenOrderModal(false)
    }

    useEffect(() => {
        const stored = sessionStorage.getItem('orderData')
        if (stored) {
            setOrderData(JSON.parse(stored))
        } else {
            setOrderData({
                quantities: {},
                notes: {},
                tableNumber: searchParams.get('tableNo') || '01',
            })
        }
    }, [])

    // useEffect(() => {
    //     if (typeof window === "undefined") return

    //     try {
    //         const stored = sessionStorage.getItem("orderData")
    //         if (stored) {
    //             const parsed = JSON.parse(stored)
    //             setOrderData((prev) => ({
    //                 ...prev,
    //                 ...parsed,
    //                 tableNumber: searchParams.get("tableNo") || parsed.tableNumber || "01",
    //             }))
    //         }
    //     } catch (err) {
    //         console.warn("Failed to parse session orderData:", err)
    //     } finally {
    //         setHydrated(true)
    //     }
    // }, [searchParams])
    return (
        <Dialog
            open={openOrderModal}
            onClose={() => setOpenOrderModal(false)}
            fullWidth
            maxWidth="sm"
            PaperProps={{ sx: { borderRadius: '1rem', p: 2 } }}
            BackdropProps={{
                sx: {
                    backgroundColor: 'rgba(0, 0, 0, 0.3)'
                }
            }}
        >
            <DialogTitle sx={{ color: '#b82828' }} fontWeight="bold">
                {activeMenuItem?.title}
            </DialogTitle>
            <DialogContent sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', gap: 2 }}>
                <Typography fontSize={14} color="text.secondary">
                    {activeMenuItem?.description}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Typography fontWeight={500}>Jumlah:</Typography>
                    <IconButton onClick={() => setTempQuantity((q) => Math.max(q - 1, 0))}>
                        <Typography fontWeight="bold">-</Typography>
                    </IconButton>
                    <TextField
                        type="number"
                        size="small"
                        value={tempQuantity}
                        inputProps={{ min: 0, style: { textAlign: 'center', width: 50 } }}
                        onChange={handleOnChangeQuantity}
                    />
                    <IconButton onClick={() => setTempQuantity((q) => q + 1)}>
                        <Typography fontWeight="bold">+</Typography>
                    </IconButton>
                </Box>
                <TextField
                    disabled={tempQuantity < 1}
                    label="Catatan"
                    multiline
                    minRows={3}
                    value={tempNote}
                    onChange={(e) => setTempNote(e.target.value)}
                    fullWidth
                />
            </DialogContent>
            <DialogActions sx={{ justifyContent: 'center', gap: 2, pb: 2 }}>
                <Button
                    onClick={() => setOpenOrderModal(false)}
                    sx={{ fontWeight: 'bold', color: '#991f1f', border: '.5px solid #991f1f', borderRadius: '0.75rem', width: 100 }}
                >
                    Batal
                </Button>
                <Button
                    onClick={() => handleSaveOrderModal(tempQuantity, tempNote)}
                    sx={{
                        backgroundColor: '#b82828',
                        color: '#fae89f',
                        borderRadius: '0.75rem',
                        width: 100,
                        '&:hover': { backgroundColor: '#991f1f' },
                        '&:disabled': { backgroundColor: 'rgba(0,0,0,.1)' }
                    }}
                >
                    Simpan
                </Button>
            </DialogActions>
        </Dialog>
    )
}