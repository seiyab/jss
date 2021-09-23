/* eslint-disable react/prop-types */
import expect from 'expect.js'
import TestRenderer from 'react-test-renderer'
import * as React from 'react'
import {stripIndent} from 'common-tags'

import {JssProvider, SheetsRegistry, createUseStyles, withStyles} from '../src'
import createCommonDynamicStylesTests from '../test-utils/createCommonDynamicStylesTests'

const createGenerateId = () => {
  let counter = 0
  return rule => `${rule.key}-${counter++}`
}

describe('React-JSS: dynamic styles', () => {
  describe('using createUseStyles', () => {
    const createStyledComponent = (styles, options = {}) => {
      const useStyles = createUseStyles(styles, options)
      const Comp = props => {
        const classes = useStyles(props)
        if (props.getClasses) props.getClasses(classes)
        return null
      }
      Comp.displayName = options.name
      return Comp
    }

    createCommonDynamicStylesTests({createStyledComponent})
  })

  describe('using withStyles', () => {
    const createStyledComponent = (styles, options = {}) => {
      const Comp = ({getClasses, classes}) => {
        if (getClasses) getClasses(classes)
        return null
      }
      Comp.displayName = options.name
      return withStyles(styles, options)(Comp)
    }

    createCommonDynamicStylesTests({createStyledComponent})
  })

  it('issue', () => {
    const registry = new SheetsRegistry()
    const useStyles = createUseStyles({
      button: () => ({
        '&': {}
      })
    })
    const MyComponent = () => {
      const [x, setDummy] = React.useState(0)
      useStyles({x})
      return (
        <button type="button" onClick={() => setDummy(prev => prev + 1)}>
          {x}
        </button>
      )
    }

    const renderer = TestRenderer.create(
      <JssProvider registry={registry} generateId={createGenerateId()}>
        <MyComponent />
      </JssProvider>
    )

    expect(registry.toString()).to.be(stripIndent`
        .button-0 {}
        .button-d0-1 {}
        .button-d0-1 {}
      `)

    TestRenderer.act(() => {
      renderer.root.findByType('button').props.onClick()
    })
    TestRenderer.act(() => {
      renderer.root.findByType('button').props.onClick()
    })

    expect(registry.toString()).not.to.be(stripIndent`
        .button-0 {}
        .button-d0-1 {}
        .button-d0-1 {}
        .button-d0-1 {}
        .button-d0-1 {}
      `)

    expect(registry.toString()).to.be(stripIndent`
        .button-0 {}
        .button-d0-1 {}
        .button-d0-1 {}
      `)
  })
})
