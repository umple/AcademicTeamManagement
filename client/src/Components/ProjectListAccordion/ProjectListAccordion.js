import { Box, Container, Button } from '@material-ui/core';
import './ProjectListAccordion.css';
import { makeStyles } from '@material-ui/core/styles';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Grid from '@mui/material/Grid';
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import ProjectInformation from '.././ProjectInformation/ProjectInformation';


function ProjectListAccordion() {

  return (
    <Box>
      <Container sx={{ alignContent: 'center' }}>

        <Grid>
          <Grid item xs={4}>
            <Button size="large"  id="addProject" variant="outlined">+ Project </Button>
            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                <Typography>Accordion 1</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography>
                  <ProjectInformation></ProjectInformation>
                </Typography>
              </AccordionDetails>
            </Accordion>
            
            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel2a-content"
                id="panel2a-header"
              >
                <Typography >Accordion 2</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography>
                  <ProjectInformation></ProjectInformation>
                </Typography>
              </AccordionDetails>
            </Accordion>
          </Grid>

        </Grid>
      </Container>
    </Box>


  );
}

export default ProjectListAccordion;