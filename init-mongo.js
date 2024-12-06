// This script initializes the AcademicTeamManagementDB database in MongoDB.

db = db.getSiblingDB("AcademicTeamManagementDB");
db.createUser(  // Creates a user with readWrite permissions for secure access to the database.
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
