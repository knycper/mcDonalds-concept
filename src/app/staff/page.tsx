'use client'

import StaffMain from "../components/StaffMain"
import { useEffect } from "react"

export default function StaffPage() {

    useEffect(() => {
        const orders = localStorage.getItem("ordersList")
        if (!orders) {
            localStorage.setItem("ordersList", JSON.stringify([]))
        }
    }, [])

    return (
        <div>
            <StaffMain />
        </div>
    )
}