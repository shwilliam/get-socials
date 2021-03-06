import PageHeader from '../components/page-header'
import Layout from '../components/site-layout'
import PageWrapper from '../components/page-wrapper'

const LAST_UPDATE_DATE = '27 July 2020'

const PrivacyPolicyPage = () => (
  <Layout title="privacy policy ~ liten">
    <PageHeader title="Privacy Policy" />

    <PageWrapper>
      <p className="my-4 leading-relaxed">
        Your privacy is important to us. It is liten&apos;s policy to respect
        your privacy regarding any information we may collect from you across
        our website, <a href="https://liten.xyz">https://liten.xyz</a>.
      </p>
      <p className="my-4 leading-relaxed">
        We only ask for personal information when we truly need it to provide a
        service to you. We collect it by fair and lawful means, with your
        knowledge and consent. We also let you know why we’re collecting it and
        how it will be used.
      </p>
      <p className="my-4 leading-relaxed">
        We only retain collected information for as long as necessary to provide
        you with your requested service. What data we store, we’ll protect
        within commercially acceptable means to prevent loss and theft, as well
        as unauthorized access, disclosure, copying, use or modification.
      </p>
      <p className="my-4 leading-relaxed">
        We don’t share any personally identifying information publicly or with
        third-parties, except when required to by law.
      </p>
      <p className="my-4 leading-relaxed">
        Our website may link to external sites that are not operated by us.
        Please be aware that we have no control over the content and practices
        of these sites, and cannot accept responsibility or liability for their
        respective privacy policies.
      </p>
      <p className="my-4 leading-relaxed">
        You are free to refuse our request for your personal information, with
        the understanding that we may be unable to provide you with some of your
        desired services.
      </p>
      <p className="my-4 leading-relaxed">
        Your continued use of our website will be regarded as acceptance of our
        practices around privacy and personal information. If you have any
        questions about how we handle user data and personal information, feel
        free to contact us.
      </p>
      <p className="my-4 leading-relaxed">
        This policy was last updated and is effective as of {LAST_UPDATE_DATE}.
      </p>
    </PageWrapper>
  </Layout>
)

export default PrivacyPolicyPage
