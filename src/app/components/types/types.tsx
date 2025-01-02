export type MenuItem = {
    id: string;
    name: string;
    price: string;
    ingredients?: string[];
    allergens: string[];
    type: string[];
    imageUrl: string;
    dodatki?: string[];
};

export type Drink = {
    id: string;
    name: string;
    price: [
        { name: string, price: string },
        { name: string, price: string },
        { name: string, price: string }
    ];
    imageUrl: string;
};

export type Set = {
    id: string;
    name: string;
    price: number;
    imageUrl: string;
    main: string;
    second: string;
    drink: string;
};

export type MenuData = {
    menu: MenuItem[];
    napoje: Drink[];
    types: string[];
    zestawy: Set[]
};

export type NormalOrder = {
    id?: string;
    name: string;
    price: string;
    add: string[];
    del: string[];
    imageUrl: string;
}

export type DrinkOrder = {
    id?: string;
    name: string;
    price: string;
    size: string;
    imageUrl: string;
}

export type SetOrder = {
    id: string;
    price: string;
    main: NormalOrder;
    second: {
        name: string;
        imageUrl: string;
    }
    drink: DrinkOrder;
}

export type ForYouOrder = {
    id: string;
    price: string;
    main: NormalOrder;
    second: {
        fries?: { name: string, price: string, imageUrl: string };
        drink?: { name: string, size: string, price: string, imageUrl: string };
    };
}

export type SosOrder = {
    id?: string;
    name: string;
    price: string;
    imageUrl: string;

}

export type AllOrders = DrinkOrder | NormalOrder | SetOrder | ForYouOrder