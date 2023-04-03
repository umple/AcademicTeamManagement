db = db.getSiblingDB("AcademicTeamManagementDB");
db.students.drop();

db.createUser(
{ user: "root", pwd: "pass", roles: [{role: "readWrite", db: "AcademicTeamManagementDB"}]} )

//db.students.insertMany([
//    {
//        "name": "john",
//        "age": 22
//    },
//    {
//        "name": "maria",
//        "age": 22
//    }
//]);
