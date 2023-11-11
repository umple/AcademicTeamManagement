import { makeStyles } from "@mui/styles";
export const useStyles = makeStyles((theme) => ({
    formContainer: {
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: '32px',
      marginBottom: '32px',
    },
    root: {
      margin: "1rem",
      minWidth: 350,
    },
    button: {
      marginTop: "1rem",
    },
    addButton: {
      marginTop: "3rem",
    },
    container: {
      flexDirection: "column",
      alignItems: "center",
    },
    title: {
      fontWeight: "bold",
      fontSize: "2rem",
      marginBottom: "1rem",
    },
    bold: {
      fontWeight: "bold",
    },
    status: {
      borderRadius: "0.25rem",
      color: "#fff",
      maxWidth: "9ch",
      padding: "0.25rem",
    },
    Available: {
      backgroundColor: "#4caf50",
    },
    Underway: {
      backgroundColor: "#ff9800",
    },
    Completed: {
      backgroundColor: "#3f51b5",
    },
    Cancelled: {
      backgroundColor: "#f44336",
    },
    Proposed: {
      backgroundColor: "#ef6694",
    },
    info: {
      backgroundColor: "#2196f3",
    },
    modal: {
      position: "absolute",
      width: "600px",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      backgroundColor: "#fff",
      borderRadius: "0.5rem",
      boxShadow: 24,
      p: 4,
    },
    textField: {
      "& .MuiInputLabel-root": {
        color: "#6b6b6b",
        fontWeight: "bold",
      },
      "& .MuiOutlinedInput-root": {
        "& fieldset": {
          borderColor: "#c8c8c8",
        },
        "&:hover fieldset": {
          borderColor: "#afafaf",
        },
        "&.Mui-focused fieldset": {
          borderColor: "#2196f3",
        },
      },
    },
  }));
  