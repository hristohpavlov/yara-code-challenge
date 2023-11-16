import { useQuery } from "@apollo/client";
import { GET_WAREHOUSES } from "../../graphql/queries";
import WarehouseStockMovement from "./WarehouseStockMovement";
import { useState } from "react";
import WarehouseStockList from "./WarehouseStockList";

function WarehouseStockMovementComponent(){
    const { loading, error, data } = useQuery(GET_WAREHOUSES);
    const [selectedWarehouseId, setSelectedWarehouse] = useState('1');
    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;
  return (
    <div>
        <select value={selectedWarehouseId} onChange={(e) => setSelectedWarehouse(e.target.value)}>
            {data.warehouses.map((warehouse: any) => (
            <option key={warehouse.id} value={warehouse.id}>
                {warehouse.name}
            </option>
            ))}
        </select>
        <WarehouseStockMovement selectedWarehouseId={selectedWarehouseId}/>
        <WarehouseStockList selectedWarehouseId={selectedWarehouseId}/>
    </div>
  );
};

export default WarehouseStockMovementComponent;