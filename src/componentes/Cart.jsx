import React from 'react';
import { useCart } from '../contexto/CartContext';
import { Link, useNavigate } from 'react-router-dom';
import { 
    Button, 
    Table, 
    Typography, 
    Space, 
    Empty, 
    Card, 
    Image, 
    Popconfirm,
    message 
} from 'antd';
import { 
    DeleteOutlined, 
    ShoppingCartOutlined, 
    RollbackOutlined, 
    CheckCircleOutlined 
} from '@ant-design/icons';

const { Title, Text } = Typography;

const Cart = () => {
    const { 
        cart, 
        totalPrice, 
        removeItem, 
        clearCart 
    } = useCart();
    
    const navigate = useNavigate();

    //formatear el precio a pesos
    const formatPrice = (price) => {
        if (price === undefined || price === null) return 'N/A';
        return parseFloat(price).toLocaleString('es-AR', {
            style: 'currency',
            currency: 'ARS',
            minimumFractionDigits: 2,
        });
    };
    
    // si el carrito esta vacio, muestra un mensaje de bienvenida
    if (cart.length === 0) {
        return (
            <div style={{ padding: '50px', textAlign: 'center' }}>
                <Empty
                    image={<ShoppingCartOutlined style={{ fontSize: 60, color: '#FF4500' }} />}
                    description={
                        <Title level={3}>Tu carrito está vacío</Title>
                    }
                >
                    <Text type="secondary" style={{ marginBottom: 20, display: 'block' }}>
                        ¡Parece que no has añadido nada todavía! Explora nuestros productos.
                    </Text>
                    <Button 
                        type="primary" 
                        size="large" 
                        icon={<RollbackOutlined />}
                        onClick={() => navigate('/')}
                        style={{ backgroundColor: '#FF4500', borderColor: '#FF4500' }}
                    >
                        Ver Productos
                    </Button>
                </Empty>
            </div>
        );
    }

    // Configuración de las columnas de la tabla
    const columns = [
        {
            title: 'Producto',
            dataIndex: 'name',
            key: 'name',
            render: (name, item) => (
                <Space>
                    <Image
                        src={item.imageUrl || item.img || `https://placehold.co/60x60/1C1C1C/FFFFFF?text=${item.name.substring(0, 1)}`}
                        alt={name}
                        width={60}
                        style={{ borderRadius: '4px', objectFit: 'cover' }}
                        preview={false}
                    />
                    <Link to={`/item/${item.id}`} style={{ fontWeight: 600, color: '#1C1C1C' }}>
                        {name}
                    </Link>
                </Space>
            ),
        },
        {
            title: 'Cantidad',
            dataIndex: 'quantity',
            key: 'quantity',
            align: 'center',
            render: (quantity) => <Text strong>{quantity}</Text>
        },
        {
            title: 'Precio Unitario',
            dataIndex: 'price',
            key: 'price',
            align: 'right',
            render: (price) => formatPrice(price),
        },
        {
            title: 'Subtotal',
            key: 'subtotal',
            align: 'right',
            render: (_, item) => (
                <Text strong>{formatPrice(item.price * item.quantity)}</Text>
            ),
        },
        {
            title: 'Acciones',
            key: 'actions',
            align: 'center',
            render: (_, item) => (
                <Popconfirm
                    title="¿Estás seguro de eliminar este producto?"
                    onConfirm={() => removeItem(item.id)}
                    okText="Sí, Eliminar"
                    cancelText="No"
                >
                    <Button 
                        icon={<DeleteOutlined />} 
                        danger 
                        type="text" 
                        tooltip="Eliminar item"
                    />
                </Popconfirm>
            ),
        },
    ];

    return (
        <div style={{ maxWidth: '1200px', margin: '40px auto', padding: '0 20px' }}>
            <Title level={2} style={{ color: '#1C1C1C', marginBottom: 30 }}>
                <ShoppingCartOutlined style={{ marginRight: 10, color: '#FF4500' }} />
                Tu Carrito de Compras
            </Title>
            
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '30px' }}>
                
                <div style={{ flex: '3 1 700px' }}>
                    <Table
                        dataSource={cart}
                        columns={columns}
                        rowKey="id"
                        pagination={false}
                        summary={() => (
                            <Table.Summary.Row style={{ backgroundColor: '#f0f0ff' }}>
                                <Table.Summary.Cell index={0} colSpan={3}>
                                    <Text strong>Total de Productos en Carrito</Text>
                                </Table.Summary.Cell>
                                <Table.Summary.Cell index={3} align="right">
                                    <Text strong style={{ fontSize: '1.2em', color: '#FF4500' }}>
                                        {formatPrice(totalPrice)}
                                    </Text>
                                </Table.Summary.Cell>
                                <Table.Summary.Cell index={4} />
                            </Table.Summary.Row>
                        )}
                        style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.05)', borderRadius: '8px' }}
                    />
                    
                    <Space style={{ marginTop: 20, justifyContent: 'space-between', width: '100%' }}>
                        <Button 
                            icon={<RollbackOutlined />} 
                            onClick={() => navigate(-1)}
                        >
                            Seguir Comprando
                        </Button>
                        <Popconfirm
                            title="¿Estás seguro de vaciar completamente el carrito?"
                            onConfirm={clearCart}
                            okText="Sí, Vaciar"
                            cancelText="No"
                        >
                            <Button 
                                icon={<DeleteOutlined />} 
                                danger
                            >
                                Vaciar Carrito
                            </Button>
                        </Popconfirm>
                    </Space>
                </div>

                <div style={{ flex: '1 1 300px' }}>
                    <Card 
                        title="Resumen del Pedido" 
                        bordered={false}
                        style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.05)', borderRadius: '8px' }}
                    >
                        <Space direction="vertical" style={{ width: '100%' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                                <Text>Subtotal:</Text>
                                <Text>{formatPrice(totalPrice)}</Text>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 10, borderBottom: '1px solid #f0f0f0' }}>
                                <Text>Envío (Estimado):</Text>
                                <Text>Gratis</Text>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 10 }}>
                                <Title level={4} style={{ margin: 0 }}>Total:</Title>
                                <Title level={4} style={{ margin: 0, color: '#FF4500' }}>{formatPrice(totalPrice)}</Title>
                            </div>
                            
                            <Button 
                                type="primary" 
                                size="large" 
                                block
                                icon={<CheckCircleOutlined />}
                                onClick={() => navigate('/checkout')}
                                style={{ marginTop: 20, backgroundColor: '#FF4500', borderColor: '#FF4500' }}
                            >
                                Finalizar Compra
                            </Button>
                        </Space>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default Cart;