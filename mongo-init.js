db = db.getSiblingDB("AcademicTeamManagementDB");
db.students.drop();

db.createUser(
    { 
        user: "root", 
        pwd : "pass", 
        roles: [
            {
                role: "readWrite", 
                db: "AcademicTeamManagementDB"
            }
        ]
    } 
);

// db = db.getSiblingDB("admin");
// db.auth("admin", "pass")


// db.getSiblingDB("AcademicTeamManagementDB");
// db.createUser(
//     { 
//         'user': "root", 
//         'pwd' : "pass", 
//         'roles': [
//             {
//                 'role': "readWrite", 
//                 'db': "AcademicTeamManagementDB"
//             }
//         ]
//     } 
// );

