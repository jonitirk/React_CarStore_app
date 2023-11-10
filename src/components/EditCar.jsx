import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";
import { useState } from "react";



export default function EditCar(props) {

    const [car, setCar] = useState({ brand: '', model: '' });
    const [open, setOpen] = useState(false);

    const handleClose = (event, reason) => {
        if (reason != 'backdropClick')
            setOpen(false);
    }

    const handleClickOpen = () => {
        setCar({ brand: props.car.brand, model: props.car.model })
        setOpen(true);
    }

    const handleInputChanged = (event) => {
        setCar({ ...car, [event.target.name]: event.target.value })
    }

    const handleSave = () => {
        //props.editCar(car); // tähän update
        const newCar = { brand: car.brand, model: car.model };
        props.editCar(props.params, newCar);
        setOpen(false);
    }

    return (
        <div>
            <Button size="small" color="warning" onClick={() => handleClickOpen()}>Edit Car</Button>
            <Dialog
                open={open}
                onClose={handleClose}>
                <DialogTitle>Edit Car</DialogTitle>
                <DialogContent>
                    <TextField
                        label='Brand'
                        name='brand'
                        value={car.brand}
                        onChange={handleInputChanged}
                    ></TextField>
                    <TextField
                        label='Model'
                        name='model'
                        value={car.model}
                        onChange={handleInputChanged}
                    ></TextField>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Close</Button>
                    <Button onClick={handleSave}>Save</Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}