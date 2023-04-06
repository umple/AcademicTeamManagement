import { React, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Box } from "@mui/material";
import {
  Button,
  Typography,
  FormHelperText,
} from "@material-ui/core";
import PublishIcon from '@mui/icons-material/Publish';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

const useStyles = makeStyles((theme) => ({
  input: {
    display: "none",
  },
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  fileBox: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    border: "2px dashed #ccc",
    borderRadius: "4px",
    p: "1rem",
    mb: "1rem",
  },
  uploadButton: {
    mt: "1rem",
  },
  submitButton: {
    mt: "1rem",
    alignSelf: "flex-end",
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
    formData.append("column", JSON.stringify(props.columns))
    // formData.append("columns",props.defaultColumns)
    fetch("api/importStudent", {
      method: "POST",
      body: formData,
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        const excelData = data; // assuming the response is an array of objects
       
        props.fetchStudents();
        props.handleImportSuccess(true);
        props.closeModal();
      })
      .catch((error) => {
        setError(error.message);
      });
  };


  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <form onSubmit={handleSubmit} className={classes.container}>
        {file ? (
          <Box className={classes.fileBox}>
            <CloudUploadIcon sx={{ fontSize: '4rem', color: '#999' }} />
            <Box sx={{ mt: '1rem' }}>
              <strong>{file.name}</strong>
            </Box>
            <Button variant="contained" type="submit" color="success" className={classes.uploadButton}>
              Submit
            </Button>
          </Box>
        ) : (
          <Box className={classes.fileBox}>
            <Box sx={{ mb: '1rem' }}>Drag and drop your file here or</Box>
            <input
              accept="*"
              className={classes.input}
              id="contained-button-file"
              type="file"
              onChange={handleChange}
            />
            <label htmlFor="contained-button-file" className={classes.buttonLabel}>
              <Button variant="contained" color="success" component="span" >
                Browse Files
              </Button>
            </label>

          </Box>
        )}
      </form>
    </Box>
  );
};

export default ImportStudents;
