import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Button, Input, Typography, FormControl, FormHelperText } from "@material-ui/core";
import MaterialReactTable from 'material-react-table';

const useStyles = makeStyles((theme) => ({
    input: {
        display: "none",
    },
}));

const data = [{}];
const columns = [
    {
        accessorKey: 'first',
        header: 'First',
    },
    {
        accessorKey: 'last',
        header: 'Last',
    },
];
const ImportStudents = () => {
    const classes = useStyles();
    const [file, setFile] = useState(null);
    const [error, setError] = useState(null);
    const [tableData, setTableData] = useState(() => data);

    const handleChange = (event) => {
        setFile(event.target.files[0]);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!file) {
            setError("Please select a file.");
            return;
        }

        const formData = new FormData();
        formData.append("file", file);

        try {
            const response = await fetch("http://localhost:3000/import-excel", {
                method: "POST",
                body: formData,
            });
            const excelData = await response.json();
            setTableData(excelData)
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <FormControl>
                <input
                    accept="*"
                    className={classes.input}
                    id="contained-button-file"
                    type="file"
                    onChange={handleChange}
                />
                <label htmlFor="contained-button-file">
                    <Button variant="contained" component="span">
                        Upload
                    </Button>
                </label>
                {file && (
                    <Typography variant="subtitle1">{file.name}</Typography>
                )}
                {error && <FormHelperText error>{error}</FormHelperText>}
            </FormControl>
            <Button type="submit" variant="contained">
                Submit
            </Button>
            {data.length > 0 && (
                <MaterialReactTable
                    columns={columns}
                    data={excel}
                />
            )}
        </form>
    );
};

export default ImportStudents;