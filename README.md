# eproprietar-fe
NextJs with MobX frontend for EProprietar project

## Deploy in Vercel
vercel login
vercel dev # debugging locally
vercel # deploy
vercel --prod --force # clear cache and force deploy

## Test payments

### Test credit cards
4242 4242 4242 4242  (Visa - Always succeeds)
4000 0000 0000 0002	Card declined
4000 0000 0000 9995	Insufficient funds
4000 0000 0000 9987	Lost card
4000 0000 0000 9979	Stolen card
4000 0000 0000 0069	Expired card

### Failure simulation
3D Secure Fail (4000 0027 6000 3184)	Fails after verification	✅ Yes
review.opened → review.closed	Stripe flags transaction for review	❌ No (but webhook triggers failure)
charge.dispute.created	Simulates a chargeback	❌ No (handled via webhook)

### Test payment confirmations via webhook
stripe listen --forward-to http://localhost:3001/payment/webhook

### List stripe transactions
stripe checkout sessions list --limit 5
