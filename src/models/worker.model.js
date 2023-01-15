module.exports = mongoose => {
    var schema = mongoose.Schema(
        {
            "name": {
                "type": String
            },
            "username": {
                "type": String
            },
            "password": {
                "type": String
            },
            "email": {
                "type": String  
            },
            "shopId": {
                "type": String
            },
            "services" : [
                {
                    "type": String
                }
            ]
        },
        { timestamps: true }
    );

    schema.method("toJSON", function () {
        const { __v, _id, ...object } = this.toObject();
        object.id = _id;
        return object;
    });

    const Worker = mongoose.model("Worker", schema, "Worker");
    return Worker;
};