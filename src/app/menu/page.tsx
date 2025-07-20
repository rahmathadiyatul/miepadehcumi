"use client"

import React, { useEffect, useRef, useState, createRef } from "react"
import { Autocomplete, Box, Button, Card, CardContent, CardMedia, TextField, Typography } from "@mui/material"
import { MenuCard, menuData } from "../../database/page"
import { useSearchParams } from "next/navigation"
import Footer from "@/components/footer"
import ToTopButton from "@/components/to-top-button"
import ItemOrderDialog from "@/components/order-item"

export type OrderData = {
    quantities: Record<string, number>
    notes: Record<string, string>
    tableNumber: string
}

const menuCategory = menuData.navMain

export default function Menu() {
    const searchParams = useSearchParams()
    const tableNumber = searchParams.get("tableNo") || "01"
    const categoryRefs = useRef(menuCategory.map(() => createRef<HTMLDivElement>()))
    const footerRefs = useRef(menuCategory.map(() => createRef<HTMLDivElement>()))
    const [showBackToTop, setShowBackToTop] = useState<boolean>(false)
    const [openOrderModal, setOpenOrderModal] = useState<boolean>(false)
    const [activeMenuItem, setActiveMenuItem] = useState<MenuCard | null>(null)
    const [searchText, setSearchText] = useState<string>('')
    const [selectedCategory, setSelectedCategory] = useState(() => {
        return menuCategory?.[0]?.title ?? ""
    })

    const allTitles = menuCategory.flatMap(cat =>
        cat.items.map(item => item.title)
    )

    const filteredCategories = searchText
        ? menuCategory
            .map(cat => ({
                ...cat,
                items: cat.items.filter(item =>
                    item.title.toLowerCase().includes(searchText.toLowerCase())
                )
            }))
            .filter(cat => cat.items.length > 0)
        : menuCategory

    const [orderData, setOrderData] = useState<OrderData>({
        quantities: {},
        notes: {},
        tableNumber: searchParams.get("tableNo") || "01",
    })

    const handleOpenOrderModal = (menu: MenuCard) => {
        setActiveMenuItem(menu)
    }

    const handleScrollToCategory = (categoryName: string, index: number) => {
        if (categoryRefs.current[index]?.current) {
            setSelectedCategory(categoryName)
            categoryRefs.current[index].current.scrollIntoView({
                behavior: "smooth",
                block: "start",
            })
        }
    }

    const onClickMenuDetails = (menu: MenuCard) => {
        // setSelectedMenu(menu)
        // setOpenCard(true)
    }

    const handleWhatsAppClick = () => {
        const phoneNumber = "6285922081818"
        const { quantities, notes, tableNumber } = orderData

        let message = `*Mie Padeh Cumi Solok Order*\n*Nomor Meja: ${tableNumber}*`

        for (const category of menuCategory) {
            for (const item of category.items) {
                const qty = quantities[item.title]
                if (qty > 0) {
                    const note = notes[item.title]
                    message += `\n- ${item.title} - ${qty}${note ? ` - ${note}` : ""}`
                }
            }
        }

        const encoded = encodeURIComponent(message)
        window.open(`https://wa.me/${phoneNumber}?text=${encoded}`, "_blank")
    }

    const handleConfirmOrder = () => {
        // This can call handleWhatsAppClick later
    }

    useEffect(() => {
        if (activeMenuItem) {
            setOpenOrderModal(true)
        }
    }, [activeMenuItem])

    // useEffect(() => {
    //     if (typeof window !== "undefined") {
    //         sessionStorage.setItem("orderData", JSON.stringify(orderData))
    //     }
    // }, [orderData])

    useEffect(() => {
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.5,
        }

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const index = categoryRefs.current.findIndex((ref) => ref.current === entry.target)
                    if (index !== -1) {
                        setSelectedCategory(menuCategory[index].title)
                    }
                }
            })
        }, observerOptions)

        categoryRefs.current.forEach((ref) => {
            if (ref.current) {
                observer.observe(ref.current)
            }
        })

        return () => {
            categoryRefs.current.forEach((ref) => {
                if (ref.current) {
                    observer.unobserve(ref.current)
                }
            })
        }
    }, [])

    useEffect(() => {
        const index = menuCategory.findIndex((cat) => cat.title === selectedCategory)
        if (index !== -1 && footerRefs.current[index]?.current) {
            footerRefs.current[index].current.scrollIntoView({
                behavior: 'smooth',
                inline: 'center',
                block: 'nearest',
            })
        }
    }, [selectedCategory])

    useEffect(() => {
        const handleScroll = () => {
            setShowBackToTop(window.scrollY > 200)
        }

        window.addEventListener("scroll", handleScroll)
        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    console.log(orderData)

    return (
        <Box sx={{ pt: '4rem', position: 'relative', width: "100%", bgcolor: "white", display: "flex", flexDirection: { xs: "column", md: "row" } }}>
            {openOrderModal && (
                <ItemOrderDialog
                    openOrderModal={openOrderModal}
                    setOpenOrderModal={setOpenOrderModal}
                    activeMenuItem={activeMenuItem}
                    setActiveMenuItem={setActiveMenuItem}
                    setOrderData={setOrderData}
                />
            )}
            <Box sx={{ mb: "10%", mx: 2, mt: 1 }}>
                <Autocomplete
                    freeSolo
                    openOnFocus={false}
                    options={allTitles}
                    inputValue={searchText}
                    onInputChange={(_, value) => setSearchText(value)}
                    sx={{
                        '& .MuiOutlinedInput-root.MuiInputBase-sizeSmall': {
                            pt: 0,
                            pb: 0,
                            borderRadius: 5
                        },
                    }} filterOptions={(opts) =>
                        searchText.length > 0
                            ? opts.filter(o =>
                                o.toLowerCase().includes(searchText.toLowerCase())
                            )
                            : []
                    }
                    renderInput={params => (
                        <TextField
                            {...params}
                            placeholder="Cari menu..."
                            size="small"
                            sx={{ mb: 1 }}
                        />
                    )}
                />
                {(filteredCategories ?? []).map((category, index) => (
                    <Box key={index} ref={categoryRefs.current[index]} sx={{ mb: 4, scrollMarginTop: { xs: "7vh", md: 0 } }}>
                        <Typography
                            textTransform="uppercase"
                            color="#b82828"
                            fontWeight="bolder"
                            sx={{
                                fontSize: { xs: "1rem", md: "1rem" }
                            }}
                        >
                            {category.title}
                        </Typography>
                        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
                            {(category.items ?? []).map((menu: MenuCard, idx: number) => (
                                <Card
                                    key={idx}
                                    sx={{
                                        width: { xs: "100%", md: "48%" }, cursor: "pointer", ":hover": { boxShadow: 3 }, transition: "all 0.6s ease", borderRadius: "1rem", backgroundColor: "white", display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between"
                                    }}>
                                    <CardContent sx={{ width: '100%', display: "flex", flexDirection: "row", gap: 1.5, alignItems: "flec-start", }}>
                                        <CardMedia
                                            sx={{ paddingX: "1rem", borderRadius: "1.25rem", backgroundColor: "beige", minWidth: 90, minHeight: 90, userSelect: "none", pointerEvents: "none" }}
                                            image={menu.url}
                                        />
                                        <Box sx={{ width: '100%', padding: 0, margin: 0, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                                            <Box sx={{ minWidth: 125, padding: 0, margin: 0, display: "flex", flexDirection: "column", justifyContent: "flex-start", gap: 0.25 }}>
                                                <Typography sx={{ fontSize: ".8rem" }} fontWeight="bolder" color="#c72026">
                                                    {menu.title}
                                                </Typography>
                                                <Typography sx={{ fontSize: { xs: ".8rem", md: "1rem" } }} fontWeight={600}>
                                                    Rp {menu.price.toLocaleString("id-ID")},00
                                                </Typography>
                                                <Typography fontSize={10.5} sx={{ overflow: "hidden", textOverflow: "ellipsis" }}>
                                                    {menu.description}
                                                </Typography>
                                            </Box>
                                        </Box>
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                flexDirection: 'column',
                                                justifyContent: 'flex-end',
                                                alignItems: 'flex-end'
                                            }}
                                        >
                                            {(orderData.quantities[menu.title] > 0 || !!orderData.notes[menu.title]) && (
                                                <Box
                                                    sx={{
                                                        display: "flex",
                                                        flexDirection: "column",
                                                        alignItems: "flex-end",
                                                        justifyContent: "flex-start",
                                                        minWidth: 60,
                                                        height: "100%",
                                                        py: 0.5,
                                                    }}
                                                >
                                                    <Typography fontWeight={"bold"} fontSize={11} color="text.secondary">
                                                        Qty: {orderData.quantities[menu.title] || 0}
                                                    </Typography>
                                                    {orderData.notes[menu.title] && (
                                                        <Typography
                                                            fontSize={10}
                                                            fontWeight={"bold"}
                                                            sx={{
                                                                mt: 0.5,
                                                                color: "gray",
                                                                display: "-webkit-box",
                                                                WebkitLineClamp: 2,
                                                                WebkitBoxOrient: "vertical",
                                                                overflow: "hidden",
                                                                textOverflow: "ellipsis",
                                                                textAlign: "right",
                                                                maxWidth: 80,
                                                            }}
                                                        >
                                                            {orderData.notes[menu.title]}
                                                        </Typography>
                                                    )}
                                                </Box>
                                            )}
                                            <Button
                                                variant="contained"
                                                onClick={() => handleOpenOrderModal(menu)}
                                                sx={{
                                                    mt: 1,
                                                    width: "fit-content",
                                                    backgroundColor: "#b82828",
                                                    color: "#fae89f",
                                                    textTransform: "none",
                                                    fontSize: 12,
                                                    px: 1.5,
                                                    py: 0.5,
                                                    borderRadius: ".5rem",
                                                    alignSelf: "flex-start",
                                                    '&:hover': {
                                                        backgroundColor: "#991f1f"
                                                    }
                                                }}
                                            >
                                                Pilih
                                            </Button>
                                        </Box>
                                    </CardContent>
                                </Card>
                            ))}
                        </Box>
                    </Box>
                ))}
            </Box>
            {showBackToTop && (
                <ToTopButton showBackToTop={showBackToTop} />
            )}
            <Footer menuCategory={menuCategory} footerRefs={footerRefs} handleScrollToCategory={handleScrollToCategory} selectedCategory={selectedCategory}></Footer>
        </Box >
    )
}