'use client'
import { Autocomplete, Box, Button, Card, CardContent, CardMedia, Dialog, DialogTitle, DialogActions, DialogContent, TextField, Typography, FormControlLabel, Switch } from "@mui/material"
import useMenuData from "../controller/useMenuData"
import { createRef, useEffect, useMemo, useRef, useState } from "react"
import { MenuCard, MenuCategory } from "@/database/page"
import ToTopButton from "@/components/to-top-button"
import Footer from "@/components/footer"
import { useSidebar } from "@/components/ui/sidebar"
import { Cancel, CheckCircle } from "@mui/icons-material"
import SubmitMenuUpdate from "@/components/submit-menu-update"

export default function MenuEditorClient() {
    const { selectedMenuName, isMobile } = useSidebar()
    const { menuCategory: initialCats, setMenuTrigger, menuTrigger } = useMenuData()
    const [menuCategory, setMenuCategory] = useState<MenuCategory[]>([])
    const [editItem, setEditItem] = useState<MenuCard | null>(null)
    const [openEdit, setOpenEdit] = useState(false)
    const [searchText, setSearchText] = useState<string>('')
    const [showBackToTop, setShowBackToTop] = useState<boolean>(false)
    const [selectedCategory, setSelectedCategory] = useState(() => {
        return menuCategory?.[0]?.title ?? ""
    })
    const footerRefs = useRef(menuCategory.map(() => createRef<HTMLDivElement>()))
    const categoryRefs = useRef(menuCategory.map(() => createRef<HTMLDivElement>()))
    const menuItemRefs = useRef(menuCategory.map(cat => cat.items.map(() => createRef<HTMLDivElement>())))

    const allTitles = menuCategory.flatMap(cat =>
        cat.items.map(item => item.title)
    )

    const filteredCategories = useMemo(() => {
        return (searchText
            ? initialCats.map(cat => ({
                ...cat,
                items: cat.items.filter(i => i.title.toLowerCase().includes(searchText.toLowerCase()))
            }))
                .filter(cat => cat.items.length)
            : initialCats
        )
    }, [initialCats, searchText])

    const handleEditClick = (item: MenuCard) => {
        setEditItem({ ...item })
        setOpenEdit(true)
    }

    const handleSaveEdit = () => {
        if (!editItem) return

        setMenuCategory(prevCats => {
            const updatedCats = prevCats.map(cat => ({
                ...cat,
                items: cat.items.map(item =>
                    item.menuId === editItem.menuId ? editItem : item
                ),
            }))

            localStorage.setItem("menuCategory", JSON.stringify(updatedCats))

            return updatedCats
        })
        setMenuTrigger(!menuTrigger)
        setOpenEdit(false)
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

    const handleScrollToMenuItem = (menuName: string) => {
        for (let catIdx = 0; catIdx < menuCategory.length; catIdx++) {
            const itemIdx = menuCategory[catIdx].items.findIndex(
                (i) => i.title === menuName
            )
            if (itemIdx !== -1) {
                setSelectedCategory(menuCategory[catIdx].title)
                categoryRefs.current[catIdx]?.current?.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                })
                const ref = menuItemRefs.current[catIdx][itemIdx]
                ref.current?.scrollIntoView({ behavior: "smooth", block: "center" })
                break
            }
        }
    }

    useEffect(() => {
        handleScrollToMenuItem(selectedMenuName)
    }, [selectedMenuName])

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

    useEffect(() => {
        if (initialCats.length) {
            setMenuCategory(initialCats)
        }
    }, [initialCats])

    return (
        <Box sx={{ pt: '4rem', position: 'relative', width: "100%", bgcolor: "white", display: "flex", flexDirection: { xs: "column", md: "row" } }}>
            <Box sx={{ mb: "10%", mx: 2, mt: 1 }}>
                <Autocomplete
                    freeSolo
                    openOnFocus={false}
                    options={allTitles}
                    inputValue={searchText}
                    onInputChange={(_, value) => setSearchText(value)}
                    sx={{
                        '& .MuiOutlinedInput-root': {
                            position: 'fixed',
                            width: '70%',
                            alignSelf: 'center'
                        },
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
                    <Box key={index} ref={categoryRefs.current[index]} sx={{ mt: 1, mb: 4, scrollMarginTop: { xs: "7vh", md: 0 } }}>
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
                                                justifyContent: 'space-between',
                                                alignItems: 'flex-end'
                                            }}
                                        >
                                            <Typography
                                                fontSize={10.5}
                                                sx={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: 0.5,
                                                    overflow: "hidden",
                                                    textOverflow: "ellipsis",
                                                    whiteSpace: "nowrap",
                                                    fontWeight: 'bold'
                                                }}
                                            >
                                                {menu.is_active ? (
                                                    <>
                                                        Active
                                                        <CheckCircle sx={{ fontSize: 12 }} color="success" />
                                                    </>
                                                ) : (
                                                    <>
                                                        Inactive
                                                        <Cancel sx={{ fontSize: 12 }} color="error" />
                                                    </>
                                                )}
                                            </Typography>
                                            <Button
                                                variant="contained"
                                                onClick={() => handleEditClick(menu)}
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
                                                Ubah
                                            </Button>
                                        </Box>
                                    </CardContent>
                                </Card>
                            ))}
                        </Box>
                    </Box>
                ))}
            </Box>
            <Dialog
                open={openEdit}
                onClose={() => setOpenEdit(false)}
                fullWidth
                maxWidth="sm"
                PaperProps={{
                    sx: {
                        borderRadius: '10px',
                        gap: 1
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
                >Edit Menu Item</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Nama"
                        fullWidth
                        margin="dense"
                        value={editItem?.title || ""}
                        onChange={e =>
                            setEditItem(item =>
                                item ? { ...item, title: e.target.value } : null
                            )
                        }
                    />
                    <TextField
                        label="Harga"
                        type="number"
                        fullWidth
                        margin="dense"
                        value={editItem?.price ?? 0}
                        onChange={e =>
                            setEditItem(item =>
                                item ? { ...item, price: Number(e.target.value) } : null
                            )
                        }
                    />
                    <TextField
                        label="Deskripsi"
                        multiline
                        rows={3}
                        fullWidth
                        margin="dense"
                        value={editItem?.description || ""}
                        onChange={e =>
                            setEditItem(item =>
                                item ? { ...item, description: e.target.value } : null
                            )
                        }
                    />
                    <TextField
                        label="URL Gambar"
                        fullWidth
                        margin="dense"
                        value={editItem?.url || ""}
                        onChange={e =>
                            setEditItem(item =>
                                item ? { ...item, url: e.target.value } : null
                            )
                        }
                    />
                    <FormControlLabel
                        control={
                            <Switch
                                checked={editItem?.is_active ?? false}
                                onChange={e =>
                                    editItem && setEditItem({ ...editItem, is_active: e.target.checked })
                                }
                            />
                        }
                        label="Aktif"
                        sx={{ mt: 1 }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button
                        sx={{
                            fontWeight: 'bold',
                            color: '#991f1f',
                            border: '.5px solid #991f1f',
                            borderRadius: '0.75rem',
                            width: 100
                        }}
                        onClick={() => setOpenEdit(false)}
                    >
                        Batal
                    </Button>
                    <Button
                        variant="contained"
                        sx={{
                            backgroundColor: '#b82828',
                            color: '#fae89f',
                            borderRadius: '0.75rem',
                            fontWeight: 'bold',
                            width: 100,
                            '&:hover': { backgroundColor: '#991f1f' },
                            '&:disabled': { backgroundColor: 'rgba(0,0,0,.1)' }
                        }}
                        onClick={handleSaveEdit}
                    >
                        Simpan
                    </Button>
                </DialogActions>
            </Dialog>
            {
                showBackToTop && (
                    <ToTopButton showBackToTop={showBackToTop} />
                )
            }
            <SubmitMenuUpdate isMobile={isMobile} />
            <Footer menuCategory={menuCategory} footerRefs={footerRefs} handleScrollToCategory={handleScrollToCategory} selectedCategory={selectedCategory}></Footer>
        </Box >
    )
}