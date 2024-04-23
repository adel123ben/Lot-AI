import LandingContent from "@/components/landing-content"
import LandingFooter from "@/components/landing-footer"
import LandingNavbar from "@/components/landing-navbar"
import LandingHero from "@/components/landingue-hero"
import { Button } from "@/components/ui/button"
import Link from "next/link"


const Home = () => {
    return (
        <div className="h-full">
            <LandingNavbar />
            <LandingHero />
            <LandingContent />
            <LandingFooter />
        </div>
    )
}

export default Home
