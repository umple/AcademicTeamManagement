import {
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    Stack,
    TextField,
    DialogActions,
  } from "@mui/material";
  import React, { useState } from "react";
  import { useFormik } from "formik";
  import sectionService from "../../../services/sectionService";
  import Section from "../../../entities/Section";
  import sectionSchema from "../../../schemas/sectionSchema";
  
  const SectionForm = ({
    open,
    columns,
    setCreateModalOpen,
    fetchSections,
    update,
    setUpdate,
    editingRow,
    sections,
    setEditingRow,
  }) => {
    const onSubmit = async (values, actions) => {
      try {
        let response;
        if (update) {
          response = await sectionService.update(editingRow._id, values);
        } else {
          response = await sectionService.add(values);
        }
        fetchSections();
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
  
    const [initialSectionValues] = useState(
      update
        ? new Section(editingRow)
        : new Section({
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
      initialValues: initialSectionValues.toRequestJSON(),
      validationSchema: sectionSchema(sections,editingRow._id),
      onSubmit,
    });
    return (
      <Dialog open={open || update}>
        <DialogTitle textAlign="center">
          {update ? "Edit Section" : "Create New Section"}
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
              {columns.map((column) => (
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
              ))}
            </Stack>
          </DialogContent>
          <DialogActions sx={{ p: "1.25rem" }}>
            <Button onClick={handleClose}>Cancel</Button>
            <Button color="secondary" type="submit" name="submitForm" variant="contained">
              {update ? "Edit Section" : "Create New Section"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    );
  };
  export default SectionForm;
  