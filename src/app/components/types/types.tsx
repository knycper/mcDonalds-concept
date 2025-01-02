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
    name: string;
    price: string;
    add: string[];
    del: string[];
}

export type DrinkOrder = {
    name: string;
    price: string;
    size: string;
}

export type SetOrder = {
    price: string;
    main: NormalOrder;
    second: string;
    drink: DrinkOrder;
}

export type ForYouOrder = {
    price: string;
    main: NormalOrder;
    second: {
        name: string;
    };
}

export type AllOrders = DrinkOrder | NormalOrder | SetOrder | ForYouOrder