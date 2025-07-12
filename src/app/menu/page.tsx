"use client"

import React, { useEffect, useRef, useState } from "react"
import { Box, Card, CardContent, CardMedia, Fade, Typography } from "@mui/material"
import { MenuCard, menuData } from "../../database/page"

const menuCategory = menuData.navMain

export default function Menu() {
    const categoryRefs = useRef(menuCategory.map(() => React.createRef<HTMLDivElement>()))
    const footerRefs = useRef(menuCategory.map(() => React.createRef<HTMLDivElement>()))
    const [showBackToTop, setShowBackToTop] = useState<boolean>(false)
    const [quantities, setQuantities] = useState<{ [key: string]: number }>({})
    const [openCard, setOpenCard] = useState<boolean>(false)
    const [selectedMenu, setSelectedMenu] = useState<MenuCard>()
    const [openOutletList, setOpenOutletList] = useState<boolean>(false)
    const [openOrderList, setOpenOrderList] = useState<boolean>(false)
    const [selectedOutlet, setSelectedOutlet] = useState<string>("")
    const [selectedCategory, setSelectedCategory] = useState<string>(() => {
        return menuCategory?.[0]?.title ?? ""
    })

    const increaseQuantity = (id: string) => {
        setQuantities((prev) => ({
            ...prev,
            [id]: (prev[id] || 0) + 1,
        }))
    }

    const decreaseQuantity = (id: string) => {
        setQuantities((prev) => ({
            ...prev,
            [id]: Math.max((prev[id] || 0) - 1, 0),
        }))
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
        setSelectedMenu(menu)
        setOpenCard(true)
    }

    const onCloseMenuDetails = () => {
        setSelectedMenu(undefined)
        setOpenCard(false)
    }

    const onClickOrder = () => {
        setOpenCard(false)
        setOpenOutletList(true)
    }

    const handleOpenOrderList = (outlet: any) => {
        handleCloseModal()
        if (outlet?.name?.toLowerCase().includes("big")) {
            handleWhatsAppClick()
            setOpenCard(false)
        } else {
            handleOpenOnlineFoodList(outlet)
            setSelectedOutlet(outlet?.name)
            setOpenCard(false)
        }
    }

    const handleCloseModal = () => {
        setOpenOutletList(false)
    }

    const handleBack = () => {
        setOpenOutletList(true)
        setOpenOrderList(false)
    }

    const handleOpenOnlineFoodList = (outlet: any) => {
        setOpenOrderList(true)
    }

    const handleWhatsAppClick = () => {
        const phoneNumber = "6285922081818"
        const message = encodeURIComponent("Hi Sky Pasta, saya mau order!")
        window.open(`https://wa.me/${phoneNumber}?text=${message}`, "_blank")
    }

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

    return (
        <Box sx={{ pt: '4rem', position: 'relative', width: "100%", bgcolor: "white", display: "flex", flexDirection: { xs: "column", md: "row" } }}>
            <Box sx={{ mb: "10%", ml: 2, mt: 1 }}>
                {(menuCategory ?? []).map((category, index) => (
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
                                <Card onClick={() => onClickMenuDetails(menu)} key={idx} sx={{
                                    width: { xs: "100%", md: "48%" }, cursor: "pointer", ":hover": { boxShadow: 3 }, transition: "all 0.6s ease", borderRadius: "1rem", backgroundColor: "white", display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between"
                                }}>
                                    <CardContent sx={{ display: "flex", flexDirection: "row", gap: 1.5, alignItems: "center" }}>
                                        <CardMedia
                                            sx={{ padding: "1rem", borderRadius: "2rem", backgroundColor: "beige", height: { xs: 100, md: 115 }, width: { xs: 100, md: 125 }, userSelect: "none", pointerEvents: "none" }}
                                            image={menu.url}
                                        />
                                        <Box sx={{ display: "flex", flexDirection: "column", maxWidth: "60%", justifyContent: "flex-start", gap: 0.25 }}>
                                            <Typography sx={{ fontSize: { xs: "1.1rem", md: "1.25rem" } }} lineHeight="1.25rem" fontWeight="bolder" color="#c72026">
                                                {menu.title}
                                            </Typography>
                                            <Typography sx={{ fontSize: { xs: ".8rem", md: "1rem" } }} fontWeight={600}>
                                                Rp {menu.price.toLocaleString("id-ID")},00
                                            </Typography>
                                            <Typography fontSize={10.5} sx={{ overflow: "hidden", textOverflow: "ellipsis" }}>
                                                {menu.description}
                                            </Typography>
                                        </Box>
                                    </CardContent>
                                </Card>
                            ))}
                        </Box>
                    </Box>
                ))}
            </Box>
            {showBackToTop && (
                <Fade in={showBackToTop}>
                    <Box
                        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                        tabIndex={0}
                        sx={{
                            position: "fixed",
                            bottom: "4.5rem",
                            right: "1rem",
                            zIndex: 20,
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
            )}
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
                    zIndex: 10,
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
        </Box >
    )
}