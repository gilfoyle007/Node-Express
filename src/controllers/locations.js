import User from '../models/user'
import Location from '../models/location'
import Device from '../models/device'


export default {
    // returns all location
    index: async(req, res) => {
        const locations = await Location.find({});
        console.log(locations)
        res.status(200).json(locations);
    },
    //returns all current locations of all user
    getCurrentLocations: async(req, res) => {
        const currentLocations = await Location.find({ status: "current" });
        res.status(200).json(currentLocations);
    },

    //get all locations of single user
    getAllLocationsOfaUser: async(req, res) => {
        const { userId } = req.params;
        const user = await User.findById(userId).populate('location');
        res.status(200).json(user.location);
    },
    getCurrentLocationOfaUser: async(req, res) => {
        const { userId } = req.params;
        const currentLocation = await Location.find({ user_id: userId, type: "current" });
        res.status(200).json(currentLocation);
    }

};