# student_management_backend

This project is related to the student into which we need to manage the student data.
We will be able to add, delete, update and view the student data.
The data will be like academic marks, attendence record, all student data,home work/ assignment details and subject and syllabus details and the daily time table.

## Auth/User Module

     1. This module is used to manage the user authentication. It will be used to login and logout the user.

     2. In this project I have used three roles [student, admin]

     3. The user will be able to change the password and will be able to reset the password.

     4. the student can see his all his details profile and the admin can see all the student details.

     5. Admin can also manage all the students accounts.

     6. The student will register in a scetion of a class.

## Class and Sections module

     1. This module is used to manage the class and sections.

     2. The admin can add, delete, update and view the class and sections.

     3. Class name will be unique and it will have the section.

     4. A class will have all the unique sections.

     5. A sections will have all the students, subject, syllabus details, attendence details and result details.

## Subject Module

     1. This module is used to manage the subject details.

     2. The admin can add, delete, update and view the subject details.

     3. We will add the subject in the subject collection and it's id will be added in the sections collection in db.


## Attendance Module

     1. This module is used to manage the attendance details. 

     2. When a class teacher mark the attendance of any student then it will be updated in the student collection and the sections collection.

     3. So when the user need the attedance record of any student, we can provide him the attendance record of that student from the student collection 

     4. or if the user need the complete sections attendance we can also give him this detail form the sections collection where we have stored.

     5. the user can not mark the attendance of any future or past date.

     6. You can get the attendance of any section students for a specific date.
