import { useEffect, useState } from "react"
import { AgGridReact } from 'ag-grid-react'; // the AG Grid React Component

import 'ag-grid-community/styles/ag-grid.css'; // Core grid CSS, always needed
import 'ag-grid-community/styles/ag-theme-material.css'; // Optional theme CSS
import { Button } from '@mui/material';
import { Snackbar } from '@mui/material';
import AddCar from "./AddCar";
import { useRef } from "react";
import EditCar from "./EditCar";

export default function Carlist() {

    const [cars, setCars] = useState([]);
    const [msg, setMsg] = useState('');
    const [open, setOpen] = useState(false);

    const gridRef = useRef();

    const columns = [
        { headerName: 'Brand', field: 'brand', sortable: true, filter: true },
        { headerName: 'Model', field: 'model', sortable: true, filter: true },
        { headerName: 'Color', field: 'color', sortable: true, filter: true },
        { headerName: 'Fuel', field: 'fuel', sortable: true, filter: true },
        { headerName: 'Year', field: 'year', sortable: true, filter: true },
        { headerName: 'Price', field: 'price', sortable: true, filter: true },
        {
            cellRenderer: params =>
                <Button size="small" color="error" onClick={() => deleteCar(params)}>
                    Delete
                </Button>,
            width: 120
        },
        {
            cellRenderer: params => <EditCar car={params.data} link={params.value} editCar={editCar} />,
            width: 120
        },
    ]


    const REST_URL = 'https://carrestapi.herokuapp.com/cars/';

    const getCars = () => {
        fetch(REST_URL)
            .then(response => response.json())
            .then(responseData => {
                console.log("responseData " + responseData._embedded.cars)
                setCars(responseData._embedded.cars)
            })
            .catch(error => console.error(error));
    }

    useEffect(() => getCars, [])

    const deleteCar = (params) => {
        console.log("params.data._links.car.href = " + params.data._links.car.href);
        console.log("id = " + gridRef.current.getSelectedNodes()[0].id);
        if (window.confirm('Are you sure')) {
            fetch(params.data._links.car.href, { method: 'DELETE' })
                .then(response => {
                    if (response.ok) {
                        setMsg('Car deleted successfully');
                        setOpen(true);
                        getCars();
                    } else
                        alert('Something went wrong in deletion: ' + response.status);
                })
                .catch(err => console.error(err));
        }
    }

    const addCar = (car) => {
        fetch(REST_URL, {
            method: 'POST',
            headers: { 'Content-type': 'application/json' },
            body: JSON.stringify(car)
        })
            .then(response => {
                if (response.ok)
                    getCars();
                else
                    alert('Something went wrong');
            })
            .catch(err => console.error(err))
    }

    const editCar = (params, car) => {
        fetch(params, {
            method: 'PUT',
            headers: { 'Content-type': 'application/json' },
            body: JSON.stringify(car)
        })
            .then(response => {
                if (response.ok)
                    getCars();
                else
                    alert('Something went wrong');
            })
            .catch(err => console.error(err))

    }

    return (
        <>
            <div className="ag-theme-material"
                style={{ height: '700px', width: '100%', margin: 'auto' }} >
                <AddCar addCar={addCar} />
                <AgGridReact
                    rowData={cars}
                    animateRows={true}
                    rowSelection="single"
                    columnDefs={columns}
                    pagination={true}
                    paginationPageSize={10}
                    ref={gridRef}
                    onGridReady={params => gridRef.current = params.api}
                >
                </AgGridReact>
                <Snackbar
                    open={open}
                    autoHideDuration={3000}
                    onClose={() => setOpen(false)}
                    message={msg}
                />

            </div>
        </>
    )
}