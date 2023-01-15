module.exports = mongoose => {
    var schema = mongoose.Schema(
        {
            "name": {
                "type": String
            },
            "category": {
                "type": String
            },
            "address": {
                "type": String
            },
            "city": {
                "type": String
            },
            "province": {
                "type": String
            },
            "phone": {
                "type": String
            },
            "email": {
                "type": String
            },
            "image": {
                "type": String
            },
            "description": {
                "type": String
            },
            "workingHours": {
                "type": String
            },
            "username": {
                "type": String
            },
            "password": {
                "type": String
            },
            "services" : [
                {
                    "type": String
                }
            ],
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

    const Shop = mongoose.model("Shop", schema, "Shop");
    return Shop;
};