import React from 'react';
import { Layout, Menu, Row, Col, Typography } from 'antd';
import { Link, useLocation} from 'react-router-dom';
import CartWidget from './CartWidget.jsx';

const { Header } = Layout;
const { Text } = Typography;


const categories = [
    { key: '1', label: 'Inicio', path: '/' },
    { key: '2', label: 'Proteínas', path: '/category/proteinas' },
    { key: '3', label: 'Creatinas', path: '/category/creatinas' },
    { key: '4', label: 'Accesorios', path: '/category/accesorios' },
    { key: '5', label: 'Carrito', path: '/cart' },
    { key: '6', label: 'Checkout', path: '/checkout' },
];

const NavBar = () => {

    const location = useLocation();
    
    const selectedKeys = [location.pathname];

    const menuItems = categories.map(cat => ({
    key: cat.path, 
    label: (
        <Link to={cat.path}>
            {cat.label}
        </Link>
    ),
}));

    return (
        <Header style={{ 
            padding: '0 20px', 
            backgroundColor: '#1C1C1C', 
            borderBottom: '1px solid #333',
            height: 64, 
            lineHeight: '64px',
        }}>
            <Row justify="space-between" align="middle" style={{ height: '100%' }}>
                
               
                <Col>
                    <Link to="/">
                        <Text style={{ color: '#FFF', fontSize: '24px', fontWeight: 'bold' }}>GYM TENSE</Text>
                    </Link>
                </Col>

               
                <Col flex="auto" style={{ textAlign: 'center' }}>
                    <Menu
                        mode="horizontal"
                        theme="dark" 
                        selectedKeys={selectedKeys}
                        items={menuItems.filter(item => item.key !== '/cart' && item.key !== '/checkout')} 
                        style={{ 
                            backgroundColor: '#1C1C1C', 
                            borderBottom: 'none', 
                            lineHeight: '64px', 
                            justifyContent: 'center'
                        }}
                    />
                </Col>
                <Col>
                    <div style={{ marginLeft: 'auto', paddingRight: '24px' }}>
                        <CartWidget />
                    </div>
                </Col>
            </Row>
        </Header>
    );
};

export default NavBar;