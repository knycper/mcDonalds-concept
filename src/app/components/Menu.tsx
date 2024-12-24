'use client'

import axios from "axios";
import { useState, useEffect } from 'react'

export default function Menu() {
    const [types, setTypes] = useState<string[]>([])

    useEffect(() => {
        axios.get('http://localhost:3001/file')
        .then(res => {
            const jsOn = res.data.message
            setTypes(jsOn.menu.find(item => item.name === "types").types)
        })
    }, [])

    return (
        <div>
            <ul>
            {types.map((type, index) => (
                <li key={index}>{type}</li>
            ))}
            </ul>
        </div>
    )
}