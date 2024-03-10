import uuid


def json_converter(o):
    if isinstance(o, uuid.UUID):
        return str(o)
