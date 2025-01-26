import Navbar from "@/app/components/Navbar"
import OrderStatus from "@/app/components/OrderStatus"

export default function OrderInfoPage() {
    return (
        <div className="bg-yellow-50 h-screen">
            <Navbar />
            <div className="flex items-center justify-center h-[80vh]">
                <OrderStatus />
            </div>
        </div>
    )
}