export const projectStatus = [
    {
        value: "Raw",
        possibilities: ["Available", "Underway", "Proposed"],
        info: "This is an object in creation"
    },
    {
        value: "Available",
        possibilities: ["Available","Cancelled", "Underway"],
        info: "Ready to be taken on by Students"
    },
    {
        value: "Underway",
        possibilities: ["Underway","Cancelled", "Completed"],
        info: "Project is currently in progress"
    },
    {
        value: "Completed",
        possibilities: ["Completed"],
        info: "Project has completed"
    },
    {
        value: "Cancelled",
        possibilities: ["Cancelled", "Proposed"],
        info: "Project cannot be taken on to students"
    },
    {
        value: "Proposed",
        possibilities: ["Proposed", "Available", "Cancelled"],
        info: "Project is proposed by students"
    }
]