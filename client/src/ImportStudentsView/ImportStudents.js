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

const ImportStudents = (props) => {
  const classes = useStyles();
  const [file, setFile] = useState(null);
  const [columns, setColumns] = useState([]);
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
      const response = await fetch("api/importStudent", {
        method: "POST",
        body: formData,
      });
      const excelData = await response.json();
      const newColumns = [];
      for (const column of Object.keys(excelData[0])) {
        newColumns.push({ accessorKey: column, header: column });
      }
      props.updateColumns(newColumns);

    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} sx={{ gap: '1rem', p: '10rem' }}>
      <input
        accept="*"
        className={classes.input}
        id="contained-button-file"
        type="file"
        onChange={handleChange}
      />
      <label htmlFor="contained-button-file">
        <Button variant="contained" color="success">
          Upload
        </Button>
      </label>
      {file && (
        <Typography variant="subtitle1">{file.name}</Typography>
      )}
      {error && <FormHelperText error>{error}</FormHelperText>}
      <Button type="submit" variant="contained" endIcon={<PublishIcon />}>
        Submit
      </Button>
    </form>
  );
};

export default ImportStudents;
