import Footer from "../components/landingPage/Footer"
import NavbarWithOutDrawer from "../components/TermConditionAndPrivacyPolicy/NavbarWithOutDrawer"
import TermsAndConditionsContent from "../components/TermConditionAndPrivacyPolicy/TermConditionContent"

const TermAndCondition = () => {
    return (
        <>
            <NavbarWithOutDrawer />

            <TermsAndConditionsContent />
            <Footer />
        </>
    )
}

export default TermAndCondition
