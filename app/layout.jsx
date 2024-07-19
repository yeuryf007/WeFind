import '@styles/globals.css';
import { Children } from 'react';
import Nav from '@components/Nav';
import Provider from '@components/Provider';
import Script from 'next/script'

export const metadata ={
    title: "WeFind",
    description: 'Buscador de productos'
}

const layoutRaiz = ({children}) => {
  return (
    <html lang='en'>
      <head>
      <Script
          src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY}&libraries=places`}
          strategy="afterInteractive"
        />
      </head>
        <body>


          <div className='main'>
          </div>

          <main className='app'>
              <Nav/>
              {children}
          </main>


        </body>
    </html>
  )
}

export default layoutRaiz;