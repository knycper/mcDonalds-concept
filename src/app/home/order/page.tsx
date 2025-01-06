'use client'

import OrderList from "@/app/components/OrderList";
import Navbar from "@/app/components/Navbar";

export default function OrderPage() {

    return (
        <div className="bg-yellow-50 h-screen">
            <Navbar />
            <div className="m-4">
                <OrderList />
            </div>
        </div>
    )
}
