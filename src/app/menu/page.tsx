"use client"

import React, { useEffect, useRef, useState } from "react"
import { Box, Card, CardContent, CardMedia, Typography } from "@mui/material"
//import Header from "../header/page"
import { MenuCard, menuData } from "../../database/page"

const menuCategory = menuData.navMain

export default function Menu() {
    const categoryRefs = useRef(menuCategory.map(() => React.createRef<HTMLDivElement>()))
    const [openCard, setOpenCard] = useState<boolean>(false)
    const [selectedCategory, setSelectedCategory] = useState<string>(() => {
        return menuCategory?.[0]?.title ?? ""
    })
    const [selectedMenu, setSelectedMenu] = useState<MenuCard>()
    const [openOutletList, setOpenOutletList] = useState<boolean>(false)
    const [openOrderList, setOpenOrderList] = useState<boolean>(false)
    const [selectedOutlet, setSelectedOutlet] = useState<string>("")

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

    return (
        <Box sx={{ width: "100%", minHeight: "200vh", bgcolor: "white", display: "flex", flexDirection: { xs: "column", md: "row" } }}>
            {/* <Header /> */}
            <Box
                sx={{
                    display: { xs: "flex", md: "none" },
                    flexDirection: "row",
                    overflowX: "auto",
                    whiteSpace: "nowrap",
                    padding: ".5rem 1.25rem",
                    gap: 2,
                    position: "sticky",
                    top: 0,
                    backgroundColor: "#b82828",
                    zIndex: 10,
                }}
            >
                {(menuCategory ?? []).map((menu, index) => (
                    <Typography
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
            {/* <Box
                    sx={{
                        display: { xs: "none", md: "block" },
                        width: "30%",
                        textAlign: "right",
                        pt: "2%",
                        position: "fixed",
                        top: 0,
                        left: 0,
                    }}
                >
                    {(menuCategory ?? []).map((menu, index) => (
                        <Typography
                            key={index}
                            sx={{
                                color: menu.title == selectedCategory ? "white" : "#c72026",
                                backgroundColor: menu.title == selectedCategory ? "#c72026" : "white",
                                borderRadius: ".5rem",
                                cursor: "pointer",
                                mb: .5,
                                pr: "1rem",
                                '&:hover, &:focus': {
                                    color: menu.title == selectedCategory ? "white" : "#c72026",
                                    backgroundColor: menu.title == selectedCategory ? "#c72026" : "rgba(0,0,0,.08)",
                                },
                            }}
                            color="#c72026"
                            lineHeight="3.5rem"
                            fontSize="1.5rem"
                            fontWeight="bolder"
                            onClick={() => handleScrollToCategory(menu.title, index)}
                        >
                            {menu.title}
                        </Typography>
                    ))}
                </Box> */}
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
        </Box >
    )
}