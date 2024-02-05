from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(200), unique=True, nullable=False)
    name = db.Column(db.String(200), unique=False, nullable=False)
    password_hash = db.Column(db.String(300), unique=True, nullable=False)
    salt = db.Column(db.String(300), unique=True, nullable=False)
    user_type = db.Column(db.String(10), unique=False, nullable=False)
    pet = db.relationship("Pet", back_populates="user")
    veterinary = db.relationship("Veterinary", back_populates="user")
     
    def __repr__(self):
        return f'<User {self.email}>'

    def serialize(self):
        return {
            "id": self.id,
            "email": self.email,
            "type" : self.type
        }

class Veterinary(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    phone = db.Column(db.String(20), nullable=False)
    address = db.Column(db.String(200), nullable=False)
    country = db.Column(db.String(100), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=False)
    user = db.relationship("User", back_populates="veterinary")

    def __repr__(self):
        return f'<Veterinary {self.email}>'

    def serialize(self):
        return {
            "phone": self.phone,
            "address" : self.address,
            "country": self.country
        }


class Pet(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=False)
    user = db.relationship("User", back_populates="pet")
    name = db.Column(db.String(200), nullable=False)
    born_date = db.Column(db.Date, nullable=False)
    # disabilities = db.Column(db.String(300), nullable=True)
    breed = db.Column(db.String(100), nullable=False)
    gender = db.Column(db.String(100), nullable=False)
    animal = db.Column(db.String(200), nullable=False)
    # medical_history = db.Column(db.String(300), nullable=True)
    photo = db.Column(db.String(300), nullable=True)

    def serialize(self):
        return {
            "name": self.name,
            "born_date" : self.born_date,
            "breed": self.breed,
            "gender": self.gender,
            "animal": self.animal,
            "photo": self.photo
        }