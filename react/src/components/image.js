import React, {useState} from 'react'
import {useAsync} from 'react-async'
import axios from 'axios'

const fetchImage = async ({link}) => {
  const { data } = await axios.get('http://localhost:8501' + link, { responseType: 'blob'})
  const result = URL.createObjectURL(data)
  return result
}

const Image = ({img}) => {
  const { isPending, data, error } = useAsync({promiseFn: fetchImage, link: img.link})
  return  <div className="columns">
    <div className="column">
      { data && <img src={data} width="100%" /> }
      { error && <p>ERROR - {JSON.stringify(error)}</p> }
    </div>
    <div className="column">
      <div className="content">
      { img.content.map((line) => <p key={line}>{line}</p>) }
      <div className="field">
        <div className="control">
          <div className="buttons">
            <a href="/edit/{{img['uuid']}}" className="button is-small is-link" id="button-edit">Edit</a>
            { img.draft ? 
                <button className="button is-small is-link ib-publish" data-uid="{{img['uuid']}}">Publish</button>
              : 
                <button className="button is-small is-link ib-draft" data-uid="{{img['uuid']}}">Draft</button>
            }
           { img.tags.map((t) => <a href="/tag/{{t}}" className="button is-rounded is-small is-link is-light">{t}</a>) }
          </div>
        </div>
      </div>
      <div className="dates">
      <p>Created: { img['date_created'] }</p>
      <p>Updated: { img['date_updated'] }</p>
    { img.date_published && <p>Published: { img.date_published }</p> }
      </div>
    </div>
  </div>
  </div>
}

export {Image}
