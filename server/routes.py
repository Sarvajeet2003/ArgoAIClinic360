from flask import jsonify, request, session
from models import User, MedicalRecord, Appointment, DoctorSchedule, db
from functools import wraps
from email_service import send_appointment_email

def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'user_id' not in session:
            return jsonify({'message': 'Unauthorized'}), 401
        return f(*args, **kwargs)
    return decorated_function

def register_routes(app):
    @app.route('/api/register', methods=['POST'])
    def register():
        data = request.json
        if User.query.filter_by(username=data['username']).first():
            return jsonify({'message': 'Username already exists'}), 400
        
        user = User(
            username=data['username'],
            role=data['role'],
            email=data['email'],
            full_name=data['fullName'],
            specialization=data.get('specialization')
        )
        user.set_password(data['password'])
        
        db.session.add(user)
        db.session.commit()
        
        session['user_id'] = user.id
        return jsonify(user.to_dict()), 201

    @app.route('/api/login', methods=['POST'])
    def login():
        data = request.json
        user = User.query.filter_by(username=data['username']).first()
        
        if user and user.check_password(data['password']):
            session['user_id'] = user.id
            return jsonify(user.to_dict())
        
        return jsonify({'message': 'Invalid credentials'}), 401

    @app.route('/api/logout', methods=['POST'])
    def logout():
        session.pop('user_id', None)
        return '', 200

    @app.route('/api/user')
    def get_current_user():
        if 'user_id' not in session:
            return '', 401
        user = User.query.get(session['user_id'])
        return jsonify(user.to_dict())

    @app.route('/api/appointments', methods=['GET', 'POST'])
    @login_required
    def handle_appointments():
        user = User.query.get(session['user_id'])
        
        if request.method == 'POST':
            data = request.json
            appointment = Appointment(
                doctor_id=data['doctorId'],
                patient_id=user.id,
                start_time=data['startTime'],
                end_time=data['endTime'],
                reason=data.get('reason'),
                status='scheduled'
            )
            
            db.session.add(appointment)
            db.session.commit()
            
            # Send email notification
            doctor = User.query.get(data['doctorId'])
            email_sent = send_appointment_email(user, doctor, appointment)
            
            return jsonify({
                'id': appointment.id,
                'doctorId': appointment.doctor_id,
                'patientId': appointment.patient_id,
                'startTime': appointment.start_time.isoformat(),
                'endTime': appointment.end_time.isoformat(),
                'status': appointment.status,
                'reason': appointment.reason,
                'emailStatus': 'sent' if email_sent else 'failed'
            }), 201
            
        # GET request
        if user.role == 'doctor':
            appointments = Appointment.query.filter_by(doctor_id=user.id).all()
        else:
            appointments = Appointment.query.filter_by(patient_id=user.id).all()
            
        return jsonify([{
            'id': apt.id,
            'doctorId': apt.doctor_id,
            'patientId': apt.patient_id,
            'startTime': apt.start_time.isoformat(),
            'endTime': apt.end_time.isoformat(),
            'status': apt.status,
            'reason': apt.reason,
            'doctor': apt.doctor.to_dict(),
            'patient': apt.patient.to_dict()
        } for apt in appointments])

    @app.route('/api/doctors', methods=['GET'])
    @login_required
    def get_doctors():
        doctors = User.query.filter_by(role='doctor').all()
        return jsonify([doctor.to_dict() for doctor in doctors])
