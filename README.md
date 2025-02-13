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
4000 0000 0000 9995  (Declined)
4000 0025 0000 3155  (3D Secure required)

### Test payment confirmations via webhook
stripe listen --forward-to http://localhost:3001/payment/webhook
