import {loadStripe} from '@stripe/stripe-js'
import {GetServerSideProps} from 'next'
import {useRouter} from 'next/router'

import Button from '../../components/button'
import Layout from '../../components/site-layout'
import {useCreateSubscription, useViewerSubscription} from '../../hooks'
import {AuthToken} from '../../interfaces'
import {validateHeaderToken} from '../../lib'
import PageHeader from '../../components/page-header'

const {NEXT_PUBLIC_STRIPE_PUBLIC_KEY} = process.env
const stripePromise = NEXT_PUBLIC_STRIPE_PUBLIC_KEY
  ? loadStripe(NEXT_PUBLIC_STRIPE_PUBLIC_KEY)
  : null

type Props = {
  token: AuthToken
}

const ProfilePage = ({token}: Props) => {
  const viewerSubscription = useViewerSubscription()
  const createSubscription = useCreateSubscription()
  const router = useRouter()

  const doSubscribe = async () => {
    try {
      const sessionId = await createSubscription()

      if (!sessionId) throw new Error('Error creating checkout session')

      const stripe = await stripePromise
      const checkoutResult = await stripe?.redirectToCheckout({
        sessionId,
      })

      if (checkoutResult?.error) throw new Error(checkoutResult.error.message)
    } catch (error) {
      if (error.message.match(/already subscribed/gi))
        console.error(
          'Subscription request cancelled. User already has an active subscription.',
        )
      else console.error(error.message)
      // TODO
    }
  }

  const doUnsubscribe = async () => {
    try {
      await fetch('/api/checkout/unsubscribe', {
        method: 'DELETE',
      })

      router.reload()
    } catch (error) {
      console.error({error})
      // TODO
    }
  }

  const logout = async () => {
    try {
      await fetch('/api/logout', {
        method: 'POST',
      })

      router.push('/')
    } catch (error) {
      console.error({error})
      // TODO
    }
  }

  return (
    <Layout title="profile ~ liten" isAuthenticated={true}>
      <PageHeader title="Profile" subtitle={token.email} />

      <section className="container mt-8 px-4 sm:px-8 lg:mt-10 xl:px-20  mx-auto md:text-center">
        <p>
          Email: <span className="text-gray-700">{token.email}</span>
        </p>
        {!viewerSubscription ? null : viewerSubscription.subscription
            ?.status === 'active' ? (
          <p>
            Subscription: <span className="text-green-700">Active</span>
          </p>
        ) : (
          <p>
            Subscription: <span className="text-red-700">None</span>
          </p>
        )}

        {!viewerSubscription ? (
          'Loading subscription details...'
        ) : viewerSubscription.subscription?.status === 'active' ? (
          <>
            <p>
              Start date:{' '}
              <span className="text-gray-700">
                {new Date(
                  viewerSubscription.subscription.start_date * 1000,
                ).toLocaleDateString()}
              </span>
            </p>
            <p>
              End of current period:{' '}
              <span className="text-gray-700">
                {new Date(
                  viewerSubscription.subscription.current_period_end * 1000,
                ).toLocaleDateString()}
              </span>
            </p>

            <button
              className="my-2 underline text-red-700 hover:text-gray-700"
              onClick={doUnsubscribe}
            >
              Unsubscribe
            </button>
          </>
        ) : (
          <Button className="mt-8 mb-6 md:mx-auto" onClick={doSubscribe}>
            Subscribe
          </Button>
        )}

        <Button className="mt-8 mb-6 md:mx-auto" onClick={logout} invert>
          Log out
        </Button>
      </section>
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

  return {props: {token}}
}

export default ProfilePage
