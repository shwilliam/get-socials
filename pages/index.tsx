import {GetServerSideProps} from 'next'

import Hero from '../components/hero'
import NewLinkForm from '../components/new-link-form'
import Layout from '../components/site-layout'
import {AuthToken} from '../interfaces'
import {validateHeaderToken} from '../lib'

type Props = {
  token: AuthToken
}

const IndexPage = ({token}: Props) => (
  <Layout title="home ~ liten" isAuthenticated={!!token}>
    <h1 className="sr-only">liten</h1>

    <Hero />

    <div className="bg-orange-600 py-8 pb-10 sm:py-10 sm:pb-12">
      <div className="container px-4 sm:px-8 lg:my-8 xl:px-20 mx-auto">
        <NewLinkForm />
      </div>
    </div>
  </Layout>
)

export const getServerSideProps: GetServerSideProps = async (ctx: any) => {
  const token = validateHeaderToken(ctx.req.headers)

  return {props: {token}}
}

export default IndexPage
