//let mysqlx = require('@mysql/xdevapi');
let mysql2 = require('mysql2');
class SqlDataService {
    constructor() {
        console.log("start studentsTest2");
        this.client = mysql2.createConnection({
            user: 'apprun',
            password: ' Az12345678',
            host: '45.83.43.173',
            port: 3306,
            database: 'studentsTest2'
        });
        this.SELECT_PRODUCT_GROUP =
            "select path.pathCode as product_group_id , path.pathName as description , path.price , path.full_price  , path.s_price  , path.s_full_price , path.payments_check , path.payments_credit from studentsTest2.path;";
        //"select path.pathCode as product_group_id, path.pathName as description, path.price as price from studentsTest2.path";
        this.SELECT_PRODUCT =
            "select coursesperpath.pathCode as product_group_id, path.pathName as product_group_description, path.price as product_group_amount , " +
            "coursesperpath.courseCode as product_id, courses.courseName as description , courses.hours , courses.course_price as disc_price , " +
            "courses.course_price_full as price ,  courses.course_s_price , courses.course_s_full_price, courses.course_payment_check , courses.course_payment_credit " +
            "from coursesperpath left join studentsTest2.path on path.pathCode = coursesperpath.pathCode " +
            "left join studentsTest2.courses on courses.courseCode = coursesperpath.courseCode where courses.exist = 1 order by product_group_id;";



        this.SELECT_PLAY_LIST = "SELECT * FROM video_session where cycle_code =? and video_show='1'"


    }



    playList(cycle, callback) {
        this.client.query(this.SELECT_PLAY_LIST, [cycle], (err, rows) => {
            callback(rows);
        });
    }



    postCourses(a, callback) {
        let COURSES = "select stud.courseName, stud.examMark, stud.projectMark, cours.date, cours.update_date, cours.status, cours.teach_name , cours.cycle , stud.course , cours.sess, cours.vis " +
            "from ( select student, course, courseName , examMark, projectMark from coursesperstudent inner join courses on courses.courseCode = coursesperstudent.course inner join students on students.studentID = coursesperstudent.student where students.studentID = '" +
            a + "' ) as stud left join ( SELECT studentspercycle.studentID as id, coursecycle.code as cycle , coursecycle.courseCode as course, coursecycle.openDate as date, coursecycle.updateOpendate as update_date, coursecycle.courseStatus, coursestatus.courseStatus as status, " +
            "coursecycle.teacherID, teach.teach_name as teach_name, visit.sessions as sess, visit.visits as vis FROM studentsTest2.studentspercycle left join coursecycle on coursecycle.code = studentspercycle.courseCycleCode left join coursestatus on coursestatus.code = coursecycle.courseStatus " +
            "left join ( SELECT student_visit.cycle as cycle, count(*) as sessions, sum(student_visit.visit) as visits FROM student_visit WHERE studentID = '" +
            a + "' GROUP BY student_visit.cycle ) as visit on visit.cycle = coursecycle.code left join ( select studentID as teacherID, firstName as teach_name from students ) as teach on teach.teacherID = coursecycle.teacherID where studentID = '" +
            a + "') as cours on stud.course = cours.course;"

        this.client.query(COURSES, (err, rows) => {
            callback(rows);
        });
    }




    readProductGroup(callback) {
        this.client.query(this.SELECT_PRODUCT_GROUP, (err, rows) => {
            console.log("SQL Answer readProductGroup :")
            callback(rows);
        });
    }

    readProduct(callback) {
        this.client.query(this.SELECT_PRODUCT, (err, rows) => {
            console.log("SQL Answer readProduct :")
            callback(rows);
        });
    }
}

module.exports = {
    SqlDataService: SqlDataService
}