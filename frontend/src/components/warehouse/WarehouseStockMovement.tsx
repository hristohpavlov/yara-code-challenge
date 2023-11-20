import React, { useEffect, useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { ADD_MOVEMENT } from '../../graphql/mutations';
import { GET_MOVEMENTS, GET_IMPORT_MOVEMENTS, GET_PRODUCTS, GET_WAREHOUSES} from '../../graphql/queries';
import { Movement, Product, Warehouse } from '../../graphql/types';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Container, Row, Col, Form, Button, InputGroup } from 'react-bootstrap';
interface warehouseProps{
  selectedWarehouseId?: string
}
function WarehouseStockMovement(props: warehouseProps) {
  const [date, setDate] = useState<Date | null>(null);
  const [type, setType] = useState('');
  const [selectedProduct, setSelectedProduct] = useState('');
  const [amount, setAmount] = useState(0.0);
  const [stockCalculations, setStockCalculations] = useState<{
    currentStockLevel: number;
    remainingStockSpace: number;
  } | null>(null);
  const { loading: loadingProducts, error: errorProducts, data: productData } = useQuery(GET_PRODUCTS, {
    variables: { warehouseId: props.selectedWarehouseId}, // Pass the selected warehouse ID as a variable
  });
  const { loading: importMovementsLoading, error: importMovementsError, data: importMovementsData } = useQuery(GET_IMPORT_MOVEMENTS, {
    variables: { warehouseId: props.selectedWarehouseId},
  });
  const { loading: movementsLoading, error: movementsError, data: movementsData } = useQuery(GET_MOVEMENTS, {
    variables: { warehouseId: props.selectedWarehouseId },
  });
  const { loading: wareLoading, error: wareError, data: wareData } = useQuery(GET_WAREHOUSES)
  const movementTypes = ['import', 'export']; 
  const products = productData?.products;
  
  const [addMovement] = useMutation(ADD_MOVEMENT, {
    refetchQueries: [{ query: GET_MOVEMENTS, 
      variables: { warehouseId: props.selectedWarehouseId },
    }],
  });
  const hazardousWare = wareData.warehouses.filter((ware: Warehouse) => ware.id === props.selectedWarehouseId)[0].hazardous
  useEffect(() => {
    setAmount(0.0)
    setType('import');
    setSelectedProduct(products?.filter((product: Product) => (product.hazardous === hazardousWare || hazardousWare === null))[0].id)
    if (!movementsLoading && !movementsError && movementsData && movementsData.movements.length > 0) {
      const warehouseSize = movementsData.movements[0]?.warehouse?.size;
      // Call the REST API to calculate stock
      calculateStock(movementsData?.movements, warehouseSize);
    }
  },[props.selectedWarehouseId, movementsLoading, movementsError, movementsData])
  if (loadingProducts) return <p>Loading...</p>;
  if (errorProducts) return <p>Error:{errorProducts.message}</p>;
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const stockCheckResponse = await fetch('http://localhost:3001/calculate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          movements: movementsData?.movements || [],
          warehouseSize: movementsData?.movements[0].warehouse.size,
        }),
      });

      if (!stockCheckResponse.ok) {
      // If the response is not ok, handle the error and return
      const errorData = await stockCheckResponse.json();
      console.error('Error checking stock:', errorData.error);
      return;
    }

      const stockCheckResult = await stockCheckResponse.json();
      if (type === 'import') {
        const productSize = selectedProduct ? products.find((p:any) => p.id === selectedProduct)?.size || 0 : 0;
        const importSpaceRequired = productSize * amount;
      
        if (stockCheckResult.remainingStockSpace >= importSpaceRequired) {
          // Enough space, proceed to add the import movement
          await addMovement({
            variables: { date, type, productId: selectedProduct, warehouseId: props.selectedWarehouseId, amount },
          });
          // Update local state
          setDate(today);
          setAmount(0.0);
          setType('import');
          setSelectedProduct(
            products
              ?.filter((product: Product) => product.hazardous === hazardousWare || hazardousWare === null)
              .map((product: Product) => product.id)
          );
        } else {
          // Not enough space, handle the error as needed
          console.error('Not enough space in the warehouse for import');
        }
      } else if (type === 'export') {
        const productSize = importedProducts?.find((impProduct: any) => impProduct.product.id === selectedProduct)?.product.size || 0;
        const exportAmount = productSize * amount;
      
        if (stockCheckResult.currentStockLevel >= exportAmount) {
          // Enough stock, proceed to add the export movement
          await addMovement({
            variables: { date, type, productId: selectedProduct, warehouseId: props.selectedWarehouseId, amount },
          });
          // Update local state
          setDate(today);
          setAmount(0.0);
          setType('import');
          setSelectedProduct(
            products
              ?.filter((product: Product) => product.hazardous === hazardousWare || hazardousWare === null)
              .map((product: Product) => product.id)
          );
        } else {
          // Not enough stock, handle the error as needed
          console.error('Not enough stock to export');
        }
      }
    } catch (error) {
      console.error('Error adding movement:', error);
    }
  };
  const importedProducts = importMovementsData?.movements;
  const today = new Date();
  const calculateStock = async (movements: Movement[], warehouseSize: number) => {
    try {
      const response = await fetch('http://localhost:3001/calculate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ movements, warehouseSize }),
      });
  
      if (response.ok) {
        const result = await response.json();
        setStockCalculations(result);
      } else {
        const errorData = await response.json();
        throw new Error(`Failed to calculate stock: ${errorData.error}`);
      }
    } catch (error) {
      console.error('Error calculating stock:', error);
    }
  };
  
  return (
    <Container>
    <h2>Warehouse Stock Movement</h2>
    <Container>
      <Row>
        <Col>
          <div>
            <p>Current Stock Level: {stockCalculations?.currentStockLevel}</p>
            <p>Remaining Stock Space: {stockCalculations?.remainingStockSpace}</p>
          </div>
        </Col>
      </Row>
      <Row>
        <Col>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="movementType">
              <Form.Label>Type (import/export):</Form.Label>
              <Form.Control as="select" value={type} onChange={(e) => setType(e.target.value)} required>
                {movementTypes.map((movementType) => (
                  <option key={movementType} value={movementType}>
                    {movementType}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>

            <Form.Group controlId="date">
              <Form.Label>Date:</Form.Label>
              {type === 'import' && <InputGroup>
                <DatePicker
                  selected={date}
                  onChange={(date) => setDate(date)}
                  dateFormat="yyyy-MM-dd"
                  className="form-control" // Add custom styling here
                />
              </InputGroup>}
              {type === 'export' && <InputGroup>
                <DatePicker
                  selected={date}
                  onChange={(date) => setDate(date)}
                  dateFormat="yyyy-MM-dd"
                  minDate={today}
                  className="form-control" // Add custom styling here
                />
              </InputGroup>}
            </Form.Group>

            <Form.Group controlId="chooseProduct">
              <Form.Label>Choose Product:</Form.Label>
              <Form.Control as="select" value={selectedProduct} onChange={(e) => setSelectedProduct(e.target.value)} required>
                {type === 'export' && importedProducts?.map((importedProduct: any) => (
                  <option key={importedProduct.product.id} value={importedProduct.product.id}>
                    {importedProduct.product.name}
                  </option>
                ))}
                {type === 'import' && products
                  .filter((product: Product) => (product.hazardous === hazardousWare || hazardousWare === null))
                  .map((product: Product) => (
                    <option key={product.id} value={product.id}>
                      {product.name}
                    </option>
                  ))}
              </Form.Control>
            </Form.Group>

            <Form.Group controlId="amount">
              <Form.Label>Amount:</Form.Label>
              <Form.Control type="number" value={amount} onChange={(e) => setAmount(parseFloat(e.target.value))} required />
            </Form.Group>

            <Button variant="primary" type="submit">
              Add Movement
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  </Container>
  );
};

export default WarehouseStockMovement;