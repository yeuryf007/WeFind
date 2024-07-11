import '@styles/globals.css';
import { Children } from 'react';
import Nav from '@components/Nav';
import Provider from '@components/Provider';

export const metadata ={
    title: "WeFind",
    description: 'Buscador de productos'
}

const layoutRaiz = ({children}) => {
  return (
    <html lang='en'>
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