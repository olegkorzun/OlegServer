class Student {
    constructor (data) {
        this.createDate     = new Date();
        this.first_name      = data.first_name;
        this.last_name       = data.last_name;
        this.student_id     = data.student_id;
        this.phone          = data.phone;
        this.email          = data.email;
        this.linux          = data.linux;
        this.isActive       = data.isActive;
    }
    setAsActive(){
        this.isActive = true;
    }
    get userName() {
        return this.firstName + " " + this.lastName;
    }
}

module.exports = {
    Student: Student
}
