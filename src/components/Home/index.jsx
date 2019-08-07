import React from 'react'
import { Text, SubTitle } from 'cozy-ui/react/Text'
import { ButtonLink } from 'cozy-ui/react/Button'
import Card from 'cozy-ui/react/Card'

export const Home = () => {
  let styles = {
    marginLeft: '20%',
    marginRight: '20%'
  }

  return (
    <div className="todos">
      <h1>Discover Cozy-DISPERS</h1>
      <div align="left" style={styles}>
        <Card>
          <SubTitle className="u-mb-1">Docs Cozy-DISPERS</SubTitle>
          <Text className="u-mb-1">
            This is some card content. Content can be small or huge.
          </Text>
          <ButtonLink
            label="Link to Docs"
            href="https://github.com/tintinmar1995/cozy-stack/tree/enclaves-docs/docs"
          />
        </Card>

        <br />

        <Card>
          <SubTitle className="u-mb-1">GitHub</SubTitle>
          <Text className="u-mb-1">
            This is some card content. Content can be small or huge.
          </Text>
          <ButtonLink
            label="Link to Repo"
            href="https://github.com/tintinmar1995/cozy-stack"
          />
        </Card>

        <br />
        <br />
      </div>
    </div>
  )
}

export default Home
