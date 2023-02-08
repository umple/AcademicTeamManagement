# Meeting Minutes 

## 01/13/2023
- Team and client (Professor Lethbridge) meeting
- **Main painpoint:** tracking which students are signing up for which project
- **UML class diagram:** 4 classes (Student, Project, Group and Course Section)
- **Next meeting:** January 23, 2023 at 3 pm
- **To do:** 
    - create at least 3 design alternatives
    - UML class diagram in umple
    - list of user stories

## 01/13/2023
- Team meeting
- **Length:** 1.5 hours
- **Summary:** worked on the design of the uml

## 01/17/2023
- Team meeting
- **Length:** 2 hours
- **Summary:**
    - created user stories
    - refined the uml (https://cruise.umple.org/umpleonline/umple.php?model=230113sak5joa7booi)
    - discussed issues pre-emptively (security, accessibility, etc.)

## 01/23/2023
- Team and client (Professor Lethbridge) meeting
- **Wireframe feedback:** 
    -  Accordions are bad (should represent the list of projects as a modifiable table with abilities to add/remove metadata)
    -  Student view: Should be able to combine both cohorts together, students should be able to form groups and projects, students should rank projects with (little, medium and lots of interest)
    -  Important : colour coding (e.g., one color per group)
- **Next meeting:** January 30, 2023 at 3 pm
- **To do:** 
    - Update wireframes
    - Automation scripts
    - Finalize setting up back-end, front-end and database

## 01/30/2023
- Team and client (Professor Lethbridge) meeting
- **Wireframe feedback:** 
    -  Table with project info is good
    -  Student view: Should be able to combine both cohorts together, students should be able to form groups and projects, students should rank projects with (little, medium and lots of interest)
    -  Important : colour coding (e.g., one color per group)
- **Next meeting:** February 6, 2023 at 3 pm
- **To do:** 
    - Update design for project ranking, project assignment, group formation, student view
    - Token authorization
    - link up database

## 02/06/2023
- Team and client (Professor Lethbridge) meeting
- **Demos:** 
    -  Showed update Projects table with new status colums with the interested students and project applications
    -  Showed import students list from csv
- **Next meeting:** February 17, 2023 at 9:15 am
- **To do:** 
    - Projects view:
        - Make untouched status "new"
        - 2 different pending approval for students creating a project and groups applying for a project.
        - Store data of application for project.
        - Add comment in "View Application" modal
        - Add a way to accept and send to state "students needed"
        - Accept for more than one team
        - Reject should be "Feedback without accepting"
        - Default at least 200 per page
    - Import student list:
        - Default at least 200 per page
        - clean up CSV (exra # symbols, french accents missing), end of line indivator, see program language (may need to merge 2 CSVs) 
