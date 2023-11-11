import { projectStatus } from "../../helpers/projectStatus";

export default function statusByValue(value){
    return projectStatus.find(status => status.value.toLowerCase() === value.toLowerCase());
}
