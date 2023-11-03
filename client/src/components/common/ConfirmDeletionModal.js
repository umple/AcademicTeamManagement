import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const ConfirmDeletionModal = ({
  open,
  setOpen,
  handleDeletion,
  setRefreshTrigger,
  row,
  type,
}) => {
  const handleClose = () => {
    setOpen(false);
  };

  const dialogId = `dialog-${row.id}`;

  return (
    <>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        className="modal-dialog"
        onClose={handleClose}
        aria-describedby={`alert-dialog-slide-description-${dialogId}`} // Use a unique aria-describedby
      >
        <DialogTitle>
          {type === "group" ? (
            <span>Are you sure you want to delete group?</span>
          ) : type === "project" ? (
            <span>Are you sure you want to delete project?</span>
          ) : type === "student" ? (
            <span>Are you sure you want to delete student?</span>
          ) : type === "section" ? (
            <span>Are you sure you want to delete section?</span>
          ) : null}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            {type === "group" ? (
              <span>Group {row.getValue("group_id")}</span>
            ) : type === "project" ? (
              <span>Project: {row.getValue("project")}</span>
            ) : type === "student" ? (
              <span>Student: {row.getValue("username")}</span>
            ) : type === "section" ? (
              <span>Section: {row.getValue("name")}</span>
            ) : null}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Disagree</Button>
          <Button
            name="agreeToDelete"
            onClick={() => {
              handleDeletion(row);
            }}
          >
            Agree
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ConfirmDeletionModal;
