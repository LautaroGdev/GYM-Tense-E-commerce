import React, { useState, useEffect } from 'react';
import { Button, InputNumber, Space, message, Typography} from 'antd';
import { MinusOutlined, PlusOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import { useCart } from '../contexto/CartContext.jsx'; 


const { Text } = Typography;


/**
 * Componente contador para agregar tems al carrito.
 *  * @param {number} initial - Cantidad inicial del contador.
 * @param {number} stock - Máximo de unidades disponibles (stock total del producto).
 * @param {function} onAdd - Función que se ejecuta al clickear "Añadir al Carrito".
 * @param {object} item - Producto completo, usado para obtener el ID para la consulta de carrito.
 */


    const ItemCount = ({ initial = 1, stock, onAdd, item }) => { 
        
    const { getQuantityById } = useCart();
    
    const [count, setCount] = useState(initial);

   
    const addedQuantity = item ? getQuantityById(item.id) : 0;
    
    
    const availableStock = Math.max(0, stock - addedQuantity); 
    
    
    const isOutOfStock = stock <= 0 || availableStock === 0;

    
    useEffect(() => {
        
        if (availableStock === 0) {
            setCount(0);
        } else if (count > availableStock) {
            
            setCount(Math.max(1, availableStock));
        } else if (count === 0 && availableStock > 0) {
            
            setCount(1);
        }
    }, [availableStock]); 


    const increment = () => {
        // incrementamos si no supera el stock disponible restante
        if (count < availableStock) {
             setCount(count + 1);
        } else {
            message.warning(`Has alcanzado el límite de stock disponible (${availableStock} unidades restantes).`);
        }
    };

    const decrement = () => {
        if (count > 1) {
            setCount(count - 1);
        } else {
            message.warning('La cantidad mínima a añadir es 1.');
        }
    };

    // accion de anadir al carrito
    const handleAdd = () => {
        // validacion final antes de llamar a onAdd
        if (availableStock > 0 && count > 0 && count <= availableStock) {
            onAdd(count);
            setCount(availableStock - count >= 1 ? 1 : 0);
        } else {
            message.error('No hay stock disponible para agregar esta cantidad.');
        }
    };

    return (
        <Space size="middle" orientation="vertical" style={{ width: '100%', maxWidth: '250px' }}>
            {/* Controles de cantidad */}
            <Space size="small">
                <Button 
                    icon={<MinusOutlined />} 
                    onClick={decrement} 
                    disabled={count <= 1 || isOutOfStock}
                />
                <InputNumber
                    min={1}
                    // El máximo se fija al stock disponible restante
                    max={availableStock} 
                    value={count}
                    disabled={isOutOfStock}
                    onChange={setCount} 
                    style={{ width: 80, textAlign: 'center' }}
                />
                <Button 
                    icon={<PlusOutlined />} 
                    onClick={increment} 
                    // Deshabilitado si ya alcanzó el stock disponible restante
                    disabled={count >= availableStock || isOutOfStock}
                />
            </Space>

            {/* Botón añadir al carrito */}
            <Button 
                type="primary" 
                size="large" 
                icon={<ShoppingCartOutlined />}
                onClick={handleAdd}
                disabled={isOutOfStock || count < 1}
                style={{ backgroundColor: '#FF4500', borderColor: '#FF4500', width: '200px' }}
            >
                {isOutOfStock ? 'Stock Agotado' : `Añadir ${count} al Carrito`}
            </Button>
            
            {/* Mensaje informativo para el usuario */}
            {addedQuantity > 0 && (
                <Text type="warning" style={{ display: 'block', fontWeight: 'bold' }}>
                    ¡Atención! Ya tienes {addedQuantity} unidad(es) en tu carrito. 
                    Solo puedes añadir {availableStock} más.
                </Text>
            )}
            <Text type="secondary" style={{ display: 'block' }}>
                Stock Total: {stock} unidades. 
            </Text>
        </Space>
    );
};

export default ItemCount;