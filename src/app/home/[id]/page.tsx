'use client'

import LoadingSuspense from "@/app/components/LoadingSuspense"
import Navbar from "@/app/components/Navbar"
import ProductById from "@/app/components/ProductById"

export default function NamePage({ params }) {

    return (
        <LoadingSuspense>
            <Navbar />
            <ProductById params={params} />
        </LoadingSuspense>
    )
}