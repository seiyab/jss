/* eslint-disable react/prop-types */

import * as React from 'react'
import TestRenderer from 'react-test-renderer'
import {renderToString} from 'react-dom/server'
import expect from 'expect.js'
import {stripIndent} from 'common-tags'
import createCommonBaseTests from '../test-utils/createCommonBaseTests'
import {getCss, getStyle, removeWhitespace, resetSheets} from '../../../tests/utils'
import {createUseStyles, JssProvider, SheetsRegistry} from '.'

const createStyledComponent = (styles, options) => {
  const useStyles = createUseStyles(styles, options)
  const Comp = (props) => {
    useStyles(props)
    return null
  }
  return Comp
}

describe('React-JSS: createUseStyles', () => {
  createCommonBaseTests({createStyledComponent})

  describe('theme prop', () => {
    it('should pass theme from props priority', () => {
      const registry = new SheetsRegistry()

      const styles = (theme) => ({
        button: {color: theme.exampleColor || 'green'}
      })

      const MyComponent = createStyledComponent(styles)

      renderToString(
        <JssProvider registry={registry} generateId={() => 'button'}>
          <MyComponent theme={{exampleColor: 'blue'}} />
        </JssProvider>
      )
      expect(registry.toString()).to.be(stripIndent`
      .button {
        color: blue;
      }
    `)
    })
  })
})

const useStyles = createUseStyles({
  item: props => ({
    color: props.active ? 'red' : 'blue',
    '&:hover': {
      fontSize: 60
    }
  })
})

function Item({active = false, onClick, children}) {
  const classes = useStyles({active})
  return (
    <button type="button" className={classes.item} onClick={onClick}>
      {children}
    </button>
  )
}

function App() {
  const [activeKey, setActiveKey] = React.useState(1)
  return (
    <main>
      {[1, 2].map(key => (
        <Item key={key} active={key === activeKey} onClick={() => setActiveKey(key)}>
          {key}
        </Item>
      ))}
    </main>
  )
}

describe('', () => {
  beforeEach(resetSheets())

  let registry
  let root
  beforeEach(() => {
    registry = new SheetsRegistry()

    TestRenderer.act(() => {
      root = TestRenderer.create(
        <JssProvider registry={registry} generateId={(rule) => `${rule.key}-id`}>
          <App />
        </JssProvider>
      )
    })
  })

  describe.skip('v10.8.0', () => {
    describe('initial style', () => {
      it('registry', () => {
        expect(registry.toString()).to.be(stripIndent`
          .item-id {}
          .item-d0-id {
            color: red;
          }
          .item-d0-id:hover {
            font-size: 60px;
          }
          .item-d1-id {
            color: blue;
          }
          .item-d1-id:hover {
            font-size: 60px;
          }
        `)
      })
      it('DOM', () => {
        const style = getStyle()
        expect(getCss(style)).to.be(
          removeWhitespace(stripIndent`
          .item-id {}
          .item-d0-id {
            color: red;
          }
          .item-d0-id:hover {
            font-size: 60px;
          }
          .item-d1-id {
            color: blue;
          }
          .item-d1-id:hover {
            font-size: 60px;
          }
        `)
        )
      })
    })

    describe('after click', () => {
      beforeEach(() => {
        TestRenderer.act(() => {
          root.root.findAllByType('button')[1].props.onClick()
        })
      })

      it('registry', () => {
        expect(registry.toString()).to.be(stripIndent`
          .item-id {}
          .item-d0-id {
            color: blue;
          }
          .item-d0-id:hover {
            font-size: 60px;
          }
          .item-d0-id:hover {
            font-size: 60px;
          }
          .item-d1-id {
            color: red;
          }
          .item-d1-id:hover {
            font-size: 60px;
          }
          .item-d1-id:hover {
            font-size: 60px;
          }
        `)
      })
      it('DOM', () => {
        const style = getStyle()
        expect(getCss(style)).to.be(
          removeWhitespace(stripIndent`
          .item-id {}
          .item-d0-id {
            color: blue;
          }
          .item-d0-id:hover {
            font-size: 60px;
          }
          .item-d1-id {
            color: red;
          }
          .item-d1-id:hover {
            font-size: 60px;
          }
          .item-d0-id:hover {
            font-size: 60px;
          }
          .item-d1-id:hover {
            font-size: 60px;
          }
        `)
        )
      })
    })
  })

  describe.skip('v10.8.1', () => {
    describe('initial style', () => {
      it('registry', () => {
        expect(registry.toString()).to.be(stripIndent`
          .item-id {}
          .item-d0-id {
            color: red;
          }
          .item-d0-id:hover {
            font-size: 60px;
          }
          .item-d1-id {
            color: blue;
          }
          .item-d1-id:hover {
            font-size: 60px;
          }
        `)
      })
      it('DOM', () => {
        const style = getStyle()
        expect(getCss(style)).to.be(
          removeWhitespace(stripIndent`
          .item-id {}
          .item-d0-id {
            color: red;
          }
          .item-d0-id:hover {
            font-size: 60px;
          }
          .item-d1-id {
            color: blue;
          }
          .item-d1-id:hover {
            font-size: 60px;
          }
        `)
        )
      })
    })

    describe('after click', () => {
      beforeEach(() => {
        TestRenderer.act(() => {
          root.root.findAllByType('button')[1].props.onClick()
        })
      })

      it('registry', () => {
        expect(registry.toString()).to.be(stripIndent`
          .item-id {}
          .item-d0-id {
            color: blue;
          }
          .item-d0-id:hover {
            font-size: 60px;
          }
          .item-d1-id {
            color: red;
          }
          .item-d1-id:hover {
            font-size: 60px;
          }
        `)
      })
      it('DOM', () => {
        const style = getStyle()
        expect(getCss(style)).to.be(
          removeWhitespace(stripIndent`
          .item-id {}
          .item-d0-id {
            color: blue;
          }
          .item-d0-id:hover {
            font-size: 60px;
          }
          .item-d1-id:hover {
            font-size: 60px;
          }
          .item-d1-id:hover {
            font-size: 60px;
          }
        `)
        )
      })
    })
  })

  describe('use cssRules.splice', () => {
    describe('initial style', () => {
      it('registry', () => {
        expect(registry.toString()).to.be(stripIndent`
          .item-id {}
          .item-d0-id {
            color: red;
          }
          .item-d0-id:hover {
            font-size: 60px;
          }
          .item-d1-id {
            color: blue;
          }
          .item-d1-id:hover {
            font-size: 60px;
          }
        `)
      })
      it('DOM', () => {
        const style = getStyle()
        expect(getCss(style)).to.be(
          removeWhitespace(stripIndent`
          .item-id {}
          .item-d0-id {
            color: red;
          }
          .item-d0-id:hover {
            font-size: 60px;
          }
          .item-d1-id {
            color: blue;
          }
          .item-d1-id:hover {
            font-size: 60px;
          }
        `)
        )
      })
    })

    describe('after click', () => {
      beforeEach(() => {
        TestRenderer.act(() => {
          root.root.findAllByType('button')[1].props.onClick()
        })
      })

      it('registry', () => {
        expect(registry.toString()).to.be(stripIndent`
          .item-id {}
          .item-d0-id {
            color: blue;
          }
          .item-d0-id:hover {
            font-size: 60px;
          }
          .item-d1-id {
            color: red;
          }
          .item-d1-id:hover {
            font-size: 60px;
          }
        `)
      })
      it('DOM', () => {
        const style = getStyle()
        expect(getCss(style)).to.be(
          removeWhitespace(stripIndent`
          .item-id {}
          .item-d0-id {
            color: blue;
          }
          .item-d0-id:hover {
            font-size: 60px;
          }
          .item-d1-id {
            color: red;
          }
          .item-d1-id:hover {
            font-size: 60px;
          }
        `)
        )
      })
    })
  })
})
