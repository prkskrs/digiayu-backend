- Non Auth<br>

[Done] Get Doctors<br>

- Doctor<br>

[Done] Get Patients (Done) (Auth Reqd : api for doctors only)<br>
[Done] Get Patient By ID (Done) (Auth Reqd : api for doctors only)<br>
[] Set Availability (Pending)<br>
[Done] Get Appointments <br>
[Done] Get Appointment By ID ( obj with basic patient Info ) <br>
[Done] Update Appointment By ID<br>

- Patient<br>

[Done] Get Doctors
[Done] Get Doctor By ID
[Done] Get Appointements
[Done] Get Appointemnt By ID
[Done] Book Appointment ( fix )

BUGS

[Done] - ADD consultation fee In doctor Model
[Done] - Sort by updated At in get API
[pending] - Patient Stories to be Added in doctor
[Done] - Check get appointment by doctor API
[Fixed] - Diagnosis get by Appointment ID not working

### API NEEDED

[Done] p1 - Set Avability API ( - Doctor set availablity ( week ) -- doctor update api key weeklyAvaibility, - Get avability time slots ( query with date and day, check weeek and existing appointment -- if appointment then remove tinme slot from array ),
)[-prksh]

[Done] - Appointment ( - Get all appointment (doctor obj small + patient obj small) - Send Diagnosis data in Get appointment By Id, Doctor + Patient
)[-prksh]

[done] p1 - Chat API's to be done ( - Send message ( patient_id, doctor_id, message, appointment_id??, chat_id) - Get message - Get chats - Get chat Message - Delete Chat - Update chat status
) [Prynsh]

[Done] p1 - Patient API handoff to FE ( - Get patient - Get patient BY ID - filter appointments with patient ID and Doctor ID
)

[] p2 - Calender API for Doctor

[] p2 - Dashboard API's admin
[] p2 - Dashboard API's doctor

### Admin API's ( )

[Done] - Get all Patients <br>
[Done] - Get all Doctors <br>
[Done] - Get all Appointments <br>
[Done] - Patient Details By ID + all appointment <br>
[Done] - Doctor Details By ID + all appointment <br>
[Done] - Update doctor By ID <br>
[Done] - Appointment Details By ID (patient + doctor + diagnosis) <br>

FIxes Required from the backend
[UnderReview] Lab orders is saved as null in in diagnosis
[Done] Currently no appointments were fetched which were diagnosed recently
[Done] while creatting appointment "status = pending" and when diagnosed "status = diagnosed"
