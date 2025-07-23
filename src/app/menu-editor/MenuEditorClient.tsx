'use client'
import { Autocomplete, Box, Button, Card, CardContent, CardMedia, Dialog, DialogTitle, DialogActions, DialogContent, TextField, Typography, FormControlLabel, Switch, CircularProgress } from "@mui/material"
import useMenuData from "../controller/useMenuData"
import { createRef, useEffect, useMemo, useRef, useState, RefObject } from "react"
import { MenuCard, MenuCategory } from "@/database/page"
import ToTopButton from "@/components/to-top-button"
import Footer from "@/components/footer"
import { useSidebar } from "@/components/ui/sidebar"
import { Cancel, CheckCircle, CloudUpload } from "@mui/icons-material"
import SubmitMenuUpdate from "@/components/submit-menu-update"

export default function MenuEditorClient() {
    const { selectedMenuName, isMobile } = useSidebar()
    const { menuCategory: initialCats, setMenuTrigger, menuTrigger } = useMenuData(true)
    const [isUploading, setIsUploading] = useState<boolean>(false)
    const [menuCategory, setMenuCategory] = useState<MenuCategory[]>([])
    const [editItem, setEditItem] = useState<MenuCard | null>(null)
    const [openEdit, setOpenEdit] = useState(false)
    const [searchText, setSearchText] = useState<string>('')
    const [showBackToTop, setShowBackToTop] = useState<boolean>(false)
    const [selectedCategory, setSelectedCategory] = useState(() => {
        return menuCategory?.[0]?.title ?? ""
    })

    const categoryRefs = useRef<RefObject<HTMLDivElement | null>[]>([])
    const footerRefs = useRef<RefObject<HTMLDivElement | null>[]>([])
    const menuItemRefs = useRef<RefObject<HTMLDivElement | null>[][]>([])

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

    const handleScrollToCategory = (name: string, idx: number) => {
        const ref = categoryRefs.current[idx]
        if (ref?.current) {
            ref.current.scrollIntoView({ behavior: "smooth", block: "start" })
            setSelectedCategory(name)
        }
    }

    const handleScrollToMenuItem = (menuName: string) => {
        for (let ci = 0; ci < menuCategory.length; ci++) {
            const ii = menuCategory[ci].items.findIndex(i => i.title === menuName)
            if (ii !== -1) {
                const catRef = categoryRefs.current[ci]
                catRef?.current?.scrollIntoView({ behavior: "smooth", block: "start" })
                const itemRef = menuItemRefs.current[ci][ii]
                itemRef?.current?.scrollIntoView({ behavior: "smooth", block: "center" })
                setSelectedCategory(menuCategory[ci].title)
                break
            }
        }
    }

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return
        setIsUploading(true)

        const form = new FormData()
        form.append("file", file)
        form.append("upload_preset", "menu_editor_preset")             // your unsigned preset
        form.append("folder", "MiePadehCumi")                     // optional

        try {
            const res = await fetch(
                "https://api.cloudinary.com/v1_1/dxyxg3egs/image/upload",
                { method: "POST", body: form }
            )
            const json = await res.json()
            // json.secure_url is your uploaded URL
            setEditItem(item =>
                item ? { ...item, url: json.secure_url } : null
            )
        } catch (err) {
            console.error("Cloudinary upload failed", err)
        } finally {
            setIsUploading(false)
        }
    }

    useEffect(() => {
        categoryRefs.current = menuCategory.map(() => createRef())
        footerRefs.current = menuCategory.map(() => createRef())
        menuItemRefs.current = menuCategory.map(cat =>
            cat.items.map(() => createRef())
        )
    }, [menuCategory])

    useEffect(() => {
        handleScrollToMenuItem(selectedMenuName)
    }, [selectedMenuName])

    useEffect(() => {
        const onScroll = () => {
            for (let i = 0; i < categoryRefs.current.length; i++) {
                const el = categoryRefs.current[i].current
                if (!el) continue
                const { top } = el.getBoundingClientRect()
                if (top >= 0 && top < 100) {
                    setSelectedCategory(menuCategory[i].title)
                    break
                }
            }
        }
        window.addEventListener("scroll", onScroll, { passive: true })
        return () => window.removeEventListener("scroll", onScroll)
    }, [menuCategory])

    useEffect(() => {
        const idx = menuCategory.findIndex((c) => c.title === selectedCategory)
        if (idx !== -1 && footerRefs.current[idx]?.current) {
            footerRefs.current[idx].current.scrollIntoView({
                behavior: "smooth",
                inline: "center",
                block: "nearest",
            })
        }
    }, [selectedCategory, menuCategory])

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
                    <Box key={index} ref={categoryRefs.current[index]} sx={{ mt: 1, mb: 4, scrollMarginTop: { xs: "14vh", md: 0 } }}>                        <Typography
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
                        gap: 1,
                        backgroundColor: "#ffece6",
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
                <DialogContent
                    sx={{
                        paddingTop: (theme) => theme.spacing(1),
                        "&.MuiDialogContent-root": {
                            paddingTop: (theme) => theme.spacing(1),
                        },
                        backgroundColor: "#ffece6",
                        p: 3,
                        display: "flex",
                        flexDirection: "column",
                        gap: 1.5,
                    }}
                >
                    <TextField
                        label="Nama"
                        fullWidth
                        variant="outlined"
                        value={editItem?.title || ""}
                        onChange={e =>
                            setEditItem(item =>
                                item ? { ...item, title: e.target.value } : null
                            )
                        }
                        InputLabelProps={{ sx: { color: "#b82828", fontWeight: "bold" } }}
                        sx={{
                            "& .MuiOutlinedInput-root": {
                                borderRadius: 2,
                                "& fieldset": { borderColor: "#b82828" },
                                "&:hover fieldset": { borderColor: "#fe6b8b" },
                                "&.Mui-focused fieldset": { borderColor: "#ff8e53" },
                            },
                        }}
                    />

                    <TextField
                        label="Harga"
                        type="number"
                        fullWidth
                        variant="outlined"
                        value={editItem?.price ?? 0}
                        onChange={e =>
                            setEditItem(item =>
                                item ? { ...item, price: Number(e.target.value) } : null
                            )
                        }
                        InputLabelProps={{ sx: { color: "#b82828", fontWeight: "bold" } }}
                        sx={{
                            "& .MuiOutlinedInput-root": {
                                borderRadius: 2,
                                "& fieldset": { borderColor: "#b82828" },
                                "&:hover fieldset": { borderColor: "#fe6b8b" },
                                "&.Mui-focused fieldset": { borderColor: "#ff8e53" },
                            },
                        }}
                    />
                    <TextField
                        label="Deskripsi"
                        multiline
                        rows={3}
                        fullWidth
                        variant="outlined"
                        value={editItem?.description || ""}
                        onChange={e =>
                            setEditItem(item =>
                                item ? { ...item, description: e.target.value } : null
                            )
                        }
                        InputLabelProps={{ sx: { color: "#b82828", fontWeight: "bold" } }}
                        sx={{
                            "& .MuiOutlinedInput-root": {
                                borderRadius: 2,
                                "& fieldset": { borderColor: "#b82828" },
                                "&:hover fieldset": { borderColor: "#fe6b8b" },
                                "&.Mui-focused fieldset": { borderColor: "#ff8e53" },
                            },
                        }}
                    />

                    <Box sx={{ my: 1, textAlign: "center" }}>
                        <input
                            accept="image/*"
                            id="upload-file"
                            type="file"
                            style={{ display: "none" }}
                            onChange={handleFileChange}
                            disabled={isUploading}
                        />
                        <label htmlFor="upload-file">
                            <Button
                                component="span"
                                startIcon={
                                    isUploading
                                        ? <CircularProgress size={20} color="inherit" />
                                        : <CloudUpload />
                                }
                                disabled={isUploading}
                                sx={{
                                    background: "linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)",
                                    color: "white",
                                    fontWeight: "bold",
                                    borderRadius: "8px",
                                    px: 3,
                                    py: 1.5,
                                    boxShadow: "0 3px 5px 2px rgba(255,105,135,.3)",
                                    textTransform: "none",
                                    "&:hover": {
                                        background: "linear-gradient(45deg, #FF8E53 30%, #FE6B8B 90%)",
                                    },
                                }}
                            >
                                {isUploading ? "Uploading…" : "Upload Gambar"}
                            </Button>
                        </label>
                    </Box>


                    <TextField
                        label="URL Gambar"
                        fullWidth
                        variant="outlined"
                        value={editItem?.url || ""}
                        onChange={e =>
                            setEditItem(item =>
                                item ? { ...item, url: e.target.value } : null
                            )
                        }
                        InputLabelProps={{ sx: { color: "#b82828", fontWeight: "bold" } }}
                        sx={{
                            "& .MuiOutlinedInput-root": {
                                borderRadius: 2,
                                "& fieldset": { borderColor: "#b82828" },
                                "&:hover fieldset": { borderColor: "#fe6b8b" },
                                "&.Mui-focused fieldset": { borderColor: "#ff8e53" },
                            },
                        }}
                    />
                    <FormControlLabel
                        control={
                            <Switch
                                checked={editItem?.is_active ?? false}
                                onChange={e =>
                                    editItem && setEditItem({ ...editItem, is_active: e.target.checked })
                                }
                                sx={{
                                    "& .MuiSwitch-switchBase.Mui-checked": {
                                        color: "#ff8e53",
                                    },
                                    "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                                        background: "linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)",
                                    },
                                }}
                            />
                        }
                        label={editItem?.is_active ? "Aktif" : "Tidak Aktif"}
                        sx={{ mt: 1, "& .MuiFormControlLabel-label": { fontWeight: "bold", color: "#b82828" } }}
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
                        disabled={isUploading}
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