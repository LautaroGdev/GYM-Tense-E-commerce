import { BrowserRouter, Routes, Route } from 'react-router-dom';
import NavBar from './componentes/NavBar.jsx';
import { Layout } from 'antd';
import ItemListContainer from './componentes/ItemListContainer';
import ItemDetailContainer from './componentes/ItemDetailContainer';
import Cart from './componentes/Cart';
import Checkout from './componentes/Checkout';
import { CartProvider } from './contexto/CartContext.jsx'; 

const { Content, Footer } = Layout;

const HomeView = () => (
    <div style={{ padding: '20px', textAlign: 'center' }}>
        <h1>¡Bienvenido a GYM TENSE!</h1>
        <p>Explora nuestras categorías en la barra de navegación superior.</p>

        <ItemListContainer /> 
    </div>
);

const NotFound = () => (
    <div style={{ padding: '20px', textAlign: 'center' }}>
        <h1>404 | Página no encontrada</h1>
    </div>
);

                
function App() {

    return (
       
      <BrowserRouter>
        <Layout style={{ minHeight: '100vh', backgroundColor: '#FFFFFF' }}> 
        <CartProvider>
          <NavBar/>
            <Content style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
                
                <Routes>
                    
                    <Route path="/" element={<HomeView />} />
                    <Route path="/category/:categoryId" element={<ItemListContainer />} />
                    <Route path="/item/:itemId" element={<ItemDetailContainer />} /> 
                    <Route path="/cart" element={<Cart/>} />
                    <Route path="/checkout" element={<Checkout/>} />

                    <Route path="*" element={<NotFound />} />
                    
                </Routes>
                
            </Content>

            {/* Footer */}
            <Footer style={{ textAlign: 'center', backgroundColor: '#1C1C1C', color: '#FFF' }}>
                GYM TENSE E-commerce ©{new Date().getFullYear()} Creado para Proyecto React
            </Footer>
        </CartProvider>
        </Layout>
      </BrowserRouter>
    );

}

export default App;

