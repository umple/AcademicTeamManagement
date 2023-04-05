db = db.getSiblingDB("AcademicTeamManagementDB");
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
