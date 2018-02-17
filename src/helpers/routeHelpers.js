import Joi from 'Joi'
export default {
    validateParam: (schema, name) => {
        return (req, res, next) => {
            console.log('req.params', req.params);
            const result = Joi.validate({ param: req['params'][name] }, schema)

            if (result.error) return res.status(400).json(result.error);
            else {
                if (!req.value) req.value = {};
                if (!req.value['params']) req.value['params'] = {};
                req.value['params'][name] = result.value.param;
                next();
            }

        }
    },

    validateBody: (schema) => {
        return (req, res, next) => {
            const result = Joi.validate(req.body, schema);

            if (result.error) return res.status(400).json(result.error);
            else {
                if (!req.value) req.value = {};
                if (!req.value['body']) req.value['body'] = {};
                req.value['body'] = result.value;
                next();
            }
        }

    },

    validateSigninToken: (token) => {
        return (req, res, next) => {
            const result = Joi.validate(req.body, token);

            if (result.error) return res.status(400).json(result.error);
            else {
                if (!req.value) req.value = {};
                if (!req.value['body']) req.value['body'] = {};
                req.value['body'] = result.value;
                next();
            }
        }
    },

    schemas: {
        //post new user and put user
        userSchema: Joi.object().keys({
            first_name: Joi.string().required(),
            last_name: Joi.string().required(),
            full_name: Joi.string().required(),
            email: [Joi.string().optional(), Joi.allow(null)],
            mobile: [Joi.string().optional(), Joi.allow(null)],
            gender: Joi.string().required(),
            account_provider: Joi.string().required(),
            account_id: Joi.string().required(),
            about_me: [Joi.string().optional(), Joi.allow(null)],
            profile_picture_url: Joi.string().required(),
            last_logged_in: [Joi.string().optional(), Joi.allow(null)],
            updated_at: [Joi.string().optional(), Joi.allow(null)]
        }),

        //update user
        userOptionalSchema: Joi.object().keys({
            first_name: Joi.string(),
            last_name: Joi.string(),
            email: Joi.string(),
            gender: Joi.string(),
            account_provider: Joi.string(),
            account_id: Joi.string(),
            about_me: Joi.string(),
            profile_picture_url: Joi.string(),
            last_logged_in: Joi.string(),
            updated_at: Joi.string()
        }),

        //user location
        userLocationSchema: Joi.object().keys({
            geolocation: Joi.object().keys({
                type: Joi.string().required().valid(["Point"]),
                coordinates: [Joi.number(), Joi.number()]
            }),
            status: Joi.string().required()
        }),

        userDeviceSchema: Joi.object().keys({
            device_id: Joi.string().required(),
            android_version: Joi.string().required(),
            model: Joi.string().required(),
            brand: Joi.string().required(),
            using: Joi.boolean().required(),
            removed: [Joi.boolean().optional(), Joi.allow(null)]
        }),
        idSchema: Joi.object().keys({
            param: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required()
        })


    },
    tokens: {
        verifyToken: Joi.object().keys({
            provider: Joi.string().required(),
            token: Joi.string().required()
        })
    }
};