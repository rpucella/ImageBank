import React, {useState} from 'react'
import {useAsync} from 'react-async'
import styled from 'styled-components'
import axios from 'axios'
import {Link} from './link'

const Pager = ({page, total, setPage}) => 
  total > 10 ? <FullPager page={page} total={total} setPage={setPage} />
             : <PartialPager page={page} total={total} setPage={setPage} />

const FullPager = ({page, total, setPage}) => {
  const start = (page - 3) > 1 ? (page - 3) : 1
  const end = (page + 3) < total ? (page + 3) : total
  const switchTo = (p) => () => setPage(p)
  return (
  <nav className="pagination" role="navigation" aria-label="pagination">
    <Link className="pagination-previous" onClick={switchTo(page - 1)} disabled={page === 1}> Previous </Link>
    <Link className="pagination-next" onClick={switchTo(page + 1)} disabled={page === total}> Next </Link>
    <ul className="pagination-list">
      { page > 4 && 
          <li>   
            <Link className="pagination-link" onClick={switchTo(1)}> 1 </Link>
          </li>
      }
      { page > 5 && 
          <li>
            <span className="pagination-ellipsis">&hellip;</span>      
          </li>
      }
      { Array.from(new Array(end - start)).map((_, i) => {
        const p = i + start
        const cls = 'pagination-link' + (p === page ? ' is-current' : '')
	return (
          <li key={'page' + p}>   
            <Link className={cls} onClick={switchTo(p)}> {p} </Link>
          </li>
	)
      })}
      { page < total - 4 && 
          <li>
            <span className="pagination-ellipsis">&hellip;</span>      
          </li>
      }
      { page < total - 3 && 
          <li>   
            <Link className="pagination-link" onClick={switchTo(total)}> {total} </Link>
          </li>
      }
    </ul>
  </nav>
  )
}

const PartialPager = ({page, total, setPage}) =>  {
  const switchTo = (p) => () => setPage(p)
  return <nav className="pagination" role="navigation" aria-label="pagination">
    <Link className="pagination-previous" onClick={switchTo(page - 1)} disabled={page === 1}> Previous </Link>
    <Link className="pagination-next" onClick={switchTo(page + 1)} disabled={page === total}> Next </Link>
    <ul className="pagination-list">
      { Array.from(new Array(total)).map((_, i) => {
          const p = i + 1
	  const cls = 'pagination-link' + (p === page ? ' is-current' : '')
          return <li key={'page' + p}><Link className={cls} onClick={switchTo(p)}> {p} </Link></li>
      }) }
    </ul>
  </nav>
}

export {Pager}
