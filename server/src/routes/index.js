const express = require('express');
const { sendPix, receivePix } = require('../controllers/pixController');
const { payBill } = require('../controllers/paymentsController');
const { recharge } = require('../controllers/rechargeController');
const { getTransactions, getSummary } = require('../controllers/transactionsController');
const { login } = require('../controllers/authController');

const router = express.Router();

router.post('/auth/login', login);
router.post('/pix/send', sendPix);
router.post('/pix/receive', receivePix);
router.post('/payments', payBill);
router.post('/recharges', recharge);
router.get('/transactions', getTransactions);
router.get('/summary', getSummary);

module.exports = router;
