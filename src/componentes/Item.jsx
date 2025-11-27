import React from 'react';
import { Card, Button, Typography, Tag } from 'antd';
import { DollarOutlined, EyeOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';

const { Meta } = Card;
const { Text } = Typography;

const styles = {
    card: {
        width: '100%',
        margin: '15px 0',
        borderRadius: 10,
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        transition: 'all 0.3s',
        cursor: 'pointer', 
    },
    tag: {
        marginBottom: 8,
        backgroundColor: '#FF4D4F', 
        color: 'white',
        fontWeight: 'bold',
    },
    price: {
        fontSize: '1.2em',
        fontWeight: 'bold',
        color: '#1C1C1C',
    }
};

const Item = ({ product }) => {
    
    const handleButtonClick = (e) => {
        e.stopPropagation(); 
    };

    return (
        <Link to={`/item/${product.id}`} style={{ textDecoration: 'none' }}>
            <Card
                hoverable
                style={styles.card}
                cover={<img alt={product.name} src={product.imageUrl || product.img || `https://placehold.co/300x200/FF4D4F/FFFFFF?text=${product.name}`} style={{ height: '200px', objectFit: 'cover' }} />}

                actions={[
                    <Link to={`/item/${product.id}`} key="view">
                        <Button 
                            type="primary" 
                            icon={<EyeOutlined />} 
                            style={{ backgroundColor: '#FF4500', borderColor: '#FF4500' }}
                        >
                            Ver Detalle
                        </Button>
                    </Link>,
                ]}
            >
                <Tag style={styles.tag}>{product.category}</Tag>
                
                <Meta
                    title={<Text style={{ fontWeight: 'bold' }}>{product.name}</Text>}
                    description={
                        <>
                            <Text type="secondary" ellipsis>{product.description}</Text>
                            <div style={{ marginTop: 10 }}>
                                <Text style={styles.price}>
                                    <DollarOutlined /> ${product.price}
                                </Text>
                            </div>
                            <Text type="secondary" style={{ display: 'block' }}>Stock: {product.stock}</Text>
                        </>
                    }
                />
            </Card>
        </Link>
    );
};

export default Item;