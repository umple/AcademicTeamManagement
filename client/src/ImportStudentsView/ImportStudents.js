import * as React from 'react';
import '../styles/ImportStudents.css';
import { Button, Container, Grid } from '@mui/material';
import { Input } from '@mui/material';

function ImportStudents() {
    return (
        <div className="ImportStudents">
            <h1>Import Data From Excel</h1>
            <Container id="uploadContainer" maxWidth="sm">
                <form id="uploadForm" action="/uploadStudentList" method="post" enctype="multipart/form-data">
                    <div id="uploadFormRow1" className="form-group">
                        <Input type="file" className="form-control-file" name="file" id="file" />
                        <Button type="submit" id="uploadBtn" variant="contained" color="success">Upload</Button>
                 
                    </div>
                </form>
            </Container>
        </div>

    );
}
export default ImportStudents;