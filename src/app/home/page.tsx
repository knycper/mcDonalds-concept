import Navbar from "../components/Navbar"
import Menu from "../components/Menu"
import LoadingSuspense from "../components/LoadingSuspense"

export default function  HomePage() {

    return (
        <LoadingSuspense>
            <Navbar/>
            <Menu/>
        </LoadingSuspense>
    )
}