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

## 02/17/2023
- Team and client (Professor Lethbridge) meeting
- **Demos:** 
    -  Showed update Projects and Student group
    -  Showed import students list from csv
- **Next meeting:** March 9, 2023 - Sprint Day
- **To do:** 
    - color coded rows
    - interested projects as lists
    - projects include names
    - more dropdowns in cell value selection (way later)
    - how to swap between classes
    - what if project gets deleted?
    - Specify interest column (not obvious from "Interest") 
    - new prof 2024 (make sure system is stupid proof)
    - projects should be suggested for "XYZ" section (like csi, ceg, or seg) + sections can work together
    - home page for ease of use (more stupid proofing) + explanation
    - pic details FSM for projects
    - unassign or make the project unavailable
    - Archive or complete the project
    - Project goes back to new (maybe duplicate it if it’s being reworked on for the next cohort) 

## 03/09/2023
- Sprint Day
- **Next meeting:** March 27, 2023 - with professor
    -  Made sure app was deployed properly
    -  Updated the tables
- **To do:** 
    - interested projects as lists
    - projects include names
    - more dropdowns in cell value selection (way later)
    - how to swap between classes
    - what if project gets deleted?
    - Specify interest column (not obvious from "Interest") 
    - new prof 2024 (make sure system is stupid proof)
    - projects should be suggested for "XYZ" section (like csi, ceg, or seg) + sections can work together
    - home page for ease of use (more stupid proofing) + explanation
    - unassign or make the project unavailable
    - Archive or complete the project
    - Project goes back to new (maybe duplicate it if it’s being reworked on for the next cohort) 
    - Student view

## 03/27/2023
- Team and client (Professor Lethbridge) meeting
- **Next meeting:** TBD
    -  Showed API work
    -  Demonstrated unit tests
    -  Showed updated student list
    -  Explaned authentication
- **To do:** 
    - Get roles for instructor and student
    - Get access to the testing VM (Prof Lethbridge will do it)
    - Finish UI components for student view
    - Finish connecting UI with database
    - Prepare for final presentation

## 04/10/2023
- Team
- **Next meeting:** TBD
    -  Preparation for presentation on April 11
- **To do:** 
    - Clean up UI
    - Add validation to forms
    - Ensure that all API calls work properly with extensive testing

## 05/21/2023
- Team
- **Next meeting:** 2-3 weeks
- **Summary:**
    -  Chatted about our goals for the summer
    -  Added issues to fix over the summer
    -  Assigned issues to team members
- **To do:** 
    - Start working on issues
    - Meet up with Prof. Lethbridge to fix his setup
