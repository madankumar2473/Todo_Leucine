import Document, { Html, Head, Main, NextScript } from 'next/document'
import Link from 'next/link'

class MyDocument extends Document {
    render() {
        return (
            <Html>
                <Head>
                    <Link
                        rel="preload" 
                        href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Montserrat:wght@400;500;600;700&display=swap" 
                        as="style"
                    />
                </Head>
                <body>
                    <Main />
                    <NextScript />
                </body>
            </Html>
        )
    }
}

export default MyDocument
