import { React, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Box } from "@mui/material";
import {
  Button,
  Typography,
  FormControl,
  FormHelperText,
} from "@material-ui/core";
import MaterialReactTable from "material-react-table";
import PublishIcon from '@mui/icons-material/Publish';
const useStyles = makeStyles((theme) => ({
  input: {
    display: "none",
  },
}));

const ImportStudents = () => {
  const classes = useStyles();
  const [data, setData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [file, setFile] = useState(null);
  const [error, setError] = useState(null);

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
      const response = await fetch("/import-excel", {
        method: "POST",
        body: formData,
      });
      const excelData = await response.json();
      for (let p = 0; p < Object.keys(excelData).length; p++) {
        data.push(excelData[p]);
      }
      for (const column of Object.keys(excelData[0])) {
        columns.push({ accessorKey: column, header: column });
      }
      setColumns([...columns]);
      setData([...data]);
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {
        <Box sx={{ p: 2 }}>
          <MaterialReactTable
            columns={columns}
            data={data}
            muiTablePaginationProps={{
              rowsPerPageOptions: [5,50,100,150,200,250],
              showFirstButton: false,
              showLastButton: false,
            }}
            renderTopToolbarCustomActions={() => (
                <FormControl>
                <Box sx={{ display: 'flex', gap: '1rem', p: '0.5rem'}}>
                   
                    <input
                        accept="*"
                        className={classes.input}
                        id="contained-button-file"
                        type="file"
                        onChange={handleChange}
                    />
                    <label htmlFor="contained-button-file">
                        <Button variant="contained" component="span" color="success">
                            Upload
                        </Button>
                    </label>
                    {file && (
                        <Typography variant="subtitle1">{file.name}</Typography>
                    )}
                    {error && <FormHelperText error>{error}</FormHelperText>}
            
                    <Button type="submit" variant="contained" endIcon={<PublishIcon/>}>
                    Submit
                </Button>
              
                </Box>
                </FormControl>
           
            )}
          />
        </Box>
      }
    </form>
  );
};

export default ImportStudents;
