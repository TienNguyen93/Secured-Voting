import uuid
from typing import Optional
from pydantic import BaseModel, Field
from fastapi.encoders import jsonable_encoder


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