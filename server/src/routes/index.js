const express = require('express');
const { sendPix, receivePix } = require('../controllers/pixController');
const { payBill } = require('../controllers/paymentsController');
const { recharge } = require('../controllers/rechargeController');
const { getTransactions, getSummary, contest } = require('../controllers/transactionsController');
const { login } = require('../controllers/authController');
const { purchase, insurance, loan } = require('../controllers/servicesController');

const router = express.Router();

router.post('/auth/login', login);
router.post('/pix/send', sendPix);
router.post('/pix/receive', receivePix);
router.post('/payments', payBill);
router.post('/recharges', recharge);
router.post('/services/purchase', purchase);
router.post('/services/insurance', insurance);
router.post('/services/loan', loan);
router.get('/transactions', getTransactions);
router.get('/summary', getSummary);
router.post('/transactions/:id/contest', contest);

module.exports = router;
