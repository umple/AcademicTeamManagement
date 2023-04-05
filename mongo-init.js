db = db.getSiblingDB("$MONGO_INITDB_DATABASE");
db.students.drop();

db.createUser(
    { 
        user: "$MONGO_INITDB_ROOT_USERNAME", 
        pwd : "MONGO_INITDB_ROOT_PASSWORD", 
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

