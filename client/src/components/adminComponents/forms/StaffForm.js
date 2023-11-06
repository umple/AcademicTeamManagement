import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  Stack,
  TextField,
  DialogActions,
  FormGroup,
  Select,
  MenuItem,
  InputLabel,
} from "@mui/material";
import React, { useState } from "react";
import { useFormik } from "formik";
import staffService from "../../../services/staffService";
import Staff from "../../../entities/Staff";
import staffSchema from "../../../schemas/staffSchema";

const StaffForm = ({
  open,
  columns,
  setCreateModalOpen,
  fetchStaffs,
  update,
  setUpdate,
  editingRow,
  staffs,
  setEditingRow,
}) => {
  const cellValueMap = [
    { value: "admin", label: "primary" },
    { value: "professor", label: "secondary" }
  ];

  const onSubmit = async (values, actions) => {
    try {
      let response;
      if (update) {
        response = await staffService.update(editingRow._id, values);
      } else {
        response = await staffService.add(values);
      }
      fetchStaffs();
    } catch (error) {
      console.log(error);
    }
    actions.resetForm();
    handleClose();
  };

  const handleClose = () => {
    setCreateModalOpen(false);
    setUpdate(false);
    setEditingRow({});
  };

  const [initialStaffValues] = useState(
    update
      ? new Staff(editingRow)
      : new Staff({
          professorEmail: JSON.parse(localStorage.getItem("userEmail")),
        })
  );

  const {
    values,
    errors,
    touched,
    handleBlur,
    handleChange,
    handleSubmit,
    setFieldValue,
    setFieldTouched,
  } = useFormik({
    initialValues: initialStaffValues.toRequestJSON(),
    validationSchema: staffSchema(staffs,editingRow?._id),
    onSubmit,
  });
  return (
    <Dialog open={open || update}>
      <DialogTitle textAlign="center">
        {update ? "Edit Staff" : "Create New Staff"}
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Stack
            sx={{
              width: "100%",
              minWidth: { xs: "300px", sm: "360px", md: "400px" },
              gap: "1.5rem",
            }}
          >
            {columns.map((column) => {
              if (column.accessorKey === "role") {
                return (
                  <FormGroup>
                    <InputLabel id="role-label">Role</InputLabel>
                    <Select
                      labelId="role-label"
                      key={column.accessorKey}
                      label={column.header}
                      name={column.accessorKey}
                      value={values[column.accessorKey]}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={Boolean(
                        touched[column.accessorKey] &&
                          errors[column.accessorKey]
                      )}
                      helperText={
                        touched[column.accessorKey] &&
                        errors[column.accessorKey]
                      }
                    >
                      {cellValueMap.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.value}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormGroup>
                );
              } 
              return (
              <TextField
                key={column.accessorKey}
                label={column.header}
                name={column.accessorKey}
                value={values[column.accessorKey]}
                onChange={handleChange}
                onBlur={handleBlur}
                error={Boolean(
                  touched[column.accessorKey] && errors[column.accessorKey]
                )}
                helperText={
                  touched[column.accessorKey] && errors[column.accessorKey]
                }
              />
            )})}
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: "1.25rem" }}>
          <Button onClick={handleClose}>Cancel</Button>
          <Button color="secondary" type="submit" name="submitForm" variant="contained">
            {update ? "Edit Staff" : "Create New Staff"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
export default StaffForm;