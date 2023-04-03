import { React, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Box } from "@mui/material";
import {
  Button,
  Typography,
  FormHelperText,
} from "@material-ui/core";
import PublishIcon from '@mui/icons-material/Publish';

const useStyles = makeStyles((theme) => ({
  input: {
    display: "none",
  },
  buttonLabel: {
    display: "inline-block",
    marginRight: theme.spacing(1),
  }
}));

const ImportStudents = (props) => {
  const classes = useStyles();
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
    formData.append("columns",props.defaultColumns)
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
      newColumns.pop();
      props.updateColumns(newColumns);
      props.fetchStudents();
    } catch (error) {
      setError(error.message);
    }
  };


  return (
    <Box sx={{ display: 'flex', gap: '1rem', flexDirection: 'row' }}>
      <form onSubmit={handleSubmit}>
        <input
          accept="*"
          className={classes.input}
          id="contained-button-file"
          type="file"
          onChange={handleChange}
        />
        <label htmlFor="contained-button-file" className={classes.buttonLabel}>
          <Button variant="contained" color="success" component="span" >
            Upload
          </Button>
        </label>
     
        <Button type="submit" variant="contained" endIcon={<PublishIcon />}>
          Submit
        </Button>
      </form>

      <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
        {file && (
        <Typography variant="subtitle1">{file.name}</Typography>
        )}
        {error && <FormHelperText error>{error}</FormHelperText>}
      </Box>
    </Box>
  );
};

export default ImportStudents;
