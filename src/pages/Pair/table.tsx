import React from 'react'
import { Link } from 'react-router-dom'
import './index.css'

const useSortableData = (items: any, _config = null) => {
  const [sortConfig, setSortConfig] = React.useState<any | null>(null)

  const sortedItems = React.useMemo(() => {
    const sortableItems = [...items]
    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1
        }
        return 0
      })
    }
    return sortableItems
  }, [items, sortConfig])

  const requestSort = (key: any) => {
    let direction = 'ascending'
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending'
    }
    setSortConfig({ key, direction })
  }

  return { items: sortedItems, requestSort, sortConfig }
}

export const Table = (props: { products: any; caption: string; nftURL: string | undefined }) => {
  const { items, requestSort, sortConfig } = useSortableData(props.products)
  const getClassNamesFor = (name: string) => {
    if (!sortConfig) {
      return
    }
    return sortConfig.key === name ? sortConfig.direction : undefined
  }

  const rowHeader: any[] = Object.keys(items[0])
  const rowValue: any[] = Object.values(items)

  return (
    <table
      style={{
        // maxWidth: 'max-content',
        border: '2px solid black',
      }}
    >
      {/* <caption>{props.caption}</caption> */}
      <thead>
        <tr>
          {rowHeader.map((rowHeader: string) => (
            <th key={rowHeader}>
              {' '}
              <div
                style={{
                  justifyContent: 'center',
                  display: 'flex',
                }}
              >
                <button
                  style={{
                    background: 'transparent',
                  }}
                  type="button"
                  onClick={() => requestSort(rowHeader)}
                  className={getClassNamesFor(rowHeader)}
                >
                  {rowHeader}
                </button>
              </div>
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rowValue.map((rowHeader: any) => (
          <tr key={rowHeader}>
            {Object.entries(rowHeader).map(([key, value]) => (
              <Td key={key} to={key} nftURL={props.nftURL}>
                {value}
              </Td>
            ))}{' '}
          </tr>
        ))}
      </tbody>
    </table>
  )
}
type tdprops = {
  to: any
  children: any
  nftURL: string | undefined
}
export function Td({ to, children, nftURL }: tdprops) {
  // Conditionally wrapping content into a link
  // const ContentTag = to ? Link : 'div';
  const defaultStyle = {
    textDecoration: 'auto',
    color: 'blue',
    justifyContent: 'center',
    display: 'flex',
  }
  const conditionalStyle = (): any => {
    if (to == 'Total Value' || to == 'In Token' || to == 'Out Token') {
      return {
        defaultStyle,
      }
    }
    return defaultStyle
  }
  const childrenCopy = children
  if (typeof children === 'string') {
    if (children.substring(0, 2) == '0x') {
      children = children.substring(0, 4) + '...' + children.substring(children.length - 4, children.length)
    }
  }
  const redirect = '/pair/0xdc9232e2df177d7a12fdff6ecbab114e2231198d'
  // if (nftURL) {
  //   redirect += nftURL
  // }
  let link = '/pair/' + children
  if (to == 'Account') {
    link = 'https://polygonscan.com/address/' + childrenCopy
  }
  if (to == 'TransactionId') {
    link = 'https://polygonscan.com/tx/' + childrenCopy
  }

  if (to == 'Total Value' || to == 'In Token' || to == 'Out Token') {
    return (
      <td>
        <div
          style={{
            justifyContent: 'center',
            display: 'flex',
          }}
        >
          {children}
        </div>
      </td>
    )
  }
  const abc: any = {}
  return (
    <td onClick={() => handleOnClick(link, to)}>
      <Link style={defaultStyle} to={redirect}>
        {children}
      </Link>
    </td>
  )
}
function handleOnClick(link: string, to: string) {
  if (to != 'Total Value' && to != 'In Token' && to != 'Out Token') {
    window.open(link)
  }
}
