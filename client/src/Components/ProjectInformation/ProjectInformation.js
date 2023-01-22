import { Button, Grid } from "@mui/material";

/*
    This class is responsible for showing the project information when opening an accordion item
*/
function ProjectInformation() {
    return (
        <div>
            <h1>CUSTOMERS</h1>
            <h2>GROUP</h2>

            <p>PROJECT DESCRIPTION</p>
            <Grid container spacing={1}>
                <Grid item xs={2}>
                    <Button variant="contained">Edit</Button>
                </Grid>
                <Grid item xs={2}>
                    <Button variant="contained">Delete</Button>
                </Grid>
                <Grid item xs={2}>
                    <Button variant="contained">Assign Group</Button>
                </Grid>
            </Grid>
        </div>
    );

}

export default ProjectInformation;