export interface MenuCard {
    menuId: number,
    title: string,
    price: number,
    description: string,
    url?: string,
    is_active?: boolean,
    isActive?: boolean,
}

export interface MenuCategory {
    title: string,
    items: MenuCard[]
    url?: string
}

export interface MenuData {
    navMain: MenuCategory[]
}
