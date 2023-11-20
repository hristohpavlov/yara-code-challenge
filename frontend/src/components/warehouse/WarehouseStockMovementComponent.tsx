import { useQuery } from "@apollo/client";
import { GET_WAREHOUSES } from "../../graphql/queries";
import WarehouseStockMovement from "./WarehouseStockMovement";
import { useState } from "react";
import WarehouseStockList from "./WarehouseStockList";
import { Warehouse } from "../../graphql/types";

function WarehouseStockMovementComponent(){
    const { loading, error, data } = useQuery(GET_WAREHOUSES);
    const [selectedWarehouseId, setSelectedWarehouseId] = useState('1');
    const warehouses = data?.warehouses;
    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;
  return (
    <div>
        <select value={selectedWarehouseId} onChange={(e) => {setSelectedWarehouseId(e.target.value);}}>
            {warehouses.map((warehouse: Warehouse) => (
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