const db = require('../models');

const roleService = {

    add: async(userId, houseId) => {

        console.log("user -> ", userId);
        console.log("house -> ", houseId);

        const hasAdmin = userId;

        await db.MTM_house_user.create({
            userId,
            houseId,
            hasAdmin
        });

    },

    // relationExist: async (user, house) => {

    //     const relationExist = await db.MTM_house_user.findOne({
    //         where: {
    //             user: {
    //                 [Op.or]: [user, house]
    //             },
    //             friend: {
    //                 [Op.or]: [house, user]
    //             }
    //         },
    //     });

    //     console.log("Je suis relationExist AVANT d'être vérifier par les IF -> ", relationExist);

    //     if (relationExist === null) {
    //         console.log("Je suis relationExist = null -> ", relationExist);

    //         return false;
    //     }
        
    //     console.log("RELATION ID ->", relationExist.dataValues.id);

    //     return relationExist.dataValues.id;
    // },
}

module.exports = roleService;