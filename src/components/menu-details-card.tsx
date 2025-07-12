"use client"

import { MenuCard } from "@/database/page"
import { Close, LocalGroceryStore } from "@mui/icons-material"
import { Box, Button, Card, CardActionArea, CardActions, CardContent, CardMedia, IconButton, Tooltip, Typography } from "@mui/material"
import React, { useState } from "react"

interface CardDetailsProps {
    onClose: () => void
    onClickOrder: () => void
    menu?: MenuCard
}

export default function MenuDetailsCard({ onClose, menu, onClickOrder }: CardDetailsProps) {
    return (
        <Box
            sx={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100vw",
                height: "100vh",
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                display: "flex",
                justifyContent: "center",
                alignItems: { xs: "flex-start", md: "center" },
                zIndex: 9999,
            }}
            onClick={onClose}
        >
            <Card
                sx={{
                    maxWidth: { xs: "80vw", md: "10vw" },
                    maxHeight: { xs: "80vh", md: "100vh" },
                    minWidth: "27vw",
                    bgcolor: "white",
                    boxShadow: 24,
                    mt: { xs: "15%", md: 0 },
                    p: 3,
                    borderRadius: 2,
                }}
                onClick={(e) => e.stopPropagation()}
            >
                <Tooltip
                    title={menu?.description || ''}
                    arrow
                    placement="right"
                    PopperProps={{
                        modifiers: [
                            {
                                name: 'zIndex',
                                enabled: true,
                                phase: 'write',
                                fn({ state }) {
                                    state.styles.popper.zIndex = "9999"
                                }
                            }
                        ]
                    }}
                >
                    <CardActionArea>
                        <Box sx={{ position: "relative", display: 'flex', alignItems: "center", justifyContent: "center" }}>
                            <IconButton
                                onClick={onClose}
                                sx={{
                                    position: "absolute",
                                    top: 0,
                                    right: 0,
                                    color: "#c72026",
                                    backgroundColor: "rgba(255,255,255,0.5)",
                                    "&:hover": { backgroundColor: "rgba(255,255,255,0.7)" },
                                }}
                            >
                                <Close />
                            </IconButton>
                            <CardMedia
                                component="img"
                                image={menu?.url}
                                alt={`${menu?.title} Sky Pasta`}
                                sx={{ userSelect: "none", pointerEvents: "none", borderRadius: 2, bgcolor: "beige", maxHeight: { xs: 250, md: 275 }, maxWidth: { xs: 250, md: 275 }, }}
                            />
                        </Box>
                        <CardContent sx={{ padding: 0, pt: 2 }}>
                            <Typography
                                fontSize={25}
                                fontWeight={"bolder"}
                                fontFamily={"Nunito"}
                                textAlign={"left"}
                                color="#c72026"
                                gutterBottom
                                variant="h5"
                                lineHeight={"1.75rem"}
                            >
                                {menu?.title}
                            </Typography>
                            <Typography textAlign={"left"} fontSize="1rem" fontFamily="Nunito" fontWeight={600}>
                                Rp {menu?.price?.toLocaleString("id-ID")},00
                            </Typography>
                            <Typography
                                textAlign="left"
                                variant="body2"
                                sx={{
                                    color: 'text.secondary',
                                    display: '-webkit-box',
                                    overflow: 'hidden',
                                    WebkitLineClamp: 5,
                                    WebkitBoxOrient: 'vertical',
                                    textOverflow: 'ellipsis',
                                }}
                            >
                                {menu?.description}
                            </Typography>
                        </CardContent>
                        <Button onClick={onClickOrder} startIcon={<LocalGroceryStore sx={{ fontSize: 10 }} />} sx={{ fontWeight: "bolder", backgroundColor: "#c72026", borderRadius: 4, mt: 2 }} fullWidth variant="contained"> Order</Button>
                    </CardActionArea>
                </Tooltip>
            </Card>
        </Box>
    )
}
