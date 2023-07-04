const Category = require("../models/category");
const paypal = require('paypal-rest-sdk');
paypal.configure({
    mode: 'sandbox',
    client_id: 'AQpeJY3g-lJHZ1y4nHamiDFE-Szus8asA9jDr0pcuJgd9ElZwwQ_1V0df2JT9hkNYotHco670pcdMGdb',
    client_secret: 'EK_ufovz_DZBuBPtMAoU43-sCPcA2CikwMz9YD4iSVvrecko_OjgyBYHQ4m7k884zvExx0IM_hliaFdE'
  });
class APIPaypal{

    //đọc tất cả các product
    async createPayment(req,res){
      const total = req.body.totalPrice;
        const payment = {
            intent: 'sale',
            payer: {
              payment_method: 'paypal'
            },
            redirect_urls: {
              return_url: 'http://localhost:3000/api/success',
              cancel_url: 'http://localhost:3000/api/cancel'
            },
            transactions: [{
              amount: {
                total:  total.toString(),
                currency: 'USD'
              },
              description: 'Payment description'
            }]
          };
        paypal.payment.create(payment, (error, payment) => {
            if (error) {
              console.error(error);
              res.sendStatus(500);
            } else {
                // for (let i = 0; i < payment.links.length; i++) {
                //     if (payment.links[i].rel === 'approval_url') {
                //       res.json(payment.links[i].href);
                //       break; // Exit the loop after finding the approval URL
                //     }
                //   }
                res.json({ approval_url: payment.links[1].href });
            }
          });

    }
    async executePayment(req,res){
        const payerId = req.query.PayerID;
        const paymentId = req.query.paymentId;
        const executePayment = {
            payer_id: payerId
        };

        paypal.payment.execute(paymentId, executePayment, (error, payment) => {
            if (error) {
                console.error(error);
            } else {
                console.log(payment);
            }
        });

        res.redirect('/thank-you');
    }

    async cancelPayment(req, res) {
        res.redirect('/payment-cancelled');
      }


}
module.exports =  new APIPaypal;