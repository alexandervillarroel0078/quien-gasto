def get_or_create(db, model, defaults=None, **kwargs):
    instance = db.query(model).filter_by(**kwargs).first()
    if instance:
        return instance, False

    params = dict(kwargs)
    if defaults:
        params.update(defaults)

    instance = model(**params)
    db.add(instance)
    db.flush()
    return instance, True
