import User from '../models/user'
import Location from '../models/location'
import Device from '../models/device'
import Connection from '../models/connection'
import graph from 'fbgraph'
import conf from '../config/conf'

export default {
    // route: /users
    index: async(req, res) => {
        const users = await User.find({});
        if (!users) return res.status(400).json({ success: false });
        res.status(200).json({ success: true, users });
    },
    newUser: async(req, res) => {

        console.log(req.body);

        const { provider, token } = req.body;
        // console.log(provider, token);

        switch (provider) {
            case "fb":
                // start
                graph
                    .setAccessToken(token)
                    .get("/debug_token?" +
                        "input_token=" + token + "&" +
                        "access_token=1714688958601665|7Y0DtsYPVXHcUfPuzLTaPvaRUpo", (err, data) => {
                            if (err) {
                                console.log("error: ", err);
                                res.status(400).json({ success: false, message: "User authentication failed." });
                            } else {
                                console.log("data: ", data);

                                const value = Object.values(data);

                                console.log("value", value[0]);

                                //return value[0];
                                const { app_id, expires_at, user_id } = value[0];

                                const sp_app_id = '1714688958601665';

                                console.log('app_id', app_id);

                                if (app_id === sp_app_id) {
                                    if (expires_at > Date.now() / 1000) {
                                        console.log("user_id", user_id);

                                        req.token_user_id = user_id;

                                        User.find({ account_id: user_id }, {
                                                first_name: 1,
                                                last_name: 1,
                                                full_name: 1,
                                                email: 1,
                                                gender: 1,
                                                account_provider: 1,
                                                account_id: 1,
                                                profile_picture_url: 1,
                                                updated_at: 1,
                                                last_logged_in: 1
                                            })
                                            .then(users => {
                                                if (users.length == 0) {
                                                    console.log("new user");
                                                    graph.setAccessToken(token)
                                                        .get("/me?fields=id,first_name,last_name,name,email,gender", (err, data) => {
                                                            if (err) {
                                                                console.log("error: ", err);
                                                            } else {
                                                                const { id, first_name, last_name, name, email, gender, picture } = data;

                                                                //create user
                                                                const newUser = new User({
                                                                    first_name: first_name,
                                                                    last_name: last_name,
                                                                    full_name: name,
                                                                    email: email,
                                                                    gender: gender,
                                                                    account_provider: "facebook",
                                                                    account_id: id,
                                                                    profile_picture_url: picture,
                                                                    updated_at: "",
                                                                    last_logged_in: ""

                                                                });

                                                                console.log("new User: ", newUser);

                                                                //save user
                                                                newUser.save()

                                                                .then(() => {
                                                                    res.status(201).json({ success: true, message: 'User Registered Successfully!' });
                                                                })

                                                                .catch(err => {
                                                                    if (err.code == 11000) {
                                                                        res.status(409).json({ success: false, message: 'User Already Registered!' });
                                                                    } else {
                                                                        res.status(500).json({ success: false, message: 'Internal Server Error!' });
                                                                    }
                                                                });
                                                                console.log("New User Data: ", data);
                                                            }
                                                        });

                                                } else {
                                                    console.log("this user already registered");
                                                    res.status(200).json({ success: true, user: JSON.stringify(users[0]) });
                                                }
                                            })
                                            .catch(err => res.status(500).json({ success: false, message: 'Internal Server error. \n' + err }));

                                    } else {
                                        console.log("Token expired");
                                        res.status(401).json({ success: false, message: "Token expired" });
                                    }
                                } else {
                                    console.log("Invalid Token");
                                    res.status(401).json({ success: false, message: "Invalid Token" });
                                }
                            }
                        });

                //const user = await User.findById("5a7876a7b662963dfccf80c5", {first_name: 1, last_name: 1, email: 1 });
                //res.status(201).json({success: true, user: JSON.stringify(user)});
                break;
            case "google":
                res.status(201).json({ success: true, user: "google" });
                break;

            default:
                {
                    console.log("Error", "Account provider not supported");
                    res.status(400).json({ success: false, message: "Account provider not supported" });
                }
        }


    },

    // route: /users/:userId
    getUser: async(req, res) => {
        const { userId } = req.params;
        const user = await User.findById(userId);
        if (!user) return res.status(400).json({ success: false });
        res.status(200).json(user);
    },

    replaceUser: async(req, res) => {
        const { userId } = req.params;
        const newUser = req.body;
        const result = await User.findByIdAndUpdate(userId, newUser);
        if (!result) return res.status(400).json({ success: false });
        res.status(200).json({ success: true });
    },

    updateUser: async(req, res) => {
        const { userId } = req.params;
        const newUser = req.body;
        const result = await User.findByIdAndUpdate(userId, newUser);
        if (!result) return res.status(400).json({ success: false });
        res.status(200).json({ success: true });
    },

    getUserAllFields: async(req, res) => {
        const { userId } = req.params;
        const user = User.findById(userId).populate('location');
        if (!user) return res.status(400).json({ success: false });
        res.status(200).json(user);
    },

    getUserLocations: async(req, res) => {
        const { userId } = req.params;
        const user = await User.findById(userId).populate('location');
        if (!user) return res.status(400).json({ success: false });
        res.status(200).json(user.location);
    },

    /*
        newUserLocation: async (req, res) =>{

            const { userId } = req.params;
            const newLocation = new Location(req.body);
            const user = await User.findById(userId);
            if(!user) return res.status(400).json({success: false});
            //console.log(user);
            // set expired current location
            const currentLocation = await Location.find({user_id: userId, status: "current"});

            console.log("currentLocation", currentLocation);


            if(currentLocation[0] != null){



            }

            newLocation.user_id = user._id;
            await newLocation.save();
            user.location.push(newLocation);
            await user.save();
            res.status(201).json({success: true, newLocation});
        },
    */



    //==== add new location start ===//
    addUserLocation: async(req, res) => {

        const { userId } = req.params;
        const newLocation = new Location(req.body)
        const user = await User.findById(userId);
        if (!user) return res.status(400).json({ success: false });
        console.log(user);
        // set expired current location
        const currentLocation = await Location.find({ user_id: userId, status: "current" });
        if (currentLocation[0] != null) {
            currentLocation[0].status = "expired";
            currentLocation[0].expired_at = Date.now();
            const loc_id = currentLocation[0]._id;
            const loc_update = await Location.findByIdAndUpdate(loc_id, currentLocation[0]);
        }

        newLocation.user_id = user._id;
        await newLocation.save();
        user.location.push(newLocation);
        await user.save();
        res.status(201).json({ success: true, newLocation });
    },
    //==== add new location end =====//
    getUserDevices: async(req, res) => {
        const { userId } = req.params;
        const user = await User.findById(userId).populate('devices');
        if (!user) return res.status(400).json({ success: false });
        res.status(200).json(user.devices);
    },
    newUserDevice: async(req, res) => {
        const { userId } = req.params;
        const newDevice = new Device(req.body);

        const currentDevice = await Device.find({ user_id: userId, using: true });
        const verifyDevice = await Device.find({ user_id: userId, device_id: newDevice.device_id });

        if (currentDevice[0] != null) {

            if (verifyDevice[0] != null) {

                //123456  123458

                if (currentDevice[0].device_id !== verifyDevice[0].device_id) {

                    currentDevice[0].using = false;
                    currentDevice[0].change_at = Date.now();
                    await currentDevice[0].save();

                    verifyDevice[0].using = true;
                    verifyDevice[0].change_at = Date.now();
                    await verifyDevice[0].save();

                    res.status(201).json({ success: true, message: verifyDevice[0] });

                } else {
                    res.status(200).json({ success: false, message: "This device is already in use." });
                }
            } else {
                currentDevice[0].using = false;
                currentDevice[0].change_at = Date.now();
                await currentDevice[0].save();

                const user = await User.findById(userId);
                if (!user) return res.status(400).json({ success: false });
                newDevice.user_id = user._id;
                await newDevice.save();
                user.devices.push(newDevice);
                await user.save();
                res.status(201).json({ success: true, newDevice });
            }

        } else {
            const user = await User.findById(userId);
            if (!user) return res.status(400).json({ success: false });
            newDevice.user_id = user._id;
            await newDevice.save();
            user.devices.push(newDevice);
            await user.save();
            res.status(201).json({ success: true, newDevice });
        }
    }

};