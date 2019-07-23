import React from 'react'
import styled from 'styled-components'

const Container = styled.div`
  background: #fff;
  min-height: 100vh;
  padding: 80px;

  h2 {
    font-weight: 500;
  }

  p {
    margin-top: 32px;
    max-width: 700px;
    text-align: justify;
  }
`

const Privacy = () => (
  <Container>
    <h2>Privacy policy</h2>
    <p>
      We may collect non-personal identification information about Users
      whenever they interact with our Site. Non-personal identification
      information may include the browser name, the type of computer and
      technical information about Users means of connection to our Site, such as
      the operating system and the Internet service providers utilized and other
      similar information.
    </p>
    <p>
      Ads appearing on our site may be delivered to Users by advertising
      partners, who may set cookies. These cookies allow the ad server to
      recognize your computer each time they send you an online advertisement to
      compile non personal identification information about you or others who
      use your computer. This information allows ad networks to, among other
      things, deliver targeted advertisements that they believe will be of most
      interest to you. This privacy policy does not cover the use of cookies by
      any advertisers.
    </p>
    <p>
      HexArena.io has the discretion to update this privacy policy at any time.
      When we do, we will revise the updated date at the bottom of this page. We
      encourage Users to frequently check this page for any changes to stay
      informed about how we are helping to protect the personal information we
      collect. You acknowledge and agree that it is your responsibility to
      review this privacy policy periodically and become aware of modifications.
    </p>
    <p>
      By using this Site, you signify your acceptance of this policy. If you do
      not agree to this policy, please do not use our Site. Your continued use
      of the Site following the posting of changes to this policy will be deemed
      your acceptance of those changes. This document was last updated on July
      23, 2019.
    </p>
  </Container>
)

export default Privacy
