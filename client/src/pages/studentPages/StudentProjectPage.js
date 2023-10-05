
import StudentProjects from "../../components/studentsComponents/StudentProjects";
import { v4 as uuidv4 } from 'uuid';

const StudentProjectPage = () => {
    return (
        <>
            <StudentProjects key={uuidv4()}></StudentProjects>
        </>
    )
}
export default StudentProjectPage;