const Promise = require('bluebird');

class KnexDataService {
    constructor() {
        this.MESSAGES_LIMIT = 10;
        this.knex = require('knex')({
            client: 'mysql2',
            connection: {
                host: '45.83.43.173',
                user: 'apprun',
                password: ' Az12345678',
                database: 'studentsTest2'
            }
        });
    }
    registrationUpdate(reg, callback) {
        console.log('registration update knex', reg)
        this.knex('video_registration')
            .where({ student_id: reg.studentID, cpu: reg.cpu })
            .update({
                ver: reg.ver,
            })
            .then(function(rows) {
                console.log('Versiuon update sucess', rows);
                callback(rows, null);
            })
            .catch(function(error) {
                console.log('data base error', error);
                callback(null, error);
            })
    }

    checkRegistratiion(reg, callback) {
        console.log('check Registratiion knex', reg.student_id, reg.cpu)
        this.knex('video_registration')
            .where({ student_id: reg.studentID, cpu: reg.cpu })
            .then(rows => {
                console.log('cpu found :', rows);
                callback(rows, null);
            })
            .catch(function(error) {
                console.log('data base error', error);
                callback(null, error);
            })
    }


    checkCPU(student_id, cpu, callback) {
        console.log('checkCPU knex', student_id, cpu)
        this.knex('video_registration')
            .where({ student_id: student_id, cpu: cpu })
            .then(rows => {
                console.log('video_registration', rows)
                if (rows.length === 0) {
                    console.log('cpu not found');
                    callback(0)
                } else {
                    console.log('cpu found :', rows);
                    callback(1);
                }
            })
            .catch(function(error) {
                console.log('cpu find error', error);
                callback(error);
            })
    }

    videoPlay(student_id, video_id, callback) {
        console.log('video_play', student_id, video_id)
        this.knex('video_play')
            .insert({
                student_id: student_id,
                video_play: new Date(),
                video_id: video_id,
            })
            .then((rows) => {
                console.log('video new play', rows);
                callback(rows);
            })
            .catch((error) => {
                console.log('video new olay ERROR', error);
                callback(error);
            })
    }

    registration(reg, callback) {
        console.log('registratuion')
        this.knex('video_registration')
            .insert({
                student_id: reg.studentID,
                registration: new Date(),
                cpu: reg.cpu,
                ver: reg.ver,
            })
            .then((rows) => {
                console.log('video new registration: ', rows);
                callback(rows, null);
            })
            .catch((error) => {
                console.log('video new registration ERROR: ', error);
                callback(null, error);
            })
    }


    newUserCourses(student, courses) {
        return this.knex.transaction((trx) => {
            const queries = [];
            courses.forEach(course => {
                const query = this.knex('coursesperstudent')
                    .insert({
                        student: student,
                        course: course.product_id,
                        freezCourse: 0,
                        amount: course.amount,
                    })
                    .transacting(trx);
                queries.push(query);
            })
            Promise.all(queries)
                .then(trx.commit)
                .catch(trx.rollback);
        })
    }

    coursePerStudentUpdateBatch(courses) {
        return this.knex.transaction((trx) => {
            const queries = [];
            courses.forEach(course => {
                const query = this.knex('coursesperstudent')
                    .where({
                        student: course.student,
                        course: course.course,
                    })
                    .update({
                        projectMark: course.projectMark,
                        examMark: course.examMark,
                    })
                    .transacting(trx);
                queries.push(query);
            })
            Promise.all(queries)
                .then(trx.commit)
                .catch(trx.rollback);
        })
    }

    coursePerStudentUpdate(course, callback) {
        console.log(course)
        this.knex('coursesperstudent')
            .where({
                student: course.student,
                course: course.course,
            })
            .update({
                projectMark: course.projectMark,
                examMark: course.examMark,
            })
            .then(function(res) {
                callback(res);
            });
    }

    findUserOne(username, callback) {
        this.knex('students')
            .where({ username: username })
            .then(rows => {
                callback(rows);
            })
            .catch(function(error) {
                console.log('No User', error);
                callback(error);
            })
    }

    studentVisits(attendance, callback) {
        this.knex('student_visit')
            .where({
                cycle: attendance.cycle,
                studentID: attendance.studentID,
                session: attendance.session,
            })
            .then(rows => {
                if (rows.length > 0) { // record exist
                    this.knex('student_visit')
                        .where({
                            cycle: attendance.cycle,
                            studentID: attendance.studentID,
                            session: attendance.session,
                        })
                        .update({
                            visit: attendance.visit,
                        })
                        .then(function(res) {
                            callback(res);
                        })
                } else { //new record
                    this.knex('student_visit').insert({
                            cycle: attendance.cycle,
                            studentID: attendance.studentID,
                            session: attendance.session,
                            visit: attendance.visit,
                        })
                        .then(function(res) {
                            callback(res);
                        })
                }
            })
            .catch(function(error) {
                console.log('student_visits eror', error);
                callback(error);
            })
    }

    newUser(student, callback) {
        let d = new Date(student.registeryDate);
        let registeryDate = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getUTCDate();
        this.knex('students')
            .insert({
                studentID: student.studentID,
                firstName: student.firstName,
                familyName: student.familyName,
                address: student.address,
                email: student.email,
                mobileNumber: student.mobileNumber,
                idImage: null,
                status: student.status,
                secondMobileNumber: student.secondMobileNumber,
                registeryDate: registeryDate,
                username: student.username,
                password: student.password,
                role: student.role,
                theme: student.theme,
                paymentMethodsCode: student.paymentMethodsCode,
                location: student.location,
                amount: student.amount,
            })
            .then((rows) => {
                console.log('student new sucess', rows);
                callback(rows);
            })
            .catch((error) => {
                console.log('student new error', error);
                callback(error);
            })
    }

    messagesHistoryByTicket(ticket, callback) {
        this.knex('message')
            .where({ ticket: ticket })
            .orderBy('date', 'desc')
            .then(rows => {
                callback(rows);
            })
            .catch((error) => {
                console.log('Message history error', error);
                callback(error);
            })
    }

    messagesHistory(message, callback) {
        this.knex('message')
            .orderBy('date', 'desc')
            .limit(this.MESSAGES_LIMIT)
            .orderBy('date')
            .then(rows => {
                callback(rows);
            })
            .catch(function(error) {
                console.log('Message history error', error);
                callback(error);
            })
    }
    messageNew(message, callback) {
        this.knex('message')
            .insert({
                // _id:    message.,
                mess: message.mess,
                student: message.student,
                ticket: message.ticket,
                date: new Date(message.date),
                cat: message.cat,
                name: message.name,
                id: message.id,
                sock: message.sock,

            })
            .then(function(rows) {
                console.log('message new sucess', rows);
                callback(rows);
            })
            .catch(function(error) {
                console.log('message new error', error);
                callback(error);
            })
    }

    ticketNew(ticket, callback) {
        this.knex('ticket')
            .insert({
                //ticket_id ,
                student_id: ticket.student_id,
                req_type: ticket.req_type,
                req_reason: ticket.req_reason,
                req_date: new Date(ticket.req_date),
            })
            .then(function(rows) {
                console.log('ticket new sucess', rows);
                callback(rows);
            })
            .catch(function(error) {
                console.log('ticket new error', error);
                callback(error);
            })
    }
    ticketUpdate(ticket, ticket_id, callback) {
        this.knex('ticket')
            .where({ ticket_id: ticket_id })
            .update({
                admin_id: ticket.admin_id,
                ans_type: ticket.ans_type,
                ans_reason: ticket.ans_reason,
                ans_date: new Date(ticket.ans_date),
                act_date: new Date(ticket.act_date),
                course_id: ticket.course_id,
                path_id: ticket.path_id,
                cycle_id: ticket.cycle_id,
            })
            .then(function(rows) {
                console.log('ticket new sucess', rows);
                callback(rows);
            })
            .catch(function(error) {
                console.log('ticket new error', error);
                callback(error);
            })
    }
    ticketHistoryByStudent(student, callback) {
        this.knex('ticket')
            .where({ student_id: student })
            .orderBy('req_date', 'desc')
            .then(rows => {
                callback(rows);
            })
            .catch(function(error) {
                console.log('ticket history error', error);
                callback(error);
            })
    }

}


module.exports = {
    KnexDataService: KnexDataService
}