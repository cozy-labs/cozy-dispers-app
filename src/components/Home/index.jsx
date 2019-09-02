import React from 'react'
import { Text, SubTitle } from 'cozy-ui/react/Text'
import { ButtonLink } from 'cozy-ui/react/Button'
import Card from 'cozy-ui/react/Card'

const Hero = require('cozy-ui/react/Hero').default
const { Title, Subtitle, Section, Sections, Paragraph, Icon } = Hero

const RED = '#f52d2d'
const PURPLE = '#a75bcb'
const BLUE = '#2d8af2'

export const Home = () => {
  let styles = {
    marginLeft: '20%',
    marginRight: '20%',
    marginTop: '100px'
  }

  return (
    <div className="todos">
      <h1>Cozy-DISPERS</h1>

      <Hero>
        <Title>Discover the statistic app that respects your privacy</Title>
        <Sections>
          <Section>
            <Icon color={RED} icon="personal-data" />
            <Subtitle>Aggregate very personal data</Subtitle>
            <Paragraph>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam.
            </Paragraph>
          </Section>
          <Section>
            <Icon color={PURPLE} icon="cloud-happy" />
            <Subtitle>Share your data for statistics</Subtitle>
            <Paragraph>
              Sed ut perspiciatis unde omnis iste natus error sit voluptatem
              accusantium doloremque laudantium, totam rem aperiam, eaque ipsa
              quae ab illo inventore.
            </Paragraph>
          </Section>
          <Section>
            <Icon color={BLUE} icon="certified" />
            <Subtitle>Still private by design</Subtitle>
            <Paragraph>
              Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet,
              consectetur, adipisci velit, sed quia non numquam eius modi
              tempora incidunt ut labore.
            </Paragraph>
          </Section>
        </Sections>
      </Hero>

      <div align="left" style={styles}>
        <Card>
          <h2>A network of Cozy-DISPERS</h2>
          <img src="schema_env_dispers_stacks.png" width="100%"></img>
        </Card>
        <br />
        <Card>
          <h2>Parallel computing</h2>
          <img src="schema_dispers_parellel.png" width="100%"></img>
        </Card>
        <br />
        <Card>
          <h2>The entire process</h2>
          <img src="schema_dispers_extended_mm.png" width="100%"></img>
        </Card>

        <br />
        <Card>
          <SubTitle className="u-mb-1">Docs Cozy-DISPERS</SubTitle>
          <Text className="u-mb-1">
            voluptatum deleniti atque corrupti quos dolores et quas molestias
            excepturi sint occaecati cupiditate non provident. Similique sunt in
            culpa qui officia.
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
            Id est laborum et dolorum fuga. At vero eos et accusamus et iusto
            odio dignissimos ducimus qui blanditiis praesentium.
          </Text>
          <ButtonLink
            label="Link to Repo"
            href="https://github.com/tintinmar1995/cozy-stack"
          />
        </Card>
      </div>
    </div>
  )
}

export default Home
