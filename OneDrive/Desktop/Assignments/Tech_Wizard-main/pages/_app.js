import '../css/tailwind.css'
import { ItemIngestionProvider } from '@/contexts/ItemIngestionProvider'
import { StoreUserProvider } from '@/contexts/StoreUserProvider'
import { TenantFacilityProvider } from '@/contexts/TenantFacilityProvider'

function MyApp({ Component, pageProps }) {
    return (
        <StoreUserProvider>
            <TenantFacilityProvider>
                <ItemIngestionProvider>
                    <Component {...pageProps} />
                </ItemIngestionProvider>
            </TenantFacilityProvider>
        </StoreUserProvider>
    )
}

export default MyApp
