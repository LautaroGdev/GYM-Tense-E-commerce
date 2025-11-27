import React from 'react';
import { Row, Col } from 'antd';
import Item from './Item.jsx'; 

const ItemList = ({ products }) => { 
    return (
        <Row 
            gutter={[24, 24]} 
            justify="center" 
        >
            {products.map(product => (
                <Col 
                    key={product.id} 
                    xs={24}   
                    sm={12}   
                    md={8}    
                    lg={6}    
                >
                    <Item product={product} /> 
                </Col>
            ))}
        </Row>
    );
};

export default ItemList;