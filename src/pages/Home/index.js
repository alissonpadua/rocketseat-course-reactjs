import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { MdAddShoppingCart } from 'react-icons/md';

import * as CartActions from '../../store/modules/cart/actions';
import api from '../../services/api';
import { ProductList } from './styles';
import { formatPrice } from '../../util/format';

export default function Home() {
  const [products, setProducts] = useState([]);

  const amount = useSelector(state =>
    state.cart.reduce((sumAmount, product) => {
      sumAmount[product.id] = product.amount;
      return sumAmount;
    }, {})
  );

  const dispatch = useDispatch();

  useEffect(() => {
    async function loadProducts() {
      const response = await api.get('products');

      const data = response.data.map(product => ({
        ...product,
        formattedPrice: formatPrice(product.price),
      }));

      setProducts(data);
    }

    loadProducts();
  }, []);

  // SEM NECESSIDADE DE USAR USECALLBACK()
  // POIS ESSA FUNÇÃO SÓ DEPENDE DO
  // PRÓPRIO PARÂMENTRO E NÃO DE ALGUM OUTRO STATE
  function handdleAddPRoduct(id) {
    dispatch(CartActions.addToCartRequest(id));
  }

  return (
    <ProductList>
      {products.map(product => (
        <li key={product.id}>
          <img src={product.image} alt={product.title} />
          <strong>{product.title}</strong>
          <span>{product.formattedPrice}</span>

          <button type="button" onClick={() => handdleAddPRoduct(product.id)}>
            <div>
              <MdAddShoppingCart size={16} color="#FFF" />
              <span>{amount[product.id] || 0}</span>
            </div>
            <span>ADICIONAR AO CARRINHO</span>
          </button>
        </li>
      ))}
    </ProductList>
  );
}
