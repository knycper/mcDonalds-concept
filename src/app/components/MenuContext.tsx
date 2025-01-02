'use client'

import React, { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";

const MenuContext = createContext(null);

export const MenuProvider = ({ children }) => {
    const [menuData, setMenuData] = useState(null);

    useEffect(() => {
        async function resolve() {
            await axios.get("http://localhost:3001/file").then((res) => {
                setMenuData(res.data.message);
            });
        }
        resolve()
    }, []);

    return (
        <MenuContext.Provider value={menuData}>
            {children}
        </MenuContext.Provider>
    );
};

export default function useMenu() {
    return useContext(MenuContext);
};
