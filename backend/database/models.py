import uuid
from typing import Optional
from pydantic import BaseModel, Field
from fastapi.encoders import jsonable_encoder

# Port Model
class Address(BaseModel):
  id: str = Field(default_factory=uuid.uuid4, alias="_id")
  port: str = Field(...)
  pubkey: str = Field(...)

  def to_json(self):
    return jsonable_encoder(self, exclude_none=True)
  
  def to_bson(self):
    data = self.dict(by_alias=True, exclude_none=True)
    if data.get("_id") is None:
      data.pop("_id", None)
    return data


# Address Model for Voter nested model
class Addr(BaseModel):
  street: str
  city: str
  state: str

# Properties Model for Voter nested model
class Properties(BaseModel):
  email: str
  password: str

# Voter Model
class Voter(BaseModel):
  id: str = Field(default_factory=uuid.uuid4, alias="_id")
  firstname: str = Field(...)
  lastname: str = Field(...)
  dob: str = Field(...)
  ssn: int = Field(...)
  address: Addr | None = None
  voted: bool = False
  properties: Properties | None = None
  registered: bool = False

  def to_json(self):
    return jsonable_encoder(self, exclude_none=True)


# Admin Model
class Admin(BaseModel):
  id: str = Field(default_factory=uuid.uuid4, alias="_id")
  firstname: str = Field(...)
  lastname: str = Field(...)
  properties: Properties | None = None

  def to_json(self):
    return jsonable_encoder(self, exclude_none=True)