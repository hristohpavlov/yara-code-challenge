import React from 'react';
import { BrowserRouter as Router, Link, Route, Routes } from 'react-router-dom';
import ProductEntryComponent from '../products/ProductEntryComponent';
import WarehouseStockMovementComponent from '../warehouse/WarehouseStockMovementComponent';

const AppLayout: React.FC = () => {
  return (
    <Router>
      <nav>
        <ul>
          <li>
            <Link to="/product-entry">Product Entry</Link>
          </li>
          <li>
            <Link to="/warehouse-movement">Warehouse Stock Movement</Link>
          </li>
        </ul>
      </nav>

      <Routes>
        <Route path="/product-entry" element={<ProductEntryComponent />} />
        <Route path="/warehouse-movement" element={<WarehouseStockMovementComponent />} />
      </Routes>
    </Router>
  );
};

export default AppLayout;