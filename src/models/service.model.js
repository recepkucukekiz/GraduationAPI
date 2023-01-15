module.exports = mongoose => {
    var schema = mongoose.Schema(
        {
            "name": {
                "type": String
            },
            "price": {
                "type": Number
            },
            "duration": {
                "type": Number
            },
            "shopId": {
                "type": String
            },
            "workers" : [
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

    const Service = mongoose.model("Service", schema, "Service");
    return Service;
};