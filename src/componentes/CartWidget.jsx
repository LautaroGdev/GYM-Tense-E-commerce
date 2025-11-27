import React from 'react';
import { ShoppingCartOutlined } from '@ant-design/icons';
import { Badge, Typography } from 'antd';
import { useCart } from '../contexto/CartContext.jsx'; 
import { Link } from 'react-router-dom';

const { Text } = Typography;

// icono del carrito y la cantidad total de items.
const CartWidget = () => {
    
    const { totalItems } = useCart(); 

    if (totalItems === 0) {
        return (
            <Link to="/cart" style={{ color: 'inherit' }}>
                <ShoppingCartOutlined style={{ fontSize: '24px' }} />
            </Link>
        );
    }

    return (
        <Link to="/cart" style={{ color: 'inherit', textDecoration: 'none' }}>
            <Badge 
                count={totalItems}
                offset={[0, -5]}   
                showZero={false}  
                style={{ backgroundColor: '#FF4500' }} 
            >
                <ShoppingCartOutlined 
                    style={{ fontSize: '24px', color: totalItems > 0 ? '#FFFFFF' : '#DDD', transition: 'color 0.3s' }} 
                />
            </Badge>
        </Link>
    );
};

export default CartWidget;