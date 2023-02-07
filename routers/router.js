const userRouter = require('../routers/user.router');
const houseRouter = require('../routers/house.router');
const productRouter = require('../routers/product.router');
const authRouter = require('../routers/auth.router');
const friendRouter = require('../routers/friend.router');


const router = require('express').Router();

router.use('/user', userRouter);
router.use('/house', houseRouter);
router.use('/product', productRouter);
router.use('/auth', authRouter);
router.use('/friend', friendRouter);


module.exports = router;