import Status from '../models/status'
import User from '../models/user'

export default {

    AddStatus: async(req, res) => {
        const { user_id, radar, location, status_body, status_images, privacy } = req.body;
        const user = await User.findById(user_id);
        if (!user) {
            return res.status(409).json({ sucess: false })
        }

        const StatusObj = new Status({
            user,
            status: [{
                radar_type: radar,
                status_body,
                privacy,
                location,
                status_images
            }]
        });
        await StatusObj.save();
        user.status.push(StatusObj);
        await user.save();
        res.status(200).json({ sucess: true });
    },

    GetAllStatus: async(req, res) => {
        const AllStatus = await Status.find({}).populate("user");
        res.status(200).json(AllStatus)
    },


    GetAllStatusBySpecificUser: async(req, res) => {
        const AllStatus = await Status.find({ user: req.params.UserID });
        res.status(200).json(AllStatus)
    },

    UpdateStatus: async(req, res) => {
        const data = req.body;
        data.edited_at = Date.now();
        const status = await Status.findById(req.params.StatusID);
        status.status.push(data);
        status.edited = true;
        await status.save();
        res.status(200).json(status);
    },

    DeleteStatusByID: async(req, res) => {

    }
}