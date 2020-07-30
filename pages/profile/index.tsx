import {loadStripe} from '@stripe/stripe-js'
import {GetServerSideProps} from 'next'
import {useRouter} from 'next/router'

import Layout from '../../components/site-layout'
import {useCreateSubscription, useViewerSubscription} from '../../hooks'
import {validateHeaderToken} from '../../utils'

const {NEXT_PUBLIC_STRIPE_PUBLIC_KEY} = process.env
const stripePromise =
  NEXT_PUBLIC_STRIPE_PUBLIC_KEY && loadStripe(NEXT_PUBLIC_STRIPE_PUBLIC_KEY)

const ProfilePage = () => {
  const router = useRouter()
  const viewerSubscription = useViewerSubscription()
  const createSubscription = useCreateSubscription()

  const doSubscribe = async () => {
    try {
      const sessionId = await createSubscription()

      if (!sessionId) {
        // TODO
        return
      }

      const stripe = (await stripePromise) as any
      const {error} = await stripe.redirectToCheckout({
        sessionId,
      })

      if (error) {
      } // TODO
    } catch (error) {
      if (error.message.match(/already subscribed/gi))
        console.error(
          'Subscription request cancelled. User already has an active subscription.',
        )
    }
  }

  const doUnsubscribe = async () => {
    try {
      await fetch('/api/checkout/unsubscribe', {
        method: 'DELETE',
      })

      router.reload()
    } catch (error) {
      console.log({error})
    } //TODO
  }

  const logout = async () => {
    try {
      await fetch('/api/logout', {
        method: 'POST',
      })

      router.push('/')
    } catch (error) {
      console.log({error})
    } //TODO
  }

  return (
    <Layout title="profile ~ liten" isAuthenticated={true}>
      <h2>Profile</h2>
      <button onClick={logout}>Log out</button>

      {!viewerSubscription ? (
        'Loading subscription...'
      ) : viewerSubscription.subscription?.status === 'active' ? (
        <p>
          You are subscribed!{' '}
          <span role="img" aria-label="Sparkles">
            ✨
          </span>
          <button onClick={doUnsubscribe}>Unsubscribe</button>
        </p>
      ) : (
        <button onClick={doSubscribe}>Subscribe</button>
      )}
    </Layout>
  )
}

export const getServerSideProps: GetServerSideProps = async ctx => {
  const token = validateHeaderToken(ctx.req.headers)

  if (!token)
    ctx.res
      .writeHead(301, {
        Location: '/login',
      })
      .end()

  return {props: {}}
}

export default ProfilePage
