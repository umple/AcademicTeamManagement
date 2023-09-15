import groupsService from "../services/groupsService";

export const CreateNewGroupModal = ({ open, columns, onClose, onSubmit, fetchData, projects, students, groups }) => {

    const theme = useTheme();
    const [members, setMembers] = useState([])
    const [err, setError] = useState("")
    const ITEM_HEIGHT = 48;
    const ITEM_PADDING_TOP = 8;
    const MenuProps = {
        PaperProps: {
            style: {
                maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
                width: 250,
            },
        },
    };

    function validateFields() {
        if (values["group_id"] === "") {
            setError("Please Enter a Group Name")
            setTimeout(() => setError(""), 4000);
            return false
        }

        if (groups.length === 0) {
            return true
        }

        console.log(groups)

        let group = groups.find((group) => group.group_id.toLowerCase() === values["group_id"].toLowerCase());
        if (typeof group !== "undefined") {
            setError("The name already exists")
            setTimeout(() => setError(""), 4000);
            return false
        }

        return true
    }

    function getStyles(name, members, theme) {
        return {
            fontWeight:
                members.indexOf(name) === -1
                    ? theme.typography.fontWeightRegular
                    : theme.typography.fontWeightMedium,
        };
    }

    const handleChange = (event) => {
        const {
            target: { value },
        } = event;
        setMembers(
            // On autofill we get a stringified value.
            typeof value === 'string' ? value.split(',') : value,
        );
    };

    const [values, setValues] = useState(() =>
        columns.reduce((acc, column) => {
            acc[column.accessorKey ?? ''] = '';
            return acc;
        }, {}),
    );


    values["members"] = members
    const handleSubmit = async (e) => {
        e.preventDefault()

        if (validateFields() === false) {
            return;
        }

        try {
            let status = await groupsService.post(values);
            
            if (status === 200) {
                fetchData();
                Object.entries(values).forEach(([key, value]) => {
                    if (key === 'members') {
                        values[key] = []
                    } else {
                        values[key] = ''
                    }
                });
                setMembers([]);
            }
        } catch (error) {
            console.log(error);
        }
        

        onSubmit(values);
        onClose();
    };


    return (
        <Dialog open={open}>
            {err === "" ? "" : <Alert severity="error">{err}</Alert>}

            <DialogTitle textAlign="center">Create New Group</DialogTitle>
            <form onSubmit={(e) => e.preventDefault()}>
                <DialogContent>
                    <Stack
                        sx={{
                            width: '100%',
                            minWidth: { xs: '300px', sm: '360px', md: '400px' },
                            gap: '1.5rem',
                        }}
                    >

                        {columns.map((column) => {

                            if (column.accessorKey === 'members') {
                                return (
                                    <FormControl sx={{ m: 1, width: 300 }}>
                                        <InputLabel id="demo-multiple-chip-label">Members</InputLabel>
                                        <Select
                                            labelId="demo-multiple-chip-label"
                                            id="demo-multiple-chip"
                                            multiple
                                            value={members}
                                            onChange={handleChange}
                                            input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
                                            renderValue={(selected) => (
                                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                                    {selected.map((value) => {
                                                        let student = students.find((student) => student.orgdefinedid === value);
                                                        let display = student.orgdefinedid + " - " + student.firstname + " " + student.lastname;
                                                        return <Chip color="primary" key={value} label={display} />
                                                    })}
                                                </Box>
                                            )}
                                            MenuProps={MenuProps}
                                        >

                                            {students.length > 0 && students.map((student) => {
                                                if (student.group === null) {
                                                    return <MenuItem
                                                        key={student.orgdefinedid}
                                                        value={student.orgdefinedid}
                                                        style={getStyles(student.firstname, members, theme)}
                                                    >
                                                        {student.orgdefinedid + " - " + student.firstname + " " + student.lastname}
                                                    </MenuItem>
                                                }
                                            })}
                                        </Select>
                                    </FormControl>
                                )
                            }

                            if (column.accessorKey === 'project') {
                                return (
                                    <FormControl>
                                        <InputLabel id="project-label">Project</InputLabel>
                                        <Select
                                            labelId="project-label"
                                            key={column.accessorKey}
                                            name={column.accessorKey}
                                            value={values[column.accessorKey]}
                                            onChange={(e) => {
                                                setValues({ ...values, [e.target.name]: e.target.value })
                                            }}
                                        >
                                            {projects.map((option) => (
                                                <MenuItem key={option.project} value={option.project} >
                                                    {option.project}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                )
                            }

                            return (
                                <TextField
                                    key={column.accessorKey}
                                    label={column.header}
                                    name={column.accessorKey}
                                    value={values[column.accessorKey]}
                                    onChange={(e) => {
                                        setValues({ ...values, [e.target.name]: e.target.value })
                                    }}
                                />
                            )
                        })}

                    </Stack>
                </DialogContent>
                <DialogActions sx={{ p: '1.25rem' }}>
                    <Button onClick={onClose}>Cancel</Button>
                    <Button color="secondary" onClick={handleSubmit} variant="contained">
                        Create
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};
