import { useState, useEffect } from 'react';
import { supabase } from '../utils/supabaseClient';
import { Session } from '@supabase/supabase-js';
import DocPhoto from './DocPhoto';

export interface KycProps {
  phone: string, 
  first_name: string,
  last_name: string,
  country: string,
  city: string,
  doc_url: string
}

export default function Kyc(props: { session: Session }) {
  const [loading, setLoading] = useState(true)
  const [phone, setPhone] = useState('')
  const [first_name, setFirstName] = useState('')
  const [last_name, setLastName] = useState('')
  const [country, setCountry] = useState('')
  const [city, setCity] = useState('')
  const [doc_url, setDocUrl] = useState('')

  useEffect(() => {
    getProfile()
  }, [props.session])

  async function getProfile() {
    try {
      setLoading(true)
      const user = supabase.auth.user()

      let { data, error, status } = await supabase
        .from('kyc')
        .select(`id, phone, first_name, last_name, country, city, doc_url`)
        .eq('id', user?.id)
        .single()

      if (error && status !== 406) {
        throw error
      }

      if (data) {
        setPhone(data.phone)
        setFirstName(data.first_name)
        setLastName(data.last_name)
        setCountry(data.country)
        setCity(data.city)
        setDocUrl(data.doc_url)
      }
    } catch (error) {
      alert(error.message)
    } finally {
      setLoading(false)
    }
  }

  async function updateProfile(props: KycProps) {
    try {
      setLoading(true)
      const user = supabase.auth.user()

      const updates = {
          id: user?.id,
          phone: props.phone,
          first_name: props.first_name,
          last_name: props.last_name,
          country: props.country,
          city: props.city,
          doc_url: props.doc_url,
          updated_at: new Date(),
      }

      let { error } = await supabase.from('kyc').upsert(updates, {
          returning: 'minimal', // Don't return the value after inserting
      })

    if (error) {
      throw error
    }
    } catch (error) {
      alert(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="form-widget">
    <div>
      <label htmlFor="email">Email</label>
      <input id="email" type="text" value={props?.session?.user?.email} disabled />
    </div>
    <div>
      <label htmlFor="first_name">First name</label>
      <input
      id="first_name"
      type="text"
      value={first_name || ''}
      onChange={(e) => setFirstName(e.target.value)}
      />
    </div>
    <div>
      <label htmlFor="last_name">Last name</label>
      <input
      id="last_name"
      type="text"
      value={last_name || ''}
      onChange={(e) => setLastName(e.target.value)}
      />
    </div>
    <div>
      <label htmlFor="phone">Phone number</label>
      <input
      id="phone"
      type="tel"
      value={phone || ''}
      onChange={(e) => setPhone(e.target.value)}
      />
    </div>
    <div>
      <label htmlFor="country">Country</label>
      <input
      id="country"
      type="text"
      value={country || ''}
      onChange={(e) => setCountry(e.target.value)}
      />
    </div>
    <div>
      <label htmlFor="city">City</label>
      <input
      id="city"
      type="text"
      value={city || ''}
      onChange={(e) => setCity(e.target.value)}
      />
    </div>
    <div>
    <DocPhoto
      url={doc_url}
      size={150}

      onUpload={(filePath) => {
        console.log(filePath)
        setDocUrl(filePath)
        console.log(`${filePath} | ${doc_url}`)
        updateProfile({ first_name, last_name, phone, country, city, doc_url: filePath })
      }}
    />
    </div>

    <div>
      <button
      className="button block primary"
      onClick={() => updateProfile({ first_name, last_name, phone, country, city, doc_url  })}
      disabled={loading}
      >
      {loading ? 'Loading ...' : 'Update'}
      </button>
    </div>

    <div>
      <button className="button block" onClick={() => supabase.auth.signOut()}>
      Sign Out
      </button>
    </div>
    </div>
  )
}